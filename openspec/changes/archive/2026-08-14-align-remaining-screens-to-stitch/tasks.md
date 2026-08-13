## 1. Stitch refs + conventions

- [x] 1.1 [ui] Fetch HTML (+ screenshot when available) for all in-scope screens into `docs/stitch/` (book + account + admin); skip landing unless needed for comparison
- [x] 1.2 [ui] Document screenId → filename mapping in `docs/stitch/README.md`
- [x] 1.3 [ui] Apply rule: prefer Tailwind canonical classes (`leading-12`, etc.) — no new arbitrary values when a scale class exists

## 2. Book cluster

- [x] 2.1 [ui] Align booking chrome + summary to Stitch Select Service shell patterns
- [x] 2.2 [ui] Port Select Service step from Stitch HTML
- [x] 2.3 [ui] Port Select Employee step from Stitch HTML
- [x] 2.4 [ui] Port Select Date + Select Time steps from Stitch HTML
- [x] 2.5 [ui] Port Customer Information step (keep RHF+Zod)
- [x] 2.6 [ui] Port Review + Confirmation pages from Stitch HTML
- [x] 2.7 [ui] EN/VI copy check + mobile pass for wizard

## 3. Account cluster

- [x] 3.1 [ui] Port Client Login `/login` from Stitch HTML (mock submit retained)
- [x] 3.2 [ui] Port Admin Login `/admin/login` from Stitch HTML (mock gate retained)
- [x] 3.3 [ui] EN/VI + canonical Tailwind cleanup on login views

## 4. Admin cluster

- [x] 4.1 [ui] Port Admin shell (sidebar + top bar) from Stitch overview chrome
- [x] 4.2 [ui] Port Overview `/admin`
- [x] 4.3 [ui] Port Bookings list + Booking detail
- [x] 4.4 [ui] Port Service Management
- [x] 4.5 [ui] Port Staff Management + Staff Schedule Details
- [x] 4.6 [ui] Port Master Schedule + Shift Management + Schedule Settings
- [x] 4.7 [ui] EN/VI + canonical Tailwind cleanup on admin views

## 5. Verification

- [x] 5.1 [ui] Visual check: each book step vs `docs/stitch` HTML/screenshot
- [x] 5.2 [ui] Visual check: logins + each admin nav target vs Stitch refs
- [x] 5.3 [ui] Confirm landing unchanged (smoke `/`)
- [x] 5.4 [ui] `pnpm type-check`; fix regressions; scan for avoidable arbitrary Tailwind classes
