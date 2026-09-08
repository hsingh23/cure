# AGENTS.md — working guide for coding agents

Archived 2012-era Django 1.4 project ("Cure", formerly "boss-help"). Read
[README.md](README.md) first. The realistic task in this repo is archaeology,
small fixes, and documentation — not feature work. Do not modernize dependencies
unless explicitly asked; the pins are intentionally historical.

## Commands

```bash
# Run dev server (Python 2.7 era; a modern interpreter will fail on Django 1.4)
pip install -r requirements.txt        # only on a Python 2.7 environment
python manage.py runserver             # http://localhost:8000/  (production JS)
# /dev/ serves the same page with the unpacked help_page.js

# Static files
python manage.py collectstatic         # STATIC_ROOT is help_app/static (legacy setup)

# Git
git log --oneline master               # messages were rewritten 2026-09-08; history is linear-ish with merges
```

There are no tests, no linter config, and no CI. Verification is manual: run the
server and click. Given the age of the stack, "it imports under the era-appropriate
Python" is the practical bar for most changes.

## Architecture map

- **Request flow:** browser → `urls.py` (root URLconf) → `help_app/views.py` →
  Django template (`help_app/templates/help_itter/help_page_2.dtl`) → page JS
  (`help_app/static/js/help_page_0005.js`, packed; `help_page.js` is the dev copy)
  runs in the browser and fetches all data itself.
- **Two data paths on the client:**
  1. Curated: `/get-initial/?search=<keyword>` returns author-curated JSON (or a
     pointer to a JSON URL fetched through the `get-json.herokuapp.com` JSONP proxy),
     served from cache.
  2. Live: the (mostly retired) server scraping API in `help_app/help.py`
     (`get_results`) aggregates Dogpile web/pdf/image results and Factbites
     facts/related topics, cached 5 days; host-gated to localhost and
     `cure.herokuapp.com`.
- **Authoring API:** `/auth/` (shared password → 1-hour session) unlocks
  `/make-help-json-lint/`, `/make-help-url/`, `/post-submit-json/`,
  `/post-submit-url/`, `/reset-keyword/`. Submissions are normalized (lowercased,
  punctuation stripped via a `maketrans` table) and stored in the Django cache under
  `db_<keyword>_json` / `db_<keyword>_url` with a 2-year TTL. The
  `Website_JSON`/`Website_URL` models in `models.py` are a mostly-abandoned earlier
  attempt at the same thing — cache won.
- **Templates:** `.dtl` extension (non-standard on purpose). `help_page_2.dtl` is the
  live page; `help_page_1.dtl` is the older iteration; `api/*.dtl` are the authoring
  editors.
- **Static JS iterations:** `help_page_0001.js` … `help_page_0005.js` are frozen
  forks of `help_page.js` — each numbered file is what production served at that
  point in time. Edit `help_page.js`, then copy to the next number to "release".
  The `jsl.*` files are the JSON lint editor; `init.php` is a self-hosted JSONP
  wrapper for static JSON files.

## Conventions (as the codebase actually does it)

- Python 2 syntax throughout (`print` statements, `string.translate`, `except:`),
  4-space indent; JS uses 2-space, `HelpSpace` namespace, `'use strict'` in the
  2013-rewritten files only.
- Commit messages follow conventional commits (`feat:`, `fix:`, `chore:`, scopes like
  `api:`, `help:`) — adopted during the 2026-09-08 message rewrite; keep it up.
- Keyword normalization (case-fold + strip punctuation) happens at every cache
  boundary — keep it consistent or cache keys diverge.
- JSONP callbacks must pass `is_valid_jsonp_callback_value` (in `help.py`) before
  being echoed; never interpolate a raw callback.

## Gotchas

- **Never echo the values of** the hardcoded `SECRET_KEY` (settings.py) or the
  hardcoded `/auth/` password (views.py) into docs, issues, or new code. They are
  committed legacy liabilities; referencing their existence is fine.
- `views.py` contains a latent `NameError` path: `get_initial` references
  `json_from_url` which is undefined in the URL branch — a real 2013 bug, left as-is.
- `help_app/help.py` imports as `from help import ...` (implicit relative imports,
  pre-Django-1.5 style); moving files breaks these.
- Binary SQLite files (`help_db`, `help_app_db`) and editor backups (`~` files,
  `settings.py~`) are tracked; do not "clean them up" without an explicit request —
  history rewrite already decided to keep the tree byte-stable.
- `TODO:` and `TODO_` are files, not markers.
- Django admin is scaffolded in comments but disabled; do not enable it casually.
- The `results` API view is imported in `urls.py` but its route is commented out —
  the scraping API was effectively retired late in development.

## Verifying changes

1. `python -c "import settings"`-style smoke check is meaningless here; if you must,
   boot `manage.py runserver` under era-appropriate Python and confirm the page
   renders (it will render even when data backends are dead — the JS fails soft).
2. For JS changes, diff your edit against the packed numbered copy and update both
   `help_page.js` (dev) and the current `help_page_000N.js` (prod).
3. For docs changes, secret-scan: `grep -REn "(SECRET_KEY *=|pass *==|MEMCACHIER_PASSWORD *= *)" <files>`
   should only ever match existing code, never your prose.

## Pointers

- [CHANGELOG.md](CHANGELOG.md) — every commit, newest first, with post-rewrite hashes.
- [architectural-diary/main.md](architectural-diary/main.md) — index of design
  decisions and the story of the project.
- [prompt.md](prompt.md) — one-shot recreation prompt (goal, stack, phases,
  acceptance criteria).
- Local branch `backup/pre-docs-20260908` holds the pre-rewrite history
  (messages-only rewrite on 2026-09-08); it is deliberately never pushed.
