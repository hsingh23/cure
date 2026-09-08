# 004 — `help_page_000N.js` frozen forks instead of releases

**Date:** 2012-07-28 (3413af3) through 2013-04-22 (e887954)
**Status:** the project's stand-in for build/version tooling.

## Context

Two developers iterated fast on one page's JS with no bundler, no git tags, no
deploy pipeline — but production (Heroku) had to keep serving something stable
while the working copy churned.

## Decision

When a version was "shipped", the current `help_page.js` was copied to the next
numbered file: `help_page_0001.js` ... `help_page_0005.js`. The production view
renders the template with a pinned `help_js_url` (`js/help_page_0005.js`); the
`/dev/` view (added in the 2013 cleanup) serves the live `help_page.js`. Earlier
generations (`help_page_2.js`, `help_page_3.js`, the `_0001`–`_0004` forks) stay in
the repo as history.

## Consequences

- Zero tooling, workable for one page; the packed/frozen copy is the deploy
  artifact.
- Duplication: five-plus near-copies of a 600–1200-line file in the repo, drifting
  apart; `help_page_0005.js` is a one-line packed build, unreadable by design.
- The template's `{% static %}` indirection for the script URL (e887954) was the
  cleanest part of this scheme — one context variable chooses prod vs dev.

## Evidence

- 3413af3 forks page JS to `help_page_0001.js` with query-driven load; f22ecfc
  ships a packed script build; e887954 formalizes the prod/dev split.
