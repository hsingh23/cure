# Architectural Diary — Cure

A reconstruction (2026-09-08) of how this project came to look the way it does,
assembled from the rewritten git history, the code, and the surviving notes
(`TODO:`, `TODO_`). Hashes refer to the rewritten history.

## The project in one paragraph

Cure (pushed originally as **boss-help**, renamed **Cure: Serendipitous Search** in
2013) was Harsh Singh and Alex Zhang's summer-2012 answer to "give CS students one
page that knows everything about a topic." A Django 1.4 server renders a mostly-empty
tabbed page; the browser JS then assembles the content from two very different
sources: a curated store (teachers POST JSON under a keyword; the page bootstraps
from it) and a live scraping pipeline that hammered Dogpile and Factbites into
web/pdf/image/fact buckets. It ran on Heroku with memcache and Postgres.

## Timeline

1. **Scaffold (2012-06-26–27)** — `startproject` output, ten hand-written template
   iterations of the help page, first static assets, README placeholder (60ca082,
   5d48ebd). The earliest decision — server renders the shell, client fetches data —
   was made here and never revisited.
2. **Carousel UI (2012-06-28 – 07-03)** — tabs, thumbnail carousels, image flow,
   UIUC branding; lots of merge traffic because two people pushed to master
   continuously (2a2d369-era commits; see 004-numbered-static-iterations for how
   releases were managed instead).
3. **Scraping + JSONP era (2012-07-03 – 07-10)** — server-side Dogpile/Factbites
   aggregator with 5-day cache (8c1e482), JSONP delivery, the get-json proxy,
   hardening against broken scraper markup.
4. **Curated content (2012-07-10 – 07-13)** — Website model persistence (b6dd220),
   set/get-initial endpoints (d8eac5b), then the big rework: password gate,
   make-help-json-lint editor, cache-backed storage with 2-year TTLs, split
   Website_JSON/Website_URL models (451d30d).
5. **Production hardening (2012-07-24 – 08-29)** — dev/prod settings split
   (76f61ca), gunicorn Procfile (e8cf05c), memcacheify (d00be7f), remote static
   hosting (0dd7f41), JSON-lint authoring editor, HelpSpace JS namespace (3dad814).
6. **Long tail (2012-10 – 2013-05)** — fancybox overhaul for PDFs (21f1353), YouTube
   embed fixes (81ae153), the big JS cleanup + prod/dev script split (e887954),
   rebrand to "Cure: Serendipitous Search" (821f21f), Google site verification
   (d39061a). Then silence — the project was abandoned with the 2013 stack frozen
   inside it.

## Decisions

Numbered, linked, and ordered roughly by when they were made:

1. [001-single-django-app.md](decisions/001-single-django-app.md) — one Django app,
   settings hoisted to the repo root
2. [002-client-fetches-everything.md](decisions/002-client-fetches-everything.md) —
   the server renders a shell; the browser assembles all data
3. [003-scraping-over-search-apis.md](decisions/003-scraping-over-search-apis.md) —
   scrape Dogpile/Factbites rather than use search APIs
4. [004-numbered-static-iterations.md](decisions/004-numbered-static-iterations.md) —
   `help_page_000N.js` frozen forks instead of branching or build tooling
5. [005-jsonp-and-the-get-json-proxy.md](decisions/005-jsonp-and-the-get-json-proxy.md) —
   JSONP everywhere; a side-project proxy for cross-origin JSON
6. [006-cache-beats-database.md](decisions/006-cache-beats-database.md) — curated
   keyword content lives in memcache, and the database models lose
7. [007-password-gate-for-authors.md](decisions/007-password-gate-for-authors.md) —
   one shared password, one-hour sessions, no user accounts
8. [008-heroku-production-split.md](decisions/008-heroku-production-split.md) —
   `PRODUCTION` env var, MemCachier, remote static hosting
9. [009-committed-sqlite-binaries.md](decisions/009-committed-sqlite-binaries.md) —
   SQLite database files tracked in git, with a partial retreat
10. [010-tolerant-scrapers-strict-callbacks.md](decisions/010-tolerant-scrapers-strict-callbacks.md) —
    swallow scraper breakage, never trust JSONP callback names

## What the code says that the commits don't

- The project's real name drifted: repo `boss-help` → page title "Help" →
  "Cure: Serendipitous Search". `cure` was the Heroku app name all along.
- The `results` scraping API was effectively retired in place: its import survives
  in `urls.py` but its route is commented out, and `get_initial` has a latent
  `NameError` (`json_from_url`) on the URL branch — the project died before that
  path mattered.
- `TODO:` and `TODO_` record the intended roadmap that never happened: reload
  current data into forms, teacher alerts for suggested content, opt-out flags for
  animated content. Opt-out flags partially landed (41ed3e9).
