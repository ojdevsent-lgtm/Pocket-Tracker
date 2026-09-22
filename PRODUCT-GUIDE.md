# PocketTracker Buyer Guide

## 1. Start the app

Extract the ZIP and open index.html in a modern browser.

The core tracker does not require npm, Node.js, a database, an API key, or a server.

For installable PWA behavior, host the files on HTTPS or use localhost. Opening the HTML directly with file:// still supports the core tracker, but service-worker features may be unavailable.

## 2. Add transactions

Use Add to record income or expenses.

Each transaction has:
- Description
- Amount
- Type
- Category
- Date
- Optional monthly label

The monthly label does not create future transactions automatically.

## 3. Review spending

The dashboard shows:
- All-time balance
- Current-month income
- Current-month expenses
- Current-month savings rate
- Recent activity
- Current-month category spending

## 4. Use budgets

Open Budgets, enter a monthly limit for a category, and save it. The progress bar compares current-month spending against that limit.

## 5. Back up your data

Open Settings → Backup → Download backup.

The backup is a JSON file. Keep it somewhere safe before clearing browser data, changing browser profiles, or moving to another device.

To restore, use Restore backup and select a valid PocketTracker JSON backup.

## 6. Privacy model

PocketTracker is local-first. Transaction records are stored in the browser's local storage. The application does not require a PocketTracker account or send transactions to a PocketTracker backend.

Because there is no cloud synchronization, the buyer is responsible for maintaining backups.

## 7. Customize it

See CUSTOMIZATION.md for:
- App name and branding
- Colors
- Categories
- Currency options
- Data model
- Static hosting
- Release testing
