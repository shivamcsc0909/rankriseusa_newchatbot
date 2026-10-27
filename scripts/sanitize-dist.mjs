#!/usr/bin/env node
/**
 * Remove secrets and runtime artifacts from dist/ before deploy.
 * Vite copies public/ verbatim; local .env and log files must never ship.
 */
import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const dist = join(root, 'dist');

if (!existsSync(dist)) {
  console.error('sanitize-dist: dist/ does not exist — run vite build first.');
  process.exit(1);
}

/** @type {string[]} */
const removed = [];

/**
 * @param {string} dir
 */
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    const name = entry.name;
    const isEnvFile = name === '.env' || name.startsWith('.env.');
    const isLogFile = name.endsWith('.log');
    const isLocalSecret = name.endsWith('.local');

    if (isEnvFile || isLogFile || isLocalSecret) {
      rmSync(fullPath, { force: true });
      removed.push(fullPath.slice(root.length + 1));
    }
  }
}

walk(dist);

if (removed.length > 0) {
  console.log('sanitize-dist: removed forbidden deploy artifacts:');
  for (const rel of removed) {
    console.log('  - ' + rel);
  }
} else {
  console.log('sanitize-dist: no forbidden artifacts found.');
}
