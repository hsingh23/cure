# 008 — Heroku production split: `PRODUCTION` env var, MemCachier, remote statics

**Date:** 2012-06-27 through 2012-07-31 (76f61ca, e8cf05c, d00be7f, 0dd7f41)
**Status:** final shape of deployment.

## Context

One codebase had to run as localhost dev (SQLite, debug, local statics) and as the
Heroku app `cure` (Postgres, no-debug, memcache, fast statics). Django 1.4 had no
settings swarms; the team also didn't want a second settings module ("SURE this
should be a seperate file. What about it." — the comment survives in settings.py).

## Decision

A single `settings.py` with a trailing `try:` block: if env var `PRODUCTION` equals
the string `'True'`, flip DEBUG off, switch `STATIC_URL` to
`http://st4.herokuapp.com/` (a separate static-serving Heroku app), configure the
DB via `dj-database_url` (env `DATABASE_URL`), and build `CACHES` with
`django-heroku-memcacheify` (env `MEMCACHIER_*`). The Procfile runs gunicorn with 8
workers. An early bug compared `PRODUCTION` against boolean True and always missed
(3aa6210 fixed it to string comparison).

## Consequences

- One settings file, greppable dev/prod diff; zero 12-factor ceremony beyond env
  vars.
- Everything on the production path is duck-typed behind a bare `except: pass` —
  a missing env var silently yields dev settings on a prod dyno.
- Statics on a second Heroku app (`st4`) was the 2012 poor-man's CDN; today it is
  just a dead host.
- Dev defaults used a database-backed cache table (`DatabaseCache`, `my_cache`)
  while prod used memcache — different TTLs and behaviors between environments.

## Evidence

- 76f61ca introduces the PRODUCTION env check; 3aa6210 fixes the string
  comparison; e8cf05c runs the app with gunicorn on Heroku; d00be7f adopts
  memcacheify; 0dd7f41 points production STATIC_URL at st4.herokuapp.com.
