# 005 — JSONP everywhere, and the get-json side-project proxy

**Date:** 2012-07-09 (9cc578c), refined through 2012-07-24 (f556f89, a2b9f52)
**Status:** load-bearing until the end.

## Context

The page (client-side JS, decision 002) needed to read JSON from other origins in a
pre-CORS world. `XMLHttpRequest` across hosts was blocked; JSONP was the standard
hack. One target was arbitrary user-registered URLs, and one was the project's own
static JSON files on a static host.

## Decision

- Every read API (`get-initial`, the retired `results` scraper, sample loaders)
  accepts a `?callback=` parameter and answers `callback(...)` JSONP.
- Cross-origin JSON URLs registered by authors are fetched through
  `http://get-json.herokuapp.com/?resource=<url>&callback=?` — a separate Heroku
  side-project whose entire job was JSONP-wrapping arbitrary JSON (9cc578c,
  f556f89).
- The repo's own static JSON is served through `static/json/init.php`, a
  self-hosted PHP (!) JSONP wrapper living inside a Django project's static dir
  (a2b9f52).

## Consequences

- A PHP file in a Python project and a hard dependency on two side-project services
  — the definition of 2012 yak-shaving.
- Callback names are never trusted: `is_valid_jsonp_callback_value` (ported into
  `help.py`, hardened in ae6e462) validates dotted identifiers against Unicode
  categories and reserved words before echoing. This was the correct call and is
  the most reusable code in the repo.

## Evidence

- 9cc578c adds JSONP API support and the sidebar PDF section; f556f89 moves initial
  JSON fetching client-side via the get-json proxy; a2b9f52 self-hosts the wrapper
  as init.php; ae6e462 hardens the callback validation.
