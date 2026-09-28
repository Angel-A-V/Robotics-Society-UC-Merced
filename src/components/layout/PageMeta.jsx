// ── Page Meta ──────────────────────────────────────────────────────────
// Renders nothing. Sits inside the Router (like ScrollToTop) and, on every
// navigation, updates the tab title, description, canonical URL and link
// preview tags to match the new page, using the same list the build uses
// (data/seo.js).
//
// The first page load already has the right tags baked into its HTML file;
// this keeps them right as you click around without a full page load.

import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { PAGES, PRIVATE_PATHS, SITE_URL, SITE_NAME, pageFor } from '../../data/seo'

const setContent = (selector, value) => {
  document.head.querySelector(selector)?.setAttribute('content', value)
}

export default function PageMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
    const isPrivate = PRIVATE_PATHS.includes(path)
    const page = pageFor(path) ?? (isPrivate
      ? { title: `Members | ${SITE_NAME}`, description: `Members area of the ${SITE_NAME}.` }
      : PAGES[0])                               // Unknown URL: fall back to the homepage
    const url = `${SITE_URL}${pageFor(path) || isPrivate ? path : '/'}`

    document.title = page.title
    setContent('meta[name="description"]', page.description)
    setContent('meta[name="robots"]', isPrivate ? 'noindex, nofollow' : 'index, follow')
    document.head.querySelector('link[rel="canonical"]')?.setAttribute('href', url)
    setContent('meta[property="og:title"]', page.title)
    setContent('meta[property="og:description"]', page.description)
    setContent('meta[property="og:url"]', url)
    setContent('meta[name="twitter:title"]', page.title)
    setContent('meta[name="twitter:description"]', page.description)
  }, [pathname])

  return null
}
