#!/usr/bin/env node
/**
 * Post-build check: dist/ must contain the full PHP API for Hostinger deploy.
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');
const api = join(dist, 'api');

const required = [
  'dist/.htaccess',
  'dist/index.html',
  'dist/api/bootstrap.php',
  'dist/api/index.php',
  'dist/api/health.php',
  'dist/api/config.php',
  'dist/api/create-order.php',
  'dist/api/capture-order.php',
  'dist/api/.htaccess',
  'dist/api/routes/api.php',
  'dist/api/routes/chat.php',
  'dist/api/routes/admin.php',
  'dist/api/routes/community.php',
  'dist/api/routes/blog.php',
  'dist/api/services/AiWorkflow.php',
  'dist/api/services/ConversationStore.php',
  'dist/api/services/OpenAiClient.php',
  'dist/api/services/BlogStore.php',
  'dist/api/services/FaqMatchService.php',
  'dist/api/services/AdminStatsService.php',
  'dist/api/services/KnowledgeStore.php',
  'dist/api/services/LeadStore.php',
  'dist/api/services/UploadService.php',
  'dist/api/services/ProfileStore.php',
  'dist/api/services/CommentStore.php',
  'dist/api/sql/001_community_profiles_and_comments.sql',
  'dist/api/sql/002_blog_cms_system.sql',
  'dist/api/config/app.php',
  'dist/api/lib/Env.php',
  'dist/api/storage/.htaccess',
  'dist/api/storage/blog_posts.json',
  'dist/api/storage/leads/leads.json',
  'dist/api/env.example',
];

const missing = required.filter((rel) => !existsSync(join(root, rel)));

if (missing.length > 0) {
  console.error('verify-dist-api: missing required deploy artifacts:');
  for (const m of missing) {
    console.error('  - ' + m);
  }
  process.exit(1);
}

const htaccess = readFileSync(join(dist, '.htaccess'), 'utf8');
if (!/RewriteRule\s+\^api\(\/\|\$\)\s+-\s+\[L\]/.test(htaccess)) {
  console.error('verify-dist-api: dist/.htaccess must pass /api/* through to PHP (RewriteRule ^api(/|$) - [L]).');
  process.exit(1);
}

if (!existsSync(api)) {
  console.error('verify-dist-api: dist/api is missing.');
  process.exit(1);
}

/** @type {string[]} */
const forbidden = [];

/**
 * @param {string} dir
 */
function findForbidden(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      findForbidden(fullPath);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const name = entry.name;
    if (
      name === '.env' ||
      name.startsWith('.env.') ||
      name.endsWith('.log') ||
      name.endsWith('.local')
    ) {
      forbidden.push(fullPath.slice(root.length + 1));
    }
  }
}

findForbidden(dist);

if (forbidden.length > 0) {
  console.error('verify-dist-api: dist/ must not contain secrets or runtime logs:');
  for (const f of forbidden) {
    console.error('  - ' + f);
  }
  process.exit(1);
}

console.log('verify-dist-api: OK — dist/ contains required PHP API artifacts.');
