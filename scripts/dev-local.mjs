/**
 * Local development only — starts PHP API + Vite.
 * Production / Hostinger deploy is unchanged (uses dist/ + Apache PHP).
 */
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const phpPort = process.env.PHP_PORT || '8080';
const phpHost = process.env.PHP_HOST || '127.0.0.1';

const children = [];

function start(command, args, label) {
  const child = spawn(command, args, {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  });
  child.on('exit', (code, signal) => {
    if (signal) return;
    console.error(`[dev-local] ${label} exited with code ${code ?? 0}`);
    shutdown(code ?? 1);
  });
  children.push(child);
  return child;
}

function shutdown(code = 0) {
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }
  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

console.log(`[dev-local] PHP  http://${phpHost}:${phpPort}  (docroot: public/)`);
console.log(`[dev-local] Vite http://127.0.0.1:5173  (proxies /api → PHP)`);

start('php', ['-d', 'opcache.enable=0', '-d', 'opcache.enable_cli=0', '-S', `${phpHost}:${phpPort}`, '-t', 'public', 'public/api/router-dev.php'], 'php');
start(join(root, 'node_modules', '.bin', 'vite'), [], 'vite');
