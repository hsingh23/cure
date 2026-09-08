# Changelog

All notable changes to this project. This project has no releases; every commit
on `master` is listed below, newest first.

> **Note on rewritten history (2026-09-08):** this history was rewritten with a
> messages-only `git filter-branch` pass to replace vague 2012-era commit subjects
> ("changes", "cool beans", "the works") with conventional-commit messages that
> describe what each change actually did. Trees, authors, dates, and parent
> structure are byte-identical to the original history; only commit messages (and
therefore hashes) changed. Commit SHAs referenced anywhere from before 2026-09-08
are stale. The original history is preserved locally in
`backup/pre-docs-20260908`.

## 2013-05-12

### chore: verify Google site via meta tag instead of HTML file

[d39061a] - 2013-05-12 - Harsh Singh - type: chore

- Adds a `a `google-site-verification` meta tag` tag to the head of help_page_2.dtl, and removes the now-unneeded `google04c78a565d540489.html` URL route and its ...

### fix: rename verification view t to r to match URL route

[6052d56] - 2013-05-12 - Harsh Singh - type: fix

- Renames the Google site-verification view in help_app/views.py from `t` to `r` so it matches the `url(r'^google04c78a565d540489.html$', 'r')` pattern added in the previous commit, fixing the route that would ...

### chore: add Google site verification file and route

[5b99782] - 2013-05-12 - Harsh Singh - type: chore

- Adds a `google04c78a565d540489.html` template containing the Google site-verification token, a view `t` that renders it, and a URL route mapping that filename so Google Webmaster Tools can verify the site.
- Also (apparently accidentally) injects a stray `face;` fragment into the `.sidebar-nav` CSS rule of help_page_2.dtl.
- Note: the URL pattern points at view name `'r'` while the defined view is `t`, so the route as committed does not resolve.

## 2013-04-22

### feat: rebrand page as "Cure: Serendipitous Search"

[821f21f] - 2013-04-22 - Harsh Singh - type: feat

- Renames the help page title from "Help" to "Cure: Serendipitous Search" and updates the meta description to "Serendipitous Search like a boss" in help_page_2.dtl.
- Also adds an unused `options` parameter to `HelpSpace.load_initial_data` and a `nowiki` parameter to `HelpSpace.my_search` in help_page.js, preparing those functions to accept extra behavior flags.

### refactor: namespace help_page JS and split prod/dev script serving

[e887954] - 2013-04-22 - Harsh Singh - type: refactor

- Rewrites help_page.js (~1,200 lines churned) from loose global functions into namespaced `HelpSpace.*` methods with `'use strict'`, consistent 2-space style, and bug fixes; ships a packed help_page_0005.js.
- Updates help_page_2.dtl to load the JS via a `help_js_url` context variable, load Bootstrap 2.3.1 from the netdna CDN, and reindent/clean the layout.
- Adds a `/dev/` URL and view rendering the same template with the unpacked help_page.js for debugging, a top-level TODO_ notes file, and normalizes several static files from mode 755 to 644.

## 2012-10-19

### chore: remove saved canvas spec snapshot, use dat.gif sidebar logo

[ecbee9c] - 2012-10-19 - Harsh Singh - type: chore

- Deletes the ~7,600-line browser-saved copy of the HTML Standard canvas spec (the `.html` file and its `_files/` assets) that was added under `help_app/static/js/` in commit c681fdae.
- Also switches the sidebar logo image in help_page_1.dtl and help_page_2.dtl from `uclogo_horz_bw.gif` to the newly added `dat.gif`.

### fix: improve YouTube embed params and fancybox grouping

[81ae153] - 2012-10-19 - Harsh Singh - type: fix

- Updates YouTube embed URLs in help_page.js to use `controls=2&fs=1` (delayed controls + fullscreen) and an `ytplayer` iframe id instead of the `origin` parameter.
- Restores the default fancybox overlay (comments out `helpers: { overlay: null }`), removes stray `rel="tooltip"` attributes, and adds `rel="img"` grouping so image thumbnails navigate as a gallery.
- Re-packs help_page_0004.js to match and adds a dat.gif image asset.

## 2012-10-13

### feat: open PDFs and iframe content full-size in fancybox

[21f1353] - 2012-10-13 - Harsh Singh - type: feat

- Upgrades the bundled Fancybox jQuery plugin (unpacked jquery.fancybox.js, new buttons/media/thumbs helper JS+CSS, updated sprite/overlay/loading images).
- Reconfigures `.various` links in help_page.js to open as full-viewport iframes with elastic open/close effects and close-on-click, and drops the `fancybox.iframe` class from Zoho-viewer PDF links in favor of the new ...
- Also redesigns help_page_1.dtl (sidebar with search/suggested/related/SWF/PDF/interview sections plus tabbed content panes and carousels), adds the packed help_page_0004.js, and points help_page_2.dtl at it.

## 2012-08-29

### fix: load staticfiles before first {% static %} use in help page

[8bdebe8] - 2012-08-29 - Harsh Singh - type: fix

- Moves the `{% load staticfiles %}` tag from mid-`<head>` to line 1 of `help_page_2.dtl`.
- The prior commit introduced a favicon link using `{% static %}` *before* the `{% load %}` directive appeared, which would cause a TemplateSyntaxError; loading at the top fixes tag ordering.

### fix: use {% static %} tags for favicon and UC logo in help page

[3062e30] - 2012-08-29 - Harsh Singh - type: fix

- Replaces two hard-coded `http://statics.site50.net/img/...` asset URLs in `help_page_2.dtl` (favicon shortcut icon and the UIUC logo image) with Django `{% static %}` template tags so the help page pulls static ...

### chore: point production STATIC_URL at st4.herokuapp.com

[0dd7f41] - 2012-08-29 - Harsh Singh - type: chore

- Changes the production `STATIC_URL` in settings.py from `http://statics.site50.net/` to `http://st4.herokuapp.com/`.
- Also adds ~7,600 lines of a browser-saved copy of the HTML Standard canvas spec page (an .html file plus its `_files/` assets: PNGs, dfn.js, reviewer.js, status.js, updater.js, link-fixup.js, logo) under ...

## 2012-07-31

### feat: add reset-keyword endpoint to clear cached keyword JSON

[5ce6f11] - 2012-07-31 - Harsh Singh - type: feat

- Adds a `/reset-keyword/` Django view that deletes the cached `db_<keyword>_json` and `db_<keyword>_url` cache entries for a POSTed keyword (403 unless session flag `cool` is set).
- Adds a Reset button to the make_help_json_lint template that POSTs the current keyword to the new endpoint and alerts the result, showing the button only after a submit or sample load.
- Also fixes a typo in the json2 static path (`json2.j` -> `json2.js`), wires the new URL route, and commits an updated binary help_app_db.

### style(api): narrow JSON editor textarea to span10

[915bdc4] - 2012-07-31 - Harsh Singh - type: style

- Changes the JSON input textarea in make_help_json_lint.dtl from Bootstrap span11 to span10 width, and commits a touched help_app_db sqlite binary with unchanged size (551936 bytes both sides).

### fix(api): load sample_0003.json in JSON editor fallback

[bd87160] - 2012-07-31 - Harsh Singh - type: fix

- Changes the load_sample fallback in make_help_json_lint.dtl to fetch sample_0003.json instead of sample_0001.json when populating the JSON editor textarea with a sample document.

### fix(help): index Eck Notes pairs and ship packed script build

[bd49624] - 2012-07-31 - Harsh Singh - type: fix

- Fixes the cs125 Eck Notes link generation in help_page.js, which referenced val[0]/val[1] (the class-name string) instead of v[0]/v[1] (the per-item name/URL pair).
- Adds help_page_0003.js, a Dean-Edwards-packer minified build of help_page.js, and switches help_page_2.dtl to load the packed file in place of help_page_0002.js (with the readable help_page.js left commented out).

### feat(help): add class/subject hooks and honor init options array

[80087fb] - 2012-07-31 - Harsh Singh - type: feat

- Reworks the help-page JS to read initial_search_terms (array) instead of initial_search_term, expect initial_swf as a name-to-URL mapping, and check options via $.inArray since options arrive as a string array (the ...
- Adds load_class/load_subject hooks driven by class/subject init fields and URL params, including a cs125 "Eck Notes" sidebar section fetched from help-eck.herokuapp.com into a new related_hook container, plus ...
- Disables the Django admin (urls, INSTALLED_APPS, ADMIN_MEDIA_PREFIX), routes /make-help-json/ to the lint view, rewrites help_page.js (627 insertions), adds init_0003.json, sample JSONs, and HTML API documentation, ...

## 2012-07-30

### feat(api): add linting JSON editor for help content

[1cd3704] - 2012-07-30 - Harsh Singh - type: feat

- Adds an authenticated make-help-json-lint view, URL, and template (make_help_json_lint.dtl) providing a JSON editor with in-browser parsing/validation via json2.js, jsl.parser, jsl.format, lined-textarea, ...
- Moves the is_valid_jsonp_callback_value / is_valid_javascript_identifier helpers from views.py into help.py, renames init.json to init_0002.json (adding a subject field), points the admin nav's JSON tab at the new ...
- Also adds a related_hook sidebar div, cache-manifest MIME type in .htaccess, and tweaks help_page_0001.js null-checking data.type.

## 2012-07-28

### build(deploy): run app with gunicorn on Heroku

[e8cf05c] - 2012-07-28 - Harsh Singh - type: build

- Adds a Procfile running the Django app via gunicorn (python manage.py run_gunicorn -b 0.0.0.0:$PORT -w 8), pins gunicorn==0.14.6 in requirements.txt, and registers gunicorn in INSTALLED_APPS.
- Also accidentally commits a settings.py~ editor backup file (215 lines).

### fix(api): resolve script URLs via static template tags

[34f6600] - 2012-07-28 - Harsh Singh - type: fix

- Replaces the hardcoded /static/js/...
- script src paths in the make_help_json template with Django {% static %} template tags, and reorders the script loads so bootstrap.min.js is included before jquery.js and help_maker.js.

### feat(help): fork page JS to help_page_0001.js with query-driven load

[3413af3] - 2012-07-28 - Harsh Singh - type: feat

- Adds help_page_0001.js as a fork of help_page_2.js and switches help_page_2.dtl to load it.
- The new file makes load_initial_data accept a search term (driven from the q query-string variable and the Enter keypress instead of directly calling load_results), extends clear_previous_results to also empty ...

### fix(help): add origin param and player id to YouTube embeds

[0018abf] - 2012-07-28 - Harsh Singh - type: fix

- Updates the YouTube iframe embed URLs built in parse_initial and load_results to append the origin=http://cure.herokuapp.com/ parameter and replaces the youtube-player class with an id="player" attribute (retaining ...
- Applies the change in all three embed-building code paths.

### feat(help): load content from per-source services with opt-out flags

[41ed3e9] - 2012-07-28 - Harsh Singh - type: feat

- Reworks help_page_2.js so load_results/load_from_api accept an options array of no_auto_* flags (matching the new options in init.json) to disable auto-loading of wikipedia, images, youtube, pdfs, factbites, ...
- Data sources are split onto dedicated Heroku endpoints (help-facts, help-interview, help-pdf, help-related, help-swf, help-img) with per-source error handlers that hide the corresponding tab and sidebar section on ...
- The template restructures sidebar sections into hideable wrapper divs, comments out the Youtube/Images tabs, and adds a generated-content disclaimer footer; adds static-asset cache headers via .htaccess, a shorten() ...

## 2012-07-26

### fix(scrapers): tolerate malformed Dogpile/Factbites results

[894973a] - 2012-07-26 - Harsh Singh - type: fix

- Wraps the Dogpile PDF and image scraping loops in try/except so malformed result links no longer break the whole scrape, and makes get_web_factbites check the HTTP status code before parsing, returning empty ...
- Moves the clear_previous_results() call from load_from_api() up into load_results() so UI results are cleared once at the start of a search rather than mid-load.
- Includes an updated help_app_db binary.

### refactor(js): cache jQuery selectors in HelpSpace namespace

[3dad814] - 2012-07-26 - Harsh Singh - type: refactor

- Adds a populate_namespace() function that caches all jQuery DOM lookups into a global HelpSpace namespace object and replaces the scattered $('#id') calls throughout help_page_2.js with references to the cached ...
- Adds clear_previous_results() to empty tabs, sidebar sections, and flow containers, now called from load_from_api().
- Also adds id attributes to sidebar nav-header list items and widens the search input in help_page_2.dtl.

## 2012-07-25

### feat(help): add Factbites and Interview tabs with explicit pane toggling

[3b9448e] - 2012-07-25 - Harsh Singh - type: feat

- Extends the help page with two new content sources: load_from_api() now renders data.facts into a #fact_flow carousel (10s interval) and #factbites pane, and data.interview links into an #interview pane plus a ...
- Tab handling switches from Bootstrap's tab('show') to a manual disable_all() helper that hides every pane before showing the selected one, an SWF tab (lowercase #swf) is re-enabled alongside new ...
- The template adds the fact_span column, reorganizes the sidebar (Interview Content header, STL links), and help_app_db is updated.

## 2012-07-24

### fix(help): accept scalar values in initial JSON fields

[a132187] - 2012-07-24 - Harsh Singh - type: fix

- parse() in help_page_2.js now checks instanceof Array for suggested_search, related_search, initial_swf, initial_youtube_id, and initial_images, adding fallback branches that render a single scalar value directly ...
- load_initial_data's inline-JSON path switches from parse2 to the (now tolerant) parse(), and views.py drops a few blank lines.
- The scalar branch for initial_youtube_id mistakenly reads data.initial_swf rather than the youtube id.

### feat(help): fetch initial JSON client-side via get-json proxy

[f556f89] - 2012-07-24 - Harsh Singh - type: feat

- load_initial_data() now handles two response shapes: when get-initial returns {type:"url"} it fetches the real JSON through the get-json.herokuapp.com JSONP proxy and parses it, otherwise it parses inline JSON via a ...
- views.py get_initial correspondingly returns a small {url, type} wrapper pointing at the proxy instead of fetching the target server-side, and post_submit_url pings the proxy's refresh endpoint after storing a URL.
- In help_page_2.js, SWF sidebar links now display the filename instead of the key, YouTube results bump from 5 to 8, and ~80 lines of commented-out code and pasted API notes/keys are deleted.

### fix(help): resolve merge conflict markers, keep pdf_items.empty()

[5be5c3f] - 2012-07-24 - Harsh Singh - type: fix

- Follow-up to the previous merge that removes the "<<<<<<< HEAD / ======= / >>>>>>> cb922c0" conflict markers from load_results() in help_page_2.js.
- The resolution keeps the incoming branch's version, which includes the pdf_items/#pdf empty() calls alongside the video and picture flow clears, and drops the HEAD-side duplicate lines.

### merge: bring in pdf-clear branch (conflict markers left unresolved)

[3e9d49d] - 2012-07-24 - Harsh Singh - type: chore

- Merge of Alex's cb922c0 line into the API rework.
- The only change relative to the first parent is in load_results() in help_page_2.js, and it was committed with literal "<<<<<<< HEAD / ======= / >>>>>>> cb922c0" conflict markers still in the file — the merge of ...
- The conflict markers remain in the committed tree and would break that code path at runtime.

### feat(api): add password-authed JSON/URL submission API

[451d30d] - 2012-07-24 - Harsh Singh - type: feat

- Major rework of the initial-data pipeline.
- views.py gains a password-based /auth/ endpoint (session valid 1 hour), authenticated make-help-json/make-help-url form pages, post_submit_json/post_submit_url handlers that store entries in the Django cache under ...
- The Website model splits into Website_JSON and Website_URL, urls.py adds the new routes, and settings.py enables XFrameOptions/ConditionalGet middleware plus cache-backed sessions.

## 2012-07-13

### chore(db): update committed help_app_db binary

[9eef812] - 2012-07-13 - Alex Zhang - type: chore

- Binary-only change to help_app_db, the committed SQLite database file, growing from 37,888 to 118,784 bytes.
- No source code changes accompany it; the database was presumably updated through use of the new set-initial-json endpoint or local development activity.

### Merge branch 'master' of https://github.com/hsingh23/boss-help

[d93bbbe] - 2012-07-13 - Alex Zhang - type: chore

- Merge commit syncing local work (PDF history fix) with the remote boss-help master.
- Relative to the first parent it brings in: new get_initial/set_initial Django views backed by a revised Website model (key_word now indexed, json_url replaced by an initial_json TextField), new /set-initial-json/ and ...

### fix(help): empty main PDF list on new search

[e6dfd6b] - 2012-07-13 - Alex Zhang - type: fix

- Adds two lines to load_results() in help_page_2.js: capture the #pdf element into pdf_items and call pdf_items.empty() alongside the existing clears of the video, picture, and sidebar containers.
- Previously the main PDF list was only appended to (in load_from_api), so successive searches accumulated results from prior queries.

### Merge branch 'master' of github.com:hsingh23/boss-help

[22ea058] - 2012-07-13 - Harsh Singh - type: chore

- Merge commit pulling the remote github.com:hsingh23/boss-help master (commits 87fc9bf..f8085ff by Alex Zhang) into the local line.
- The merged-in changes touch help_page_2.js, help_page_2.dtl, and help_page_4.dtl (142 insertions, 144 deletions vs first parent): the tabbed help page 4 layout with sidebar PDF content, PDF list rendering in ...
- No conflicts evident from the diffstat resolution.

### chore(help): add middle name to author meta tag on help page 2

[db520c9] - 2012-07-13 - Alex Zhang - type: chore

- Single-line change to help_page_2.dtl updating the HTML meta author tag from "Harsh Singh and Alex Zhang" to "Harsh Singh and Alex Qian Zhang".
- No other files or logic touched.

### feat(help): add tabbed layout and sidebar PDF content to help page 4

[00e16ce] - 2012-07-13 - Alex Zhang - type: feat

- Restructured help_page_4.dtl from a fluid container with fixed navbar to a row-based layout with tab navigation (Combo/Youtube/Images/PDF/Wikipedia), a UC logo, and a sidebar that now includes PDF content links plus ...
- Updated help_page_2.js to populate a numbered full PDF list in the main content area while limiting the sidebar to the first three PDFs, re-enabled load_initial_data() on page load, moved carousel initialization ...
- Also commented out the Wolfram/SWF tabs, switched help_page_2 to unminified bootstrap.js, and adjusted body padding.

### feat: add set-initial-json and get-initial-json endpoints

[d8eac5b] - 2012-07-13 - Harsh Singh - type: feat

- Converts get_initial/set_initial in views.py into Django request handlers: get_initial reads ?search and optional ?callback for JSONP, set_initial validates POSTed keyword/json (rejecting invalid JSON) and creates a ...
- Registers ^set-initial-json/ and ^get-initial-json/ routes in urls.py, renames the model's json_url to a TextField initial_json with db_index on key_word, moves the maketrans case-folding table into views.py with a ...
- get_initial still references undefined search/callback names.

## 2012-07-12

### feat: persist initial search terms via Website model

[b6dd220] - 2012-07-12 - Harsh Singh - type: feat

- Adds get_initial(search, callback) and set_initial(search, url) to help_app/views.py, storing and retrieving initial search terms as Website rows keyed by a lowercased keyword, with get_initial returning a JSONP ...
- In help.py, moves the cache import inside get_results and sets up a string.maketrans lowercase translation table.
- The code is incomplete: help.py references an undefined letter_set (NameError at import) and views.py uses string/tab/deletions without importing them.

## 2012-07-11

### Merge branch 'master' of https://github.com/hsingh23/boss-help

[e0a825a] - 2012-07-11 - Alex Zhang - type: chore

- Merge commit pulling remote master (1e847a2: sidebar-logo restyle, favicon, dropped EPS/TIF logo assets, Website.key_word rename) into Alex's line carrying the disabled initial-load and silenced debug log (b48e1e7).
- Relative to the remote parent it applies Alex's nine-line JS change; relative to the local parent it imports the restyle and model rename.
- The merge is a clean union with no additional resolution changes.

### chore: skip initial data load and comment out facts debug log

[fe757f5] - 2012-07-11 - Alex Zhang - type: chore

- Comments out the load_initial_data() call in the document-ready handler so the page no longer auto-populates on load, adds carousel pause/start calls at the end of load_initial_data (now unreachable from ready), ...

### Merge branch 'master' of github.com:hsingh23/boss-help

[f6f68d0] - 2012-07-11 - Harsh Singh - type: chore

- Merge commit joining local styling work (3d9b5a5: sidebar logo, navbar removal, favicon, model field rename line) with remote master (6b639f6: image-flow JS fixes and deletion of the binary help_app_db).
- The merge is a clean union of both lines: the JS image counter/cap changes land alongside the template restyle, and the generated database file stays removed.

### style: replace top navbar with sidebar logo and tighten page padding

[0b3dad7] - 2012-07-11 - Harsh Singh - type: style

- Replaces the remote UIUC banner images with a locally hosted uclogo_horz_bw.gif placed above the sidebar, comments out the fixed-top navbar entirely, and reduces body padding from 60/40px to 20/10px.
- Adds a favicon link, credits Alex Zhang in the author meta tag, adds favicon.ico and uclogo_horz_bw.gif to static/img, and removes the large ilogo_horz_bw eps/gif/tif assets.

### refactor: rename Website.url field to key_word

[68ca58b] - 2012-07-11 - Harsh Singh - type: refactor

- Renames the CharField `url` to `key_word` on the Website model in help_app/models.py; json_url is unchanged and the file still lacks a trailing newline.

## 2012-07-10

### Merge image-flow work and remove binary help_app_db from repo

[96cdfdd] - 2012-07-10 - Alex Zhang - type: chore

- Merge commit joining ecaf0e7 (image flow fixes: file-scope num_images, keypress reset, 16-image cap, no default active slide) with 8fd4737 (interview field in help.py, UIUC branding, Wikipedia not-found handling).
- Relative to the second parent it brings in the image flow changes; relative to the first it adds the interview field and console.log, and the merge removes the tracked binary help_app_db file (741KB -> 0) from the ...

### fix: correct image flow counter and cap API thumbnails at 16

[f6dcee0] - 2012-07-10 - Alex Zhang - type: fix

- Moves the num_images global to the top of help_page_2.js and resets it in the search keypress handler rather than in load_results.
- Drops the "active" class from the first initial-data carousel item so no slide is pre-activated, enables the num_images increment in load_initial_data, and limits load_from_api thumbnail rendering to the first 16 ...
- Binary help_app_db updated as well.

### Merge branch 'master' of https://github.com/hsingh23/boss-help

[8b40be6] - 2012-07-10 - Harsh Singh - type: feat

- Merge commit joining 202d394 and 33e12f8, carrying the num_images counter, carousel pause/start, and thumbnail key fix into master.
- Beyond the merge, it adds University of Illinois logo/banner images to the help page template, handles Wikipedia "missing" pages by showing a not-found message instead of an empty extract, removes stale commented ...

### feat: include interview questions in search results

[47c7689] - 2012-07-10 - Harsh Singh - type: feat

- Adds result['interview'] to get_results in help.py, populated via get_web_dogpile with the search term plus "+interview+questions", and caches it alongside the other result fields.
- Adds a console.log(data.facts) debug statement in help_page_2.js before rendering images.
- Also includes a binary change to help_app_db.

### fix: use correct loop key for thumbnail grouping in initial data load

[38132f5] - 2012-07-10 - Alex Zhang - type: fix

- Fixes a bug in load_initial_data where the inner $.each used the stale outer `index` variable instead of `key`, breaking the every-4th-item row-grouping of thumbnails.
- Adds a global num_images counter incremented in load_from_api and load_results and reset per search.
- Starts the picture flow carousel and pauses video flow carousels after API loads, and removes a block of commented-out Google image carousel code.

### refactor: merge cleanup branch, keeping image fix and Illinois banner

[b848c61] - 2012-07-10 - Alex Zhang - type: refactor

- Merge commit integrating Harsh Singh's large cleanup (73ada79) into Alex Zhang's branch (2d1b4fa).
- Versus the first parent it removes ~3638 lines: the unused ti_*/test_* template suite, stray marker files ("a", "charles", "i-am-in"), duplicate help_page.js.2, and per-component bootstrap scripts, and it hardens ...
- The conflict resolution keeps Alex's local work — the raw-URL initial-image fix in load_initial_data() and the University of Illinois banner in help_page_2.dtl — while adopting the .toggle disabling, ...

### fix: use raw URLs for initial images and add Illinois branding

[5bf71a5] - 2012-07-10 - Alex Zhang - type: fix

- In load_initial_data(), the initial_images carousel branches are reverted to use the raw value as both href and img src (the earlier change to val.url/val.tbUrl broke rendering since initial_images entries are plain ...
- help_page_2.dtl gains University of Illinois logo/banner <img> tags at the top of the page body (with a commented-out header div variant), and the commented-out Bing image code in load_results() is reorganized to the ...
- help_app_db binary is updated.

### refactor: remove dead templates and junk files; harden JSONP callback

[ae6e462] - 2012-07-10 - Harsh Singh - type: refactor

- Large cleanup (~3650 lines deleted): drops unused templates (test_form, test_response, ti_* suite, index/login/setup/viz), stray files ("a", "charles", "i-am-in"), duplicate help_page.js.2, and the individually ...
- init.php is hardened with a JSON content-type, callback-name validation against JS identifier syntax and reserved words, and a 400 for invalid callbacks.
- help_page_2.js strips dead commented-out code (Bing/DuckDuckGo blocks), disables .toggle links while searching, renames initial_video_id to initial_youtube_id, and load_from_api() now also appends API image results ...

## 2012-07-09

### fix: merge remote JSONP sidebar work with Wikipedia not-found fix

[4fbc5b3] - 2012-07-09 - Alex Zhang - type: fix

- Merge commit by Alex Zhang combining his Wikipedia not-found guard (75d2527) with Harsh Singh's master (fdbec20), which added the /api/ JSONP client (load_from_api, sidebar PDF section via Zoho viewer, #sidebar-swf), the JSONP-aware results() view, the help-maker tool, the 5-day cache timeout, and the vendored jquery/help_page_3.js files.
- The merged tree is fdbec20 plus the 7-line Wikipedia missing-page fix; no conflicts.

### fix: show not-found message for missing Wikipedia pages

[ee95f50] - 2012-07-09 - Alex Zhang - type: fix

- In load_results() in help_page_2.js, the Wikipedia extract loop now checks val.missing and renders "Not found on Wikipedia, click on the title above for redirection" instead of an empty paragraph when the MediaWiki ...

### feat: add JSONP API support and sidebar PDF section

[9cc578c] - 2012-07-09 - Harsh Singh - type: feat

- Adds load_from_api() to help_page_2.js, which JSONP-fetches /api/<search> during load_results() and fills a new "PDF Content" sidebar section with Zoho-viewer embed links, and clears/populates #sidebar-swf (renamed ...
- The results() Django view now wraps responses in the requested JSONP callback.
- Sidebar links get class="toggle", the Wolfram/PDF/SWF tabs are commented out of help_page_2.dtl, the commented-out bootstrap script block is removed, and the /refresh/ route and view are disabled.

### chore: remove commented-out thumbnail carousel markup

[a0ee575] - 2012-07-09 - Alex Zhang - type: chore

- Deletes the six commented-out lines inside #picture_flow_items in help_itter/help_page_2.dtl — the old static "item active" and "item" thumbnail containers (thumbnails_active_items / thumbnails_items) that the JS now ...
- No functional change; pure dead-markup removal.

## 2012-07-08

### feat: add help-maker tool and host-restrict the results API

[1d5cb85] - 2012-07-08 - Harsh Singh - type: feat

- Adds a help-page authoring tool: help_maker.dtl form template, help_maker.js dynamic multi-field input behavior, a make_help view, and a /make/ URL.
- The results() API view now only serves get_results() for localhost:8000 and cure.herokuapp.com hosts, returning "Sorry - this API is private" otherwise.
- The main help() view switches to the help_itter/help_page_2.dtl template, help_page_3.js (a 4-space-indented variant of the page JS) and a vendored minified jquery.js are added, the help_page_2.dtl sidebar gains a ...

### fix: merge remote imageflow and SWF tab fixes

[76e4324] - 2012-07-08 - Harsh Singh - type: fix

- Merge commit pulling Alex Zhang's "fixed imageflow & SWF" work (44885ae) into local master.
- The merged change reorders the modulo-4 thumbnail branches in help_page_2.js so carousel rows close on the index%4===3 item, narrows carousel initialization to #picture_flow, renames the SWF tab href/pane ids and ...
- No merge conflicts; the tree combines this with the earlier init.php JSONP change.

## 2012-07-03

### fix: correct picture-flow carousel row closing and SWF tab selector

[bc9d5c3] - 2012-07-03 - Alex Zhang - type: fix

- Reorders the modulo-4 branches in help_page_2.js so the thumbnail that closes a carousel row (</ul></div>) is emitted by the ===3 case in both load_initial_data() and load_results(), and updates the initial-data ...
- Narrows the carousel initializer from $('[id^="picture_flow"]') to $('#picture_flow').
- Renames the SWF tab href/pane ids from #swf to #SWF in help_page_2.dtl and updates the matching jQuery tab-click selector, and adds a CS125 textbook iframe link to the sidebar.

## 2012-06-30

### fix: serve init data via self-hosted PHP JSONP wrapper

[a2b9f52] - 2012-06-30 - Harsh Singh - type: fix

- Adds help_app/static/json/init.php, a small PHP script that reads init.json and wraps it in the JSONP callback, and switches load_initial_data() in both help_page.js and help_page_2.js to fetch from this self-hosted ...
- Also removes the dead "Views"/"Misc" navigation links block from the help_page.dtl sidebar and strips trailing whitespace throughout the two JS files.

## 2012-06-29

### fix: group picture carousel thumbnails into rows of four

[f151db1] - 2012-06-29 - Harsh Singh - type: fix

- Merge of the remote master branch whose content reworks the help_page_2 picture carousel.
- In help_page_2.js, both load_initial_data() and the Google image search callback now build carousel items containing four thumbnails per row (key%4/index%4 grouping) instead of splitting images between separate ...
- The template moves the carousel-inner id to #picture_flow_items and comments out the old static active/item thumbnail containers, and load_results() clears/appends to the unified #picture_flow_items element.

### fix: page image thumbnails four per carousel slide

[4caaebb] - 2012-06-29 - Alex Zhang - type: fix

- Reworked the image carousel population in help_page_2.js so both initial images and Google image results are grouped four thumbnails per carousel slide: index%4===0 opens a new item/ul (with active on the first), ...
- Removed the separate active/inactive thumbnail lists, consolidated on the single #picture_flow_items container, and commented out the old two-pane thumbnail markup in help_page_2.dtl.

### fix: skip Factbites related topics with missing anchors

[a4f13b6] - 2012-06-29 - Harsh Singh - type: fix

- Extended the try/except pattern in get_web_factbites to the related-topics loop in help_app/help.py, so a div whose .a anchor extraction fails is skipped instead of raising.
- Also removed a stray blank line.

### Merge branch 'master' of https://github.com/hsingh23/boss-help

[a7703eb] - 2012-06-29 - Alex Zhang - type: chore

- Merge commit pulling the remote master work (Harsh's memcacheify cache configuration from 32e5c84, the Factbites parse guard from 6ffaea3, and the whitespace/charles file from e59e0e3) into Alex's local branch that had just received the thumbnail resizing fix (4dbff00).
- Combined diff spans settings.py, help.py, requirements.txt, views.py, and urls.py.

### fix: give image thumbnails fixed height and correct video target

[b8df366] - 2012-06-29 - Alex Zhang - type: fix

- Set an explicit height="125px" on the Google image result thumbnails in help_page_2.js so they render as uniformly sized thumbnails instead of unconstrained-height images.
- Corrected the initial-data video embeds to prepend into #video_flow_items rather than #picture_flow_items in both help_page.js and help_page_2.js, and applied the jsonpify.heroku.com init.json proxy URL to ...
- Left commented-out scaffolding for a split active/inactive thumbnail list.

### chore: add trailing newline to views and whitespace tweaks

[5186510] - 2012-06-29 - Harsh Singh - type: chore

- Created an empty file named "charles" at the repo root, added a trailing newline to help_app/views.py, and inserted a blank line in urls.py.
- No functional changes.

### fix: skip malformed Factbites rows instead of crashing

[0bc5836] - 2012-06-29 - Harsh Singh - type: fix

- Wrapped the factbites table-parsing loop in help_app/help.py in a try/except so rows whose next_sibling traversal fails are skipped instead of crashing the whole get_results pipeline.
- Added debug print statements dumping the parsed soup objects to stdout.

### fix: use memcacheify for production cache configuration

[d00be7f] - 2012-06-29 - Harsh Singh - type: fix

- Replaced the hand-rolled pylibmc/MemCachier cache configuration in settings.py with django-heroku-memcacheify's memcacheify() call, keeping the old pylibmc code commented out as reference.
- Added django-heroku-memcacheify==0.3 to requirements.txt.
- Also updated help_page_2.js to load init.json through the jsonpify.heroku.com JSONP proxy (mirroring the same change made to help_page.js in c9beb72).

### Merge branch 'master' of github.com:hsingh23/boss-help

[a566d8d] - 2012-06-29 - Harsh Singh - type: chore

- Merge commit bringing the remote master (Alex Zhang's help_page_2 JavaScript and help page template rework, commits 37be1b7 and 2a2d369) into the local master that had just gained the server-side scraping API (c9beb72).
- The combined diff adds help_page_2.js and applies the thumbnail-carousel/tab layout updates across help_page_1 through help_page_10 templates.
- No conflicts appear to have required manual resolution beyond template updates.

### feat: add server-side search scraping API with memcached results

[8c1e482] - 2012-06-29 - Harsh Singh - type: feat

- Added help_app/help.py, which scrapes Dogpile (web, PDF, image results) and Factbites (facts, related topics) using random user-agent FancyURLopener subclasses and caches the JSON results for two days via Django's ...
- Added /api/<search>/ and /refresh/<search>/ URL routes with corresponding views, a Website model, memcache configuration (MemCachier/pylibmc in production, database cache otherwise), and the full Bootstrap CSS asset set.
- Also changed the front-end init.json fetch to go through the jsonpify.heroku.com proxy.

## 2012-06-28

### fix: make help page tabs functional with shared carousel spans

[530f5d5] - 2012-06-28 - Alex Zhang - type: fix

- Wired up Bootstrap tab click handlers in help_page_2.js for the combo, youtube, images, wolfram, pdf, swf, and wikipedia tabs, showing/hiding the video carousel, picture carousel, and Wikipedia text panel with ...
- Restructured help_page_2.dtl to move the video/picture carousels and wiki text outside the tab panes into shared spans toggled by the tab handlers.
- Fixed the thumbnail/video selectors from class-based to id-based lookups and switched the template to load help_page_2.js instead of help_page.js.

## 2012-06-27

### feat: add help_page_2 search JS and thumbnail carousel layout

[1946492] - 2012-06-27 - Alex Zhang - type: feat

- Added a new 290-line JavaScript file (help_page_2.js) that powers the help page search experience: enter-key search handling, Wikipedia extract fetching via MediaWiki API, Google image search results rendered into ...
- Refactored all ten help_page_N.dtl templates to swap the old picture/video flow markup for a thumbnail-based carousel layout and switched from individual bootstrap plugin scripts to bootstrap.min.js.
- Moved the help page script reference from tools/Help/help_page.js to js/help_page.js.

### fix: compare PRODUCTION env var as string in settings

[dc1f3d4] - 2012-06-27 - Harsh Singh - type: fix

- Changed the production environment check in settings.py from comparing os.environ['PRODUCTION'] == True to == 'True', since environment variables are strings and the boolean comparison would never succeed.
- Added ipython==0.12.1 to requirements.txt.
- Without this fix, DEBUG would never be disabled in production deployments.

### fix: restore missing `import os` in settings.py

[cac3af2] - 2012-06-27 - Harsh Singh - type: fix

- One-line follow-up to the previous commit: re-adds `import os` at the top of settings.py.
- The prior refactor deleted the os/socket imports while the file still calls os.path.dirname and reads os.environ['PRODUCTION'], so settings would fail to import without this.

### chore: detect production via PRODUCTION env var in settings

[76f61ca] - 2012-06-27 - Harsh Singh - type: chore

- Replaces hostname-based LOCAL detection in settings.py with a try/except block that checks the PRODUCTION environment variable to turn off DEBUG, point STATIC_URL at statics.site50.net, and configure Postgres via ...
- The change is buggy: it deletes the `import os.path`/`import socket` lines while still using `os.path` and `os.environ`, and compares `os.environ['PRODUCTION'] == True` (string vs bool), so the production branch ...

### feat: add production (no-debug) settings, error pages, root route

[e390202] - 2012-06-27 - Harsh Singh - type: feat

- Prepares the site for deployed (non-debug) operation: settings.py now detects the production host by UUID and, when not local, disables DEBUG/TEMPLATE_DEBUG and serves static files from statics.site50.net.
- Adds base/404/500 templates, routes the site root (/) to the help view, restructures the help page image carousel into paged thumbnail grids above the video flow, switches to bootstrap.min.js, and ignores Sublime ...

### Merge branch 'master' of heroku.com:boss-help

[73fc2a2] - 2012-06-27 - Harsh Singh - type: chore

- Non-conflicting merge that pulls the Heroku-deployed remote's master (containing Alex Zhang's empty i-am-in marker file) into local master after the README commit.
- No code changes; the merge itself introduces nothing beyond the remote's marker file.

### docs: add README.md placeholder

[9d080e3] - 2012-06-27 - Harsh Singh - type: docs

- Creates README.md containing a single motivational line, "Lets get crackalacking!".
- No setup instructions, description, or other documentation content.

### chore: add i-am-in marker file

[7dc54e3] - 2012-06-27 - Alex Zhang - type: chore

- Creates a single empty file named `i-am-in` at the repo root with no other changes.
- This is a playful test commit verifying that the new contributor could push to the repository, not a functional change.

### fix: comment out console.log calls that break page in IE

[2f681d8] - 2012-06-27 - Harsh Singh - type: fix

- Comments out two console.log statements in help_page.js (the Wikipedia API URL and the assembled YouTube video HTML).
- Leaving console.log calls un-commented causes JavaScript errors in Internet Explorer when the developer tools are not open, which would break the help page there.

### feat: make help page results functional; add Success Book templates

[fd753a4] - 2012-06-27 - Harsh Singh - type: feat

- Gets iteration 1 of the help page working: help_page.js now splits Google image results into active and regular thumbnail carousels, re-enables the YouTube video carousel embeds, and pauses auto-slide on the video flow.
- Adds a batch of new templates — fake Bluestem-style dev login, index placeholder, and a "Success Book" family (setup/viz tool-manager shells, ti_base/ti_column/ti_grade/ti_user text-input views, ...
- Also commits the sqlite database files (help_app_db, help_db), which should not be in version control.

### refactor: consolidate settings at repo root and prune static assets

[5d48ebd] - 2012-06-27 - Harsh Singh - type: refactor

- Cleans up after the settings move: deletes help_app/settings.py (superseded by top-level settings.py), removes the duplicated Django admin assets under static/admin and the entire static/other directory of salvaged ...
- Registers 'help_app' in INSTALLED_APPS, renames the local sqlite DB to help_app_db, drops a stray debug print, switches the template to bootstrap.min.css, syncs help_app/urls.py with the new routes, and disables ...

### feat: serve help page from Django with 10 template iterations

[15ddac3] - 2012-06-27 - Harsh Singh - type: feat

- Adds the first working page: views.py defines `help` and `help_itter` rendering help_page.dtl plus ten iteration variants (help_page_1..10.dtl), and urls.py routes /help/ and /help(N)/ while enabling the Django admin.
- Duplicates settings.py/urls.py at the repo root (manage.py repointed to the top-level settings module), sets TEMPLATE_DIRS and ADMIN_MEDIA_PREFIX, and copies Django admin static assets into help_app/static/admin so ...
- The help page itself is a Bootstrap layout with search sidebar, image/video carousels, and a Wikipedia column.

## 2012-06-26

### feat: add frontend static assets and environment-aware settings

[9213b86] - 2012-06-26 - Harsh Singh - type: feat

- Dumps ~200 static files into help_app/static — Bootstrap CSS/JS, jQuery with fancybox/quickselect plugins, Django admin assets, and copies of prior class-project tools (d3, raphael, grade-visualization JS) — plus the ...
- Configures settings.py to use sqlite3 locally (hostname 'Frank') or Postgres via dj_database_url elsewhere, sets STATIC_ROOT to the project static dir, adds template context processors, and adds psycopg2 to requirements.

### feat: scaffold initial Django 1.4 help_app project

[60ca082] - 2012-06-26 - Harsh Singh - type: feat

- Creates the repository skeleton for a new Django 1.4 project named help_app, including settings.py with default middleware/auth/staticfiles configuration, empty urlconf, WSGI entry point, manage.py, requirements.txt ...
- All code is the standard `django-admin.py startproject` template with no custom views or models yet.
- The database engine is left blank, indicating the app was not yet runnable against a real datastore.

