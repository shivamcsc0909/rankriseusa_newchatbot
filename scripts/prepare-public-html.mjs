#!/usr/bin/env node
/**
 * Prepare ready-to-deploy public_html/ folder from dist/
 * Suitable for direct upload to cPanel / Hostinger File Manager
 */
import { existsSync, cpSync, rmSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const distDir = join(root, 'dist');
const publicHtmlDir = join(root, 'public_html');

console.log('🚀 Preparing production public_html/ deployment package...');

if (!existsSync(distDir)) {
  console.error('❌ Error: dist/ directory not found. Please run "npm run build" first.');
  process.exit(1);
}

// Clean existing public_html directory if present
if (existsSync(publicHtmlDir)) {
  console.log('🧹 Cleaning existing public_html/ directory...');
  rmSync(publicHtmlDir, { recursive: true, force: true });
}

// Create fresh public_html directory
mkdirSync(publicHtmlDir, { recursive: true });

// Copy all files from dist to public_html
console.log('📦 Copying optimized dist/ build into public_html/...');
cpSync(distDir, publicHtmlDir, { recursive: true });

// Verify critical files in public_html
const criticalFiles = [
  'index.html',
  '.htaccess',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  'api/index.php',
  'api/bootstrap.php',
  'api/.htaccess',
];

const missing = criticalFiles.filter(f => !existsSync(join(publicHtmlDir, f)));

if (missing.length > 0) {
  console.error('⚠️ Warning: Some critical files missing in public_html/:', missing);
  process.exit(1);
}

const fileCount = readdirSync(publicHtmlDir).length;
console.log(`✅ Success! public_html/ package prepared with ${fileCount} root assets and complete PHP backend.`);
console.log('📁 You can now upload the contents of public_html/ directly to your cPanel / Hostinger public_html folder.');
