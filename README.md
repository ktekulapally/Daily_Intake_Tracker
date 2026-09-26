# Daily Intake Tracker

A personal food & drink diary — log what you eat, see it grouped by meal,
track simple stats, and browse trends over time. Built on the exact same
proven stack as Personal Ledger: static HTML/CSS/JS + Supabase (Postgres +
Auth + Row Level Security) + GitHub Pages + installable PWA. No server to
run, no recurring cost at personal-use scale.

**Important**: the stats and trends this app shows (item counts, timing,
category mix, "new foods" tally) are simple tracking statistics for your
own awareness — not a medical or nutritional assessment. This is stated
directly in the app (Summary page and More page) and is worth keeping in
mind as you use it.

---

## What's included

```
index.html            Diary — today's (or any day's) log, add/edit/delete
summary.html            Summary — formatted daily report, Export (Excel/PDF), Print
history.html             History — past days list + trend charts
more.html                 Account info, sign out
reset-password.html       Completes the forgot-password email flow
styles.css                 Shared styling (single theme, bottom tab nav)
supabase-config.js          Your Supabase URL + anon key (edit once)
session-guard.js            1-hour idle auto-logout (same as Personal Ledger)
manifest.json                Makes the app installable on Android/iOS
service-worker.js             Offline app-shell caching for reliable install
icons/                        App icons (192/512/maskable)
supabase-schema.sql           Full database schema — run once
```

## What's deliberately simplified vs. the original spec

- **One table, not two**: your spec showed `intake_record` referencing a
  separate `daily_record` (one row per calendar day). A "day" here is just
  "all records sharing the same `intake_date` for one user" — no parent
  table to create or keep in sync. Same functionality, less to maintain.
- **No photo upload yet**: the `photo_url` column exists in the schema and
  is ready for it, but v1 skips Supabase Storage setup, per your call to
  keep the first version simpler.
- **No in-app "change password"**: only the emailed "Forgot password?"
  flow. We found with Personal Ledger that an in-app password change is a
  real risk on a device left signed in — anyone with physical access could
  hijack the account without knowing the old password. This app skips that
  from the start.

---

## 1. Create the Supabase project

1. https://supabase.com → sign up free → **New project**.
2. **SQL Editor** → paste in `supabase-schema.sql` → **Run**. This creates
   the `intake_records` table with Row Level Security already configured,
   so only you can ever see your own entries.
3. **Project Settings → API** → copy the **Project URL** and **anon
   public** key.
4. **Authentication → Providers → Email** → turn off "Confirm email" (skips
   an unnecessary step for a personal single-user app).
5. Once you've created your own account (step 3 below), go to
   **Authentication → Sign In / Providers** and turn off "Allow new user
   signups" — keeps a public repo/URL from accumulating other people's
   sign-ups.

## 2. Add your credentials

Open `supabase-config.js`:
```js
const SUPABASE_URL = "https://your-project-ref.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";
```
Every page loads this one file — it's the only place credentials live.

## 3. Deploy to GitHub Pages

1. Push all these files to the root of
   **https://github.com/ktekulapally/Daily_Intake_Tracker** (not a
   subfolder — GitHub Pages only serves `index.html` sitting directly at
   the root).
2. Repo → **Settings → Pages** → Source: Deploy from a branch → `main` →
   `/ (root)`.
3. Visit `https://ktekulapally.github.io/Daily_Intake_Tracker/`, sign up
   with your own email/password.

## 4. Enable password reset

**Authentication → URL Configuration → Redirect URLs**, add:
```
https://ktekulapally.github.io/Daily_Intake_Tracker/reset-password.html
```

## 5. Install it as an app (optional)

Chrome on Android → open the site → **⋮ → Install app**. Opens full-screen
with its own bowl icon, same as any installed app.

---

## Using it

- **Diary**: today by default; use the ‹ › arrows or the date picker to
  view/edit any other day. Tap **+** to log something.
- **Summary**: a clean, printable report for any single day — grouped
  timeline plus the stats table, with Export to Excel/PDF and a Print
  button.
- **History**: pick a range (14/30/90 days) to see item-count and
  new-foods trend charts, a category breakdown, and a scrollable list of
  past days — tap any day to jump to its Summary.
- **More**: your account email, sign out, and a reminder of what the app's
  stats are (and aren't) meant to be used for.

## Stat definitions (for reference)

| Stat | Meaning |
|---|---|
| Items | Total intake records logged that day |
| Meals | Distinct main meal types logged (Breakfast/Lunch/Dinner) |
| Snacks | Entries logged as Mid-Morning Snack or Evening Snack |
| Beverages | Entries with category = Beverages |
| New Foods | Entries marked "first time trying this" |
| Packaged Foods | Entries marked as packaged |
| First / Last Intake | Earliest / latest logged time that day |

## What's not built yet

- **Photo upload** — schema is ready (`photo_url` column), needs Supabase
  Storage wired in whenever you want it.
- **Multi-user** — schema already supports it (every row ties to
  `auth.users`); would just mean re-enabling sign-ups.
