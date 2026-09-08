# 003 — Scrape search engines instead of using search APIs

**Date:** 2012-06-29 (8c1e482), hardened 2012-07-26 (894973a)
**Status:** built, host-gated, and then effectively retired in place.

## Context

The page wanted "everything about a topic" — web links, PDFs, images, facts,
related topics. 2012 options: Google Web Search API (deprecated 2010, killed 2014),
Bing (keyed), or... just parse a metasearch engine's HTML. No API keys, no quotas.

## Decision

`help_app/help.py` scrapes with BeautifulSoup 4:
- Dogpile web results (`get_web_dogpile`), PDFs via `filetype:pdf` queries
  (`get_pdf_dogpile`), image results with thumbnails (`get_images_dogpile`)
- Factbites for facts and related topics (`get_web_factbites`)
- Rotating real-browser User-Agent strings (`FancyURLopener` subclasses) to dodge
  bot blocking; results cached 5 days under the raw query string.

## Consequences

- Zero API surface, infinite fragility: every Dogpile markup tweak broke a parser;
  44885ae/894973a-era commits are scrape-format whack-a-mole.
- The `results` view answers only for `localhost:8000` and `cure.herokuapp.com`
  ("Sorry - this API is private") — an admission that open scraping-as-a-service
  would get blocked or abused.
- By the final commits the route is commented out of `urls.py`; the live page
  leaned on curated content (006) and client-side fetching instead.

## Evidence

- 8c1e482 adds the server-side scraping API with cached results; 894973a makes the
  scrapers tolerate malformed Dogpile/Factbites results; 5bb0ef2/6ffaea3 skip
  broken Factbites rows.
