# PocketTracker Customization Guide

PocketTracker is intentionally a plain HTML/CSS/JavaScript project. You can customize it without Node.js, npm, a bundler, or an API key.

## Branding

### App name
Change the visible name in:
- `index.html` — page title and brand
- `manifest.json` — `name` and `short_name`

### Colors
Edit the CSS variables at the top of `style.css`:
- `--p` — primary accent
- `--bg` — page background
- `--s` — card/surface background
- `--t` — main text
- `--m` — muted text

### Categories
Edit the `CATEGORIES` array near the top of `app.js`.

## Currency

The built-in display choices are NGN, USD, GBP and EUR. Add another currency to the Settings select and the allowed-currency validation in `restore()` if you need one.

## Data model

Each transaction contains:
- `id`
- `description`
- `amount`
- `type` (`income` or `expense`)
- `category`
- `date`
- `recurring`

Data is stored under the browser localStorage key `pockettracker-v4`.

## Hosting

The app can be hosted as static files. No server-side runtime is required.

For the service worker and installable-app behavior, use HTTPS or localhost. Opening `index.html` directly with `file://` is sufficient for the core tracker but may not enable service-worker features.

## Before selling a customized version

Test:
1. Add an income.
2. Add an expense.
3. Edit a transaction.
4. Delete a transaction.
5. Search and filter.
6. Save a budget.
7. Change currency.
8. Export CSV.
9. Download and restore a JSON backup.
10. Switch dark/light mode.
11. Open the app on a narrow mobile viewport.
12. Reload after adding data and confirm the data remains.

Then update the version number/changelog and package the complete source.
