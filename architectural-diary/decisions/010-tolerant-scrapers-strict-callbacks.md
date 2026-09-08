# 010 — Tolerant scrapers, strict callbacks

**Date:** 2012-07-26 (894973a, ae6e462) — codifying earlier habits
**Status:** final; the security-relevant half is the durable idea.

## Context

Two failure modes kept biting the page:
1. Upstream HTML (Dogpile, Factbites) changed shape or contained malformed rows,
   crashing parsers and taking whole requests down.
2. JSONP means reflecting user-controlled `callback` values into responses — an
   XSS vector if a callback like `alert(1)//` is echoed.

## Decision

- Scraper side: wrap per-item extraction in `try/except: pass`, skip anything that
  doesn't match (894973a, 6ffaea3, 5bb0ef2, 33e12f8). Partial results beat 500s.
- Callback side: `is_valid_jsonp_callback_value` — split on `.`, validate each
  identifier against JavaScript identifier Unicode categories, reject reserved
  words and anything with escapes that don't decode cleanly (ported from a
  JSON-library reference implementation, hardened in ae6e462 by deleting dead
  templates and junk alongside).

## Consequences

- The scrapers degraded quietly — which also meant breakage went unnoticed for
  days (empty tabs, no errors).
- The callback validation is textbook-correct and the single most portable piece
  of code in this repo; every JSONP echo path (`get_initial`, `results`) uses it.
- Bare `except:` everywhere means real bugs (encoding, network) are swallowed
  with the parse errors — tolerance and observability were traded against each
  other and observability lost.

## Evidence

- 894973a tolerates malformed Dogpile/Factbites results; ae6e462 removes dead
  templates/junk and hardens the JSONP callback path; `help.py` carries both
  halves to this day.
