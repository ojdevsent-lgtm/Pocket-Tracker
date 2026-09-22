# PocketTracker

PocketTracker is a privacy-first, offline-first personal finance web app for everyday money tracking.

## Included

- Dashboard with current balance, monthly income, expenses and savings rate
- Add, edit and delete transactions
- Search and income/expense filtering
- Category spending breakdown
- Monthly category budgets
- Monthly cash-flow reports
- CSV export
- Full JSON backup and restore
- NGN, USD, GBP and EUR display currencies
- Dark/light mode
- Responsive mobile interface
- Local browser storage — no account, backend, API key or paid runtime service
- PWA manifest and service worker
- Defensive validation for imported and migrated transaction data
- Buyer-facing Gumroad listing, release checklist and product guide for supported browsers

## Run

Open `index.html` in a modern browser. No build step or package installation is required.

For service-worker/PWA features, serve the folder from HTTPS or localhost. Some browsers will not register service workers from `file://`.

## Data and privacy

Transaction data is stored in the browser's localStorage on the user's device. There is no PocketTracker server receiving transaction data. Users should export a JSON backup before clearing browser data or uninstalling a browser profile.

## Monthly transactions

The **Mark as monthly** option is intentionally a label. It does not automatically create future transactions. This avoids silently duplicating a user's financial records.

## Commercial/Gumroad packaging

For a product release, package the tested source together with:

1. `index.html`, `style.css`, `app.js`, `manifest.json`, `sw.js`
2. `README.md`
3. `LICENSE.txt`
4. A buyer-facing customization guide
5. Screenshots/product preview images
6. A changelog/version number
7. A tested ZIP of the complete product

Before selling, replace the placeholder license with the final license terms you intend to offer buyers.
