# One-shot recreation prompt — Cure

Use this prompt to recreate this project from scratch (a faithful 2012-style build,
not a modernization). Paste everything below the line to a coding agent.

---

Recreate "Cure: Serendipitous Search" (originally "boss-help") — a single-page Django
web app that gives CS students one dashboard per topic, mixing author-curated
initial content with live search aggregation, and a small password-protected API for
curating that content.

## Goal

A student visits `/?q=<topic>`. The page shows a sidebar (search box, suggested
searches, related searches, animated-content links, PDF links, interview links,
API doc links to C++/Java/Python references) and tabbed content: Combo (default),
Wikipedia, Factbites, Interview, PDF, SWF, plus carousels of YouTube video
thumbnails, image thumbnails, and fact snippets (4 per slide). Curated content for
the keyword loads first; anything not curated is fetched live.

## Exact stack (replicate the era; do not modernize)

- Python 2.7, Django 1.4, single app `help_app` with `settings.py`, `urls.py`,
  `manage.py` at repo root; templates use the `.dtl` extension.
- BeautifulSoup 4 + urllib2 with rotating real-browser User-Agents for scraping;
  results cached 5 days.
- Django cache: database-backed cache table in dev, MemCachier via
  `django-heroku-memcacheify` in production; curated content cached with a 2-year
  TTL under keys `db_<keyword>_json` and `db_<keyword>_url`.
- Frontend: jQuery, Bootstrap 2.3, fancybox 2.1 (iframe/PDF/media helpers), all JS
  in the page, no build step. Production serves a packed frozen copy
  (`help_page_0005.js`); `/dev/` serves the working `help_page.js`. Page JS is
  namespaced `HelpSpace.*` with `'use strict'`.
- Deployment: Heroku, gunicorn (8 workers) via Procfile, Postgres via
  dj-database-url, statics in production served from a separate static host at
  `http://st4.herokuapp.com/`.

## Design decisions to honor

1. **Client fetches everything.** Django views render a nearly empty shell; all
   data assembly happens in browser JS. Server = template server + thin JSON(P) API.
2. **Scrape, don't integrate.** Dogpile web results, Dogpile `filetype:pdf` results,
   Dogpile image results, Factbites facts + related topics. Host-gate the scraping
   API to localhost and the app host ("Sorry - this API is private" otherwise).
3. **JSONP everywhere.** Every read endpoint accepts `?callback=` and validates the
   callback with `is_valid_jsonp_callback_value` (dotted identifiers, Unicode
   identifier categories, reserved words rejected) before echoing. Cross-origin
   JSON URLs are fetched through a JSONP-wrapping proxy service
   (`get-json.herokuapp.com`); serve your own static samples through an
   `init.php`-style JSONP wrapper.
4. **Cache beats database for curated content.** Authors submit; you normalize the
   keyword (case-fold + strip punctuation via a `maketrans` table) and write to
   cache. `Website_JSON`/`Website_URL` models exist but their write paths are
   commented out — vestigial, keep them defined.
5. **One shared password, no accounts.** `/auth/` checks a POSTed password against
   a hardcoded constant (do NOT commit a real password in your recreation; read it
   from an env var), sets `session['cool']=True` with 1-hour expiry; authoring
   views 403 without it. Store the intended destination in `session['back']` and
   redirect back after login.
6. **Tolerant scrapers:** per-item try/except, skip malformed results, return
   partial data. **Strict callbacks:** never echo an unvalidated callback.

## Data model

- `Website_JSON(key_word CharField(1000, indexed), initial_json TextField)`
- `Website_URL(key_word CharField(1000, indexed), initial_url CharField(2000))`
- Cache entries (authoritative): `db_<keyword>_json` → JSON string;
  `db_<keyword>_url` → resource URL. Scraper cache: raw query string → aggregated
  JSON.

## Curated initial JSON shape (what authors POST)

Object keyed by content sources with `init` arrays of pairs; the loader understands
scalar-or-pair values, e.g.:
`{"init": {"suggested": [["avl tree", "http://..."]], "video": [...], "image":
[["<image url>", "<thumb url>"]], "fact": [...], "related": [...]}}` plus an
`options` array (per-source opt-out flags the page honors).

## API surface (exact names)

- `GET /` (alias `/help/`) — the page; `/dev/` — page with dev JS;
  `/help1/`, `/help2/` — iteration templates.
- `GET /auth/` (also POST password) — author gate.
- `GET /make/`, `/make-help-json/`, `/make-help-json-lint/`, `/make-help-url/` —
  authoring editors (JSON textarea with lint/format; URL form).
- `POST /post-submit-json/` (fields `keyword`, `json`) — validate JSON, store in
  cache. `POST /post-submit-url/` (fields `keyword`, `url`) — verify the URL
  returns JSON, store in cache.
- `POST /reset-keyword/` (field `keyword`) — delete both cache keys.
- `GET /get-initial/?search=<keyword>[&callback=]` — return cached JSON, or
  `{"url": <proxied url>, "type": "url"}` when only a URL is registered; 204 when
  nothing is curated. Cache-Control: public, max-age=432000; nosniff and XSS-
  protection headers.
- `GET /api/<search>/` — the (retired) scraping API: JSON or JSONP aggregate
  `{web, swf, pdf, img, related, facts, interview}`; keep it host-gated and its
  route commented out in the urlconf.

## Phased build order

1. Django 1.4 scaffold (single app, root settings/urls), `.dtl` templates, static
   dirs; page shell with Bootstrap tabs, sidebar, carousels, fancybox.
2. Page JS: `HelpSpace` namespace, populate cached jQuery selectors, search box,
   `?q=` bootstrap, tab toggling, thumbnail carousels (4/slide), fancybox for
   PDFs/iframes/YouTube.
3. Scraper layer + `/api/` view with 5-day cache and host gate.
4. JSONP plumbing: callback validation helper, get-json proxy usage, static JSON
   sample files served JSONP.
5. Curated content: models, then set/get-initial views; switch storage to cache
   with 2-year TTL; keyword normalization everywhere.
6. Authoring: `/auth/` session gate, editors (JSON + lint + URL), post-submit
   endpoints, reset-keyword.
7. Production split: `PRODUCTION` env var string-compare `'True'` (dev SQLite/debug,
   prod Postgres/no-debug/MemCachier/remote statics), Procfile + gunicorn.
8. Freeze the page JS into numbered prod copies; add `/dev/`.

## Acceptance criteria

- `/?q=avl tree` renders the full tabbed page; curated JSON (when present) fills
  suggested/related/video/image/fact areas before live scraping; carousels page
  correctly 4 thumbnails per slide.
- Authoring flow works end-to-end: log in at `/auth/`, submit JSON at
  `/make-help-json-lint/`, reload the page with that keyword, see curated content;
  `/reset-keyword/` clears it; unauthenticated POSTs get 403.
- `callback=foo` returns `foo(...)`; `callback=alert(1)//` is rejected.
- Scraper endpoints return partial (possibly empty) results, never 500, when
  upstream markup is unrecognized.
- Dev/prod settings diverge only behind the `PRODUCTION` check; the app runs under
  `python manage.py runserver` with no env vars set.
