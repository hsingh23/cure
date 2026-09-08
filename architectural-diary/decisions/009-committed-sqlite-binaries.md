# 009 — SQLite binaries committed to git

**Date:** from 2012-06-26; partially reversed 2012-07-11 (96cdfdd); residue remains
**Status:** unresolved at abandonment.

## Context

Dev ran on SQLite (`help_app_db` at the root, and an earlier `help_db`), and the
team committed the database binary whenever its contents changed — "clear pdf
history" commits are `help_db`/`help_app_db` blob updates.

## What happened

- For a while, curated keywords actually lived in that committed binary (the
  `Website` model era, decision 006).
- 96cdfdd removed `help_app_db` from tracking during the cache-first rework —
  recognizing that a binary DB in git is both a merge hazard and an accidental
  data leak.
- The removal didn't stick cleanly: `d8eac5b` had already "re-added" it, an empty
  `help_db` file remains tracked to this day, and the committed binary with 2012
  data sat in history regardless.

## Consequences

- Any clone carries 2012 database contents inside `.git` forever (bloat + whatever
  the DB held).
- Binary diffs made "clear pdf history" commits unreviewable — nobody could tell
  what actually changed, which is part of why those messages were useless.
- Lesson recorded for successors: generated artifacts and databases never belong
  in git; the fix (purging history) was never worth doing for a dead project.

## Evidence

- b3a6b91/cb922c0 "clear pdf history" are binary DB updates; 96cdfdd drops
  `help_app_db` from the merge; `git ls-files` still shows `help_db` and
  `help_app_db`.
