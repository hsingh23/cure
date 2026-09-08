# 002 — The server renders a shell; the client fetches everything

**Date:** 2012-06-27 onward
**Status:** defining architectural choice; never revisited.

## Context

The help page needs data from many sources (Wikipedia, Google/Dogpile images,
YouTube, curated JSON). Django views could aggregate server-side and render HTML.
Instead the templates render empty tab panes and carousels, and page JS populates
them at runtime.

## Decision

`help()` renders `help_itter/help_page_2.dtl` with essentially one context variable
(`help_js_url`). All data loading happens in `help_page*.js` via `HelpSpace.*`
functions: bootstrap from `/get-initial/`, then live fetches. Django is a template
server plus a thin API.

## Consequences

- Frontend iterations were pure JS work — see the numbered-file scheme (004).
- The server's role shrank to: render shell, serve curated JSON, gate the authoring
  endpoints. The heavy scraping API (003) ended up barely wired to the page.
- 'use strict' namespacing arrived only in the 2013 cleanup (e887954); until then
  the page JS was loose globals, which made the 2012 merge conflicts frequent.
- Page behavior degrades gracefully when backends die — the shell still renders,
  tabs are just empty. Accidentally good for archaeology.

## Evidence

- 285b73f serves the help page from Django with 10 template iterations; e887954
  namespaced `HelpSpace` and split prod (`help_page_0005.js`) from dev
  (`/dev/` route serving `help_page.js`).
