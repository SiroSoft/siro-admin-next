# UI/UX Audit — Enterprise (REQ-6)

> Template: siro-admin-next. Baseline: Pages `admin-next.sirophp.com` + skeleton 1.0.1.

## Checklist status

| # | Area | Status | Evidence |
|---|---|---|---|
| 1 | Consistency (tokens, radius, dark, no flash) | PASS | tailwind tokens, `suppressHydrationWarning` on `<html>`, color-mode |
| 2 | Async feedback (skeleton/empty/error+retry) | PASS | `loading-skeleton`, `empty-state`, `error-state` w/ `onRetry` on dashboard + tables |
| 3 | Forms: label + field error from `meta.errors` | PASS | interceptor unwraps `meta.errors`; all forms show field errors |
| 4 | Tables server-side sort/filter/pagination | PASS | `status/category_id/min_price/max_price` wired (REQ-4) |
| 5 | Icon-only buttons have `aria-label` | PASS (fixed) | search clear + toast dismiss labeled |
| 6 | Remember-me | PASS | localStorage `siro_remember_email` prefill |
| 7 | i18n vi/en/de/zh/ja | PASS | `ordersByStatus` added to all 5 locales |
| 8 | Lighthouse perf/a11y ≥ 90 | TODO | run `npx lighthouse https://admin-next.sirophp.com/login` |
| 9 | `npx axe` 0 critical | TODO | run per UAT.md |
| 10 | Bulk action + export CSV | TODO | future: table row selection + `log:export`-style CSV |

## Fixed this round
- `search-input.tsx` clear button: `type="button"` + `aria-label="Clear search"`.
- `ui/toast.tsx` dismiss: `type="button"` + `aria-label="Dismiss notification"`.
- Dashboard: Orders-by-status card (was missing vs BE shape).
- Products: `status` param instead of legacy `is_active`.
