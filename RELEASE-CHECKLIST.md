# PocketTracker Release Checklist

## Source
- [ ] index.html loads without a build step
- [ ] style.css is present
- [ ] app.js is present
- [ ] manifest.json is present
- [ ] sw.js is present
- [ ] icon.svg is present
- [ ] README.md is present
- [ ] CUSTOMIZATION.md is present
- [ ] LICENSE.txt has been reviewed
- [ ] CHANGELOG.md has the release version

## Functional test
- [ ] Add income
- [ ] Add expense
- [ ] Edit transaction
- [ ] Delete transaction
- [ ] Search transactions
- [ ] Filter income/expenses
- [ ] Set and remove a budget
- [ ] Export CSV
- [ ] Download JSON backup
- [ ] Restore a valid backup
- [ ] Reject an invalid backup
- [ ] Change currency
- [ ] Toggle dark/light mode
- [ ] Reload and confirm local data persists
- [ ] Reset local data

## Responsive/PWA test
- [ ] Test desktop viewport
- [ ] Test narrow mobile viewport
- [ ] Test keyboard focus
- [ ] Test Escape to close transaction dialog
- [ ] Serve from HTTPS or localhost
- [ ] Confirm service worker registers
- [ ] Confirm cached app can reopen offline after first successful load

## Gumroad package
- [ ] Create a fresh release ZIP
- [ ] Exclude .git and development-only files
- [ ] Include buyer-facing documentation
- [ ] Include license terms
- [ ] Include screenshots/product preview
- [ ] Verify the ZIP can be extracted and opened independently
- [ ] Verify the listing description matches the actual product
- [ ] State clearly that data is local-only and not cloud-synced

## Versioning
Before every release:
1. Update the version in the changelog.
2. Bump the service-worker cache name in sw.js when cached assets change.
3. Re-run the functional checklist.
4. Rebuild the release ZIP.
