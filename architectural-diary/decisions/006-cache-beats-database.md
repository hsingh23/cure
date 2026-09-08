# 006 — Curated keyword content: cache beats database

**Date:** 2012-07-11 (b6dd220, d8eac5b), decided definitively 2012-07-24 (451d30d)
**Status:** final; the DB models are vestigial.

## Context

The core product idea: for a keyword like "hash map", a teacher curates the initial
content (suggested searches, videos, images, facts) that students see first. This
needed a write path (authors) and a hot read path (every page load with `?q=`).

## Evolution

1. `Website` model rows keyed by lowercased keyword (b6dd220) — the first cut.
2. `set-initial-json` / `get-initial-json` Django views around it (d8eac5b).
3. The rework (451d30d): submissions go straight into the Django **cache** under
   `db_<keyword>_json` / `db_<keyword>_url` with a 2-year TTL; the model layer is
   split into `Website_JSON`/`Website_URL` and then abandoned in place (the create
   calls are commented out in `views.py`). `/reset-keyword/` (5ce6f11) deletes
   cache entries when an author wants a clean slate.

## Rationale and consequences

- Reads became one memcache hit, no DB round trip; writes are rare (teachers),
   so cache eviction risk felt acceptable.
- A two-year TTL on memcache is really "store it in a database but call it a
  cache" — a Heroku dyno restart or cache eviction silently deletes curated
  content, with no recovery path once the models were abandoned.
- Keywords are normalized (case-folded, punctuation stripped via a `maketrans`
  table) at every boundary — the one invariant that kept read and write keys
  aligned.

## Evidence

- b6dd220 persists initial search terms via the Website model; d8eac5b adds the
  endpoints; 451d30d is the cache-first rework; 5ce6f11 adds reset.
