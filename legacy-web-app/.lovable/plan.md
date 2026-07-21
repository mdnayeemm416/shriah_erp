## Scope
Enhance **Wholesale → Stock Count session page** only. No changes to Sales, Purchase, Reports, Dashboard, or other modules. Existing workflow (draft → count → approve) stays intact.

## What's already in place (reuse, don't rebuild)
- `stock_count_items` snapshots `frozen_qty` = Previous Stock, and stores `physical_qty` = Current Stock, plus `counted_at` (Checked flag) and `purchase_price`.
- Server RPC `stock_count_summary` already returns `total/counted/diffCount/missing/extra/diffValue`.
- `stock_count_adjustments` already logs previous → current, diff qty, diff value, reason, timestamp, user on approval → this is the History requirement.
- Approve flow already resets nothing (a new session is used).

## Changes

### 1. Extend summary RPC (SQL migration)
Add fields to `stock_count_summary`:
- `prev_total_qty`, `curr_total_qty` (sum of frozen_qty vs counted physical_qty, non-counted rows fall back to frozen_qty)
- `prev_total_value`, `curr_total_value` (× purchase_price)
- `extra_products`, `missing_products`, `nodiff_products` (counts of counted rows)
- `extra_qty`, `missing_qty` already present
- `extra_value`, `missing_value` (split of diffValue)

Types file + `getStockCountSummary` in `src/lib/stock-count/api.ts` updated to map new fields.

### 2. Product card redesign (`ProductRow`)
Show three-line layout per product:
- **Previous Stock**: frozen_qty
- **Current Stock**: physical_qty (or "—" if not counted) + editable input
- **Difference badge** always visible: 🟢 +N Extra / 🔴 -N Missing / ⚪ 0 No Difference / grey "Not counted"
- **Checked** pill (✅) when `counted_at` set

Blind mode still hides Previous/Diff until entry made.

### 3. Filters
Replace `pos/neg` labels with **Extra / Missing / No Difference / Not Checked / Checked / All**. Add server filter case `nodiff` (physical_qty is not null AND physical_qty = frozen_qty) in RPC `stock_count_items_page`.

### 4. Summary card at top (collapsed by default)
Above the progress bar, a professional card:
```
Total 520  ·  Checked 510  ·  Remaining 10
Prev Qty 12,480     Curr Qty 12,453     Net −27
Prev Value SAR ...  Curr Value SAR ...  Diff −SAR 560
```
Tap to expand:
- Extra Products / Missing Products / No-Diff Products counts
- Extra Qty / Missing Qty
- Extra Value / Missing Value / Net Value Difference

Uses `SARAmount` for currency.

### 5. History
Already persisted in `stock_count_adjustments` on approval. `ReviewSheet` already lists them; extend row to show Previous → Current, diff qty, diff value, date-time, `created_by` (display "You" or profile name if easily available; else user id short).

### 6. Reset (admin-only, draft/in_progress only)
Add "Reset counts" button in header for admins on non-approved sessions:
- Sets `physical_qty = NULL`, `counted_at = NULL`, `counted_by = NULL` on all items
- Re-snapshots `frozen_qty` from live `warehouse_items.quantity` (fresh Previous Stock baseline)
- Does NOT touch `warehouse_items` (actual stock untouched)
- Confirm dialog

New RPC `reset_stock_count_session(_session_id uuid)`.

### 7. Performance
Existing virtualizer + paginated RPC stays. Summary derived from a single aggregate SQL, cached 15s.

## Files touched
- `supabase/migrations/*` — extend summary RPC, add reset RPC, add nodiff filter case
- `src/lib/stock-count/api.ts`, `src/lib/stock-count/types.ts` — new fields, `resetSession`
- `src/routes/_app/stock-count.$sessionId.tsx` — summary card, redesigned ProductRow, filter chips, reset button, richer review sheet

## Not changing
- Session list page, approval math, warehouse_items writes on approve, any non-wholesale surface, invoice/reports code.

Confirm and I'll implement.