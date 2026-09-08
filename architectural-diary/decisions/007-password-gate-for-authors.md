# 007 — One shared password, one-hour sessions, no accounts

**Date:** 2012-07-24 (451d30d)
**Status:** final; a classic student-project security shortcut.

## Context

Authoring endpoints (`/post-submit-json/`, `/post-submit-url/`, `/reset-keyword/`,
the `/make-help-*` editors) must not be public — anyone could overwrite the
content students see. But user accounts, registration, and emails were overkill for
a handful of trusted teachers in a summer project.

## Decision

`/auth/` presents a password form; the correct password (hardcoded in
`views.py`, value deliberately not reproduced in these docs) sets
`request.session['cool'] = True` with a **one-hour expiry**. Every authoring view
checks `request.session.get('cool')` and returns 403 otherwise. Failed submissions
redirect back via a `request.session['back']` breadcrumb.

## Consequences

- Ten lines of code, zero account management, and it worked for the audience.
- The password sits in source control and shipped to every dyno; anyone with repo
  read access is an author. Fine for 2012 trivia content; a liability pattern to
  remember.
- One bug fossil: `make_help_url` checks `request.session.get('cool', True)` —
  default `True` means the URL editor was effectively never gated.
- The `back`-redirect pattern (store intended destination in session at redirect
  time) is a neat trick worth copying.

## Evidence

- 451d30d introduces the gate, the editors, and the session checks; 5ce6f11's
  reset endpoint follows the same `cool` check.
