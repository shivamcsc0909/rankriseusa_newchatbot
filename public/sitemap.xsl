<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:sitemapindex="http://www.sitemaps.org/schemas/sitemap/0.9"
  exclude-result-prefixes="sitemap sitemapindex">

  <xsl:output method="html" indent="yes" encoding="UTF-8"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>XML Sitemap — RankRise USA</title>
        <meta charset="UTF-8"/>
        <meta name="robots" content="noindex, follow"/>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 14px; color: #333; background: #f9fafb; }
          .wrap { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
          h1 { font-size: 26px; font-weight: 700; color: #111; margin-bottom: 10px; }
          .intro { color: #555; font-size: 14px; line-height: 1.7; margin-bottom: 6px; }
          .intro a { color: #0070f3; text-decoration: none; }
          .intro a:hover { text-decoration: underline; }
          .count { margin: 20px 0 14px; font-size: 14px; color: #444; }
          .count strong { color: #111; }
          table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
          thead { background: #f3f4f6; }
          th { text-align: left; padding: 12px 16px; font-size: 13px; font-weight: 600; color: #444; border-bottom: 1px solid #e5e7eb; }
          td { padding: 11px 16px; border-bottom: 1px solid #f0f0f0; font-size: 13px; }
          tr:last-child td { border-bottom: none; }
          tr:hover td { background: #fafafa; }
          td a { color: #0070f3; text-decoration: none; word-break: break-all; }
          td a:hover { text-decoration: underline; }
          .priority { font-weight: 600; color: #6d28d9; }
          .changefreq { color: #059669; font-size: 12px; }
          .lastmod { color: #777; font-size: 12px; white-space: nowrap; }
          .badge { display: inline-block; background: #ede9fe; color: #5b21b6; font-size: 11px; padding: 2px 8px; border-radius: 999px; font-weight: 600; }
          footer { margin-top: 30px; text-align: center; font-size: 12px; color: #aaa; }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>XML Sitemap</h1>
          <p class="intro">
            This is an XML Sitemap for <strong>RankRise USA</strong>, meant for consumption by search engines.<br/>
            You can find more information about XML sitemaps on <a href="https://sitemaps.org" target="_blank">sitemaps.org</a>.
          </p>

          <!-- Sitemap Index -->
          <xsl:if test="sitemap:sitemapindex">
            <p class="count">
              This XML Sitemap Index file contains
              <strong><xsl:value-of select="count(sitemap:sitemapindex/sitemap:sitemap)"/></strong> sitemaps.
            </p>
            <table>
              <thead>
                <tr>
                  <th>Sitemap</th>
                  <th>Last Modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:sitemapindex/sitemap:sitemap">
                  <tr>
                    <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                    <td class="lastmod"><xsl:value-of select="sitemap:lastmod"/></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>

          <!-- URL Set -->
          <xsl:if test="sitemap:urlset">
            <p class="count">
              This sitemap contains
              <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> URLs.
            </p>
            <table>
              <thead>
                <tr>
                  <th>URL</th>
                  <th>Last Modified</th>
                  <th>Change Freq</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
                    <td class="lastmod"><xsl:value-of select="sitemap:lastmod"/></td>
                    <td class="changefreq"><xsl:value-of select="sitemap:changefreq"/></td>
                    <td><span class="priority"><xsl:value-of select="sitemap:priority"/></span></td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </xsl:if>

          <footer>RankRise USA — rankriseusa.com</footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
