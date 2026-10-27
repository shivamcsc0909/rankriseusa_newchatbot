// scripts/generate-sitemap.js
const fs = require('fs');
const path = require('path');

const siteUrl = 'https://example.com'; // CHANGE THIS to your site
const routes = [
  '/',
  '/services',
  '/pricing',
  '/portfolio',
  '/blog',
  '/contact',
  '/free-audit'
  // add more routes manually for accuracy OR write a script to map src/pages
];

const urls = routes.map((route) => {
  const loc = `${siteUrl}${route === '/' ? '' : route}`;
  return `<url>
  <loc>${loc}</loc>
  <changefreq>weekly</changefreq>
  <priority>0.7</priority>
</url>`;
}).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

fs.writeFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), xml, 'utf8');
console.log('sitemap.xml created in public/');