# 001 — One Django app, settings at the repo root

**Date:** 2012-06-26, consolidated 2012-07-27 (5d48ebd)
**Status:** final for this project's lifetime.

## Context

The repo began as raw `django-admin.py startproject` output with the project package
named `help_app` (60ca082). Early commits show confusion typical of first Django
projects: two settings modules, two urlconfs, admin scaffolding left commented.

## Decision

Collapse everything into a single Django app (`help_app`) and hoist `settings.py`,
`urls.py`, and `manage.py` to the repository root (5d48ebd). The app's own
`help_app/urls.py` survives but is dead weight — the root urlconf routes everything
to `help_app.views`.

## Consequences

- Simple mental model for a two-person student project; no app boundary debates.
- The root/settings duality left two sources of truth: `help_app/urls.py` still
  defines `/help/` and `/helpN/` routes that the root urlconf also defines, and they
  drifted.
- Implicit relative imports (`from help import ...`, `from models import *` in
  `views.py`) locked the code to Django <1.5 / Python 2 forever.

## Evidence

- 60ca082 scaffold; 5d48ebd consolidates settings at repo root and prunes static
  assets; 80c4023 restores a lost `import os` introduced by the shuffle.
