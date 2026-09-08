# Cure (formerly "boss-help") — Serendipitous Search

> **Archived / legacy project.** Cure is a 2012–2013 student project (UIUC era) built on
> Django 1.4 and jQuery-era frontend tooling. It is preserved here for historical
> interest only: the upstream services it scrapes (Dogpile, Factbites) and the Heroku
> stack it targeted have long since changed or disappeared, and Django 1.4 is
> unsupported. Do not deploy this as-is.

Cure was a "help page" for CS students: type a topic ("avl tree", "hash map") and get a
tabbed, one-page dashboard of everything useful about it — Wikipedia extracts, fact
snippets, interview questions, PDFs, SWF/animated content, YouTube videos, and image
thumbnails — assembled by scraping search engines server-side. Teachers could also
curate the first thing a student sees for a keyword through a small password-protected
authoring API that stored hand-picked initial content (links, images, videos, facts) as
JSON, keyed by keyword, and served it to the page as JSONP.

It ran at `cure.herokuapp.com` (originally pushed as `boss-help`) built by
Harsh Singh and Alex Zhang, mostly over June–July 2012, with a small rebranding and
cleanup pass in April–May 2013.

## Features

- **Serendipitous search page** — one search box; results fan out into Combo,
  Wikipedia, Factbites, Interview, PDF, and SWF tabs.
- **Server-side scraping API** — `help_app/help.py` scrapes Dogpile web/PDF/image
  results and Factbites facts/related-topics with BeautifulSoup, caching the
  aggregated JSON in memcache for 5 days.
- **Curated keyword content** — authenticated authors POST JSON or a URL under a
  keyword; the page bootstraps from it via `/get-initial/` (JSONP with strict
  callback-name validation) before falling back to live scraping.
- **Authoring tools** — `/make-help-json-lint/` provides a JSON editor with
  client-side lint/format (jsl.*), and `/make-help-url/` registers a JSON URL instead
  of inline JSON.
- **Carousel "flows"** — Bootstrap carousels of video, picture, and fact thumbnails,
  four per slide; fancybox lightboxes for PDFs, iframe content, and media.
- **Per-iteration static builds** — page JS was forked into numbered files
  (`help_page_0001.js` … `help_page_0005.js`) so production served a frozen copy while
  `/dev/` served the working copy.

## Stack

| Layer      | Choice |
|------------|--------|
| Backend    | Python 2.7, Django 1.4 (single app: `help_app`) |
| Scraping   | BeautifulSoup 4, urllib2, rotating user agents |
| Cache      | Locmem/db cache in dev; MemCachier (memcacheify + pylibmc/sasl) in prod |
| Database   | SQLite in dev (`help_app_db`), Postgres in prod (dj-database-url) |
| Frontend   | jQuery, Bootstrap 2.3, fancybox 2.1, JSONP |
| Serving    | gunicorn (`Procfile`), Heroku |

## Quickstart (for archaeology, not production)

```bash
# Requires Python 2.7 and old-era pip; modern toolchains will not resolve these pins.
pip install -r requirements.txt
python manage.py runserver
# open http://localhost:8000/  (the help page) or http://localhost:8000/dev/ (dev JS)
```

Configuration is by environment variables (names only):

- `PRODUCTION` — set to `True` to enable production settings (no-debug, Postgres,
  MemCachier, remote static host).
- `DATABASE_URL` — Postgres connection (dj-database-url).
- `MEMCACHIER_SERVERS`, `MEMCACHIER_USERNAME`, `MEMCACHIER_PASSWORD` — MemCachier
  credentials wired up by `django-heroku-memcacheify`.

Known legacy liabilities (do not copy into new code): a hardcoded `SECRET_KEY` and a
hardcoded shared admin password live in `settings.py`/`views.py`; several database
binaries and editor backup files are tracked in git.

## Repository structure

```
settings.py            Django settings (dev defaults + PRODUCTION override block)
urls.py                Root URLconf — all routes
manage.py              Standard Django management entry point
Procfile               Heroku web process (gunicorn, 8 workers)
requirements.txt       Pinned 2012-era dependencies
help_app/
  views.py             Views: help pages, auth, authoring API, get-initial
  help.py              Scraper layer (Dogpile/Factbites) + JSONP validation helpers
  models.py            Website_JSON / Website_URL (legacy keyword content)
  wsgi.py              WSGI entry point
  templates/           help_itter/help_page_2.dtl is the real page; api/*.dtl the editors
  static/js/           help_page*.js iterations, vendored jquery/fancybox, jsl linter
  static/json/         Sample/curated initial-content JSON, init.php JSONP wrapper
  static/css, static/img/  Bootstrap 2, fancybox, and project assets
```

## History

This repository's commit messages were rewritten on 2026-09-08 (messages only — trees
and metadata untouched) because most 2012 subjects were placeholders like "changes",
"cool beans", or "the works". See [CHANGELOG.md](CHANGELOG.md) for a per-commit
narrative, [AGENTS.md](AGENTS.md) for working conventions, and
[architectural-diary/](architectural-diary/) for the design decisions behind the code.
[prompt.md](prompt.md) contains a one-shot prompt that would recreate this project
from scratch.
