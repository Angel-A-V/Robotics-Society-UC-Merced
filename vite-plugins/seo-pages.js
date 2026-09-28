// ── seoPages Vite plugin ───────────────────────────────────────────────
// This is a single-page app, so every URL is served the same index.html and
// only gets its real title once JavaScript runs. Google and link previews
// (Discord, iMessage, …) read the raw HTML, so at build time this writes:
//
//   dist/index.html                    homepage tags
//   dist/projects/rally-kart.html      that page's title, description, URL …
//   dist/contact.html                  … one file per entry in src/data/seo.js
//   dist/login.html (etc.)             member pages, marked noindex
//   dist/sitemap.xml                   every public page
//
// Cloudflare serves /projects/rally-kart from projects/rally-kart.html
// automatically. Each file is the same app; only the <head> tags differ.

import { PAGES, PRIVATE_PATHS, SITE_URL, SITE_NAME } from '../src/data/seo.js'

const escapeHtml = (text) => text
  .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Replace the content of one tag that already exists in index.html. Throws if
// the tag is missing, so a renamed tag can't silently stop being updated.
function setTag(html, pattern, value) {
  if (!pattern.test(html)) throw new Error(`seoPages: index.html is missing ${pattern}`)
  return html.replace(pattern, (_, start, end) => `${start}${escapeHtml(value)}${end}`)
}

function withPageTags(html, { path, title, description, noindex = false }) {
  const url = `${SITE_URL}${path}`
  const meta = (attr, key) => new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`)

  html = setTag(html, /(<title>)[^<]*(<\/title>)/, title)
  html = setTag(html, meta('name', 'description'), description)
  html = setTag(html, meta('name', 'robots'), noindex ? 'noindex, nofollow' : 'index, follow')
  html = setTag(html, /(<link rel="canonical" href=")[^"]*(")/, url)
  html = setTag(html, meta('property', 'og:title'), title)
  html = setTag(html, meta('property', 'og:description'), description)
  html = setTag(html, meta('property', 'og:url'), url)
  html = setTag(html, meta('name', 'twitter:title'), title)
  html = setTag(html, meta('name', 'twitter:description'), description)
  return html
}

function sitemap() {
  const today = new Date().toISOString().slice(0, 10)
  const urls = PAGES.map(page => [
    '  <url>',
    `    <loc>${SITE_URL}${page.path}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `    <priority>${page.priority}</priority>`,
    '  </url>',
  ].join('\n'))
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}

export default function seoPages() {
  return {
    name: 'seo-pages',
    apply: 'build',
    enforce: 'post',   // Run after Vite has built index.html
    generateBundle(_, bundle) {
      const index = bundle['index.html']
      if (!index || index.type !== 'asset') return   // Not the browser build

      const base = String(index.source)
      const write = (path, html) => this.emitFile({ type: 'asset', fileName: `${path.slice(1)}.html`, source: html })

      for (const page of PAGES) {
        const html = withPageTags(base, page)
        if (page.path === '/') index.source = html
        else write(page.path, html)
      }

      for (const path of PRIVATE_PATHS) {
        write(path, withPageTags(base, {
          path,
          title: `Members | ${SITE_NAME}`,
          description: `Members area of the ${SITE_NAME}.`,
          noindex: true,
        }))
      }

      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap() })
    },
  }
}
