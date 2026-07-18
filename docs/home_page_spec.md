# Home Page Specification: Summary & Verification

This document specifies the UI layout, business logic, calculations, and interactive features of the Home (Summary) page, extracted from the legacy web application (`legacy-web-app/src/routes/_app/summary.tsx`, `use-shop-positions.tsx`, and `use-wholesale-financials.ts`).

---

## 1. Core Financial Metrics & Calculations

The page is built around three distinct sections of mathematical aggregation, leading to a final **Verification (Difference)** figure.

### Constant Thresholds
*   `COMPANY_OPENING` = `175,000.00 SAR` (Fixed company-level opening capital, non-editable).
*   `WHOLESALE_OPENING_STOCK` = `175,000.00 SAR` (Opening Stock for converted-to-cash calculation, non-editable).

### Calculated Fields & Formulas

1.  **Total Shop Cash Position**:
    *   Formula depends on shop type:
        *   **`simple_cash`**: `Cash In - Expense`
            *   *Cash In* = Sum of `cash_sale` from `shop_entries` with `entry_type == 'sale'`.
            *   *Expense* = Sum of `expense_amount` from `shop_entries` with `entry_type == 'expense'`.
        *   **`full_erp`**: `(Cash Sale + Bank Withdraw) - (Purchase + Expense)`
            *   *Cash Sale* = Sum of `cash_sale` from `shop_entries`.
            *   *Bank Withdraw* = Sum of `withdraw_amount` from `shop_entries`.
            *   *Purchase* = Sum of `purchase_amount` from `shop_entries`.
            *   *Expense* = Sum of `expense_amount` from `shop_entries`.
    *   *Note*: POS, Bank, and Credit sales are explicitly **excluded** from Shop Cash Position.
    *   *Time Bound*: Date range goes from the first day of the active working month to the active working date (e.g., `YYYY-MM-01` to `YYYY-MM-DD`).

2.  **Wholesale Current Value**:
    *   `Wholesale Current Value` = `Current Stock + Receivable`
        *   **`Current Stock`**: Sum of `(product.stock * product.purchase_price)` for all products. (Never use selling price).
        *   **`Receivable`**: Sum of customer dues. Formulated as `Opening Due + Sales Due - Payments In`.
            *   *Since POS Customers/Wholesale Sales are currently mock/unimplemented in the Flutter app, this value can be computed as: `currentStock` + `receivables` (which can be hardcoded/mocked to 0.0 or a default setting).*

3.  **Employee Outstanding**:
    *   `Employee Outstanding` = `Total Given - Total Received` (All-time).
        *   *Total Given*: Sum of employee entries with `entry_type == 'give'`.
        *   *Total Received*: Sum of employee entries with `entry_type == 'receive'`.
    *   *Note*: This calculation is all-time and is **not** affected by monthly closing date filters.

4.  **Current Company Balance**:
    *   `Current Company Balance` = `Company Opening Balance + Company Income - Company Expense` (for the current working month).
        *   *Company Opening Balance*: Set to the monthly opening balance row in `company_opening_balances` (we can default to 0.0 if not found).
        *   *Company Income/Expense*: Sum of `company_transactions` where `txn_type == 'in'` (income) or `'out'` (expense) within the current month bounds.

5.  **Total Invest**:
    *   `Total Invest` = `COMPANY_OPENING + Total Shop Cash Position + Current Company Balance`.

6.  **Total Cash In App**:
    *   `Total Cash In App` = `Total Invest - Wholesale Current Value - Employee Outstanding`.

7.  **Total Cash In Hand**:
    *   `Total Cash In Hand` = Sum of amounts of all real-world cash holders (entered manually by the user).

8.  **Difference (Verification)**:
    *   `Difference` = `Total Cash In Hand - Total Cash In App`.
    *   **Status Classification**:
        *   `difference == 0` -> **Perfect Match** (Green)
        *   `difference < -0.01` -> **Cash Shortage** (Red/Rose)
        *   `difference > 0.01` -> **Extra Cash Found** (Orange/Amber)

---

## 2. UI Layout & Component Hierarchy

The page should have a premium, modern, fluid layout with sleek dark/light mode integration, matching standard ShRiAh aesthetics.

### 2.1 Sticky Top Bar / Summary Card
*   **Total Cash In App**: Prominently displayed at the top in a large card using a premium gradient (e.g., Teal-50 to White in light mode, dark mode equivalent).
*   **Info Icon Button**: Opens a tooltip or bottom sheet explaining the mathematical formula:
    `Total Invest - Wholesale Current Value - Employee Outstanding`.

### 2.2 Quick Jump Banner: "Ask AI"
*   Banner card linking to AI Insights with subtle glowing elements.

### 2.3 Section 1: Company Foundation (01)
A grouped list/card containing:
*   **Company Opening Balance**: Fixed at `175,000.00 SAR` (Locked icon).
*   **Total Shop Cash Position**: Displays the calculated sum. Clicking it opens a bottom sheet showing the breakdown of cash positions per shop.
*   **Total Invest**: Sum of opening balance, shop positions, and current company balance (Bold styling).

### 2.4 Section 2: Wholesale & Employee (02)
Grid or vertical layout containing:
*   **Wholesale Current Value**: Displays calculated value. Clicking it opens a bottom sheet showing the breakdown (`Current Stock` and `Receivable`).
*   **Employee Outstanding**: Displays the all-time outstanding advance balance.
*   **Current Company Balance**: Displays the company-level transaction balance.

### 2.5 Section 3: Cash In Hand (03)
Manual inputs card:
*   **Dynamic List of Holders**: Name input field and numerical Amount input field for each holder.
*   **Delete Button**: Removes a holder (minimum 1 holder).
*   **Add Holder Button**: Adds a new empty holder row.
*   **Total Cash In Hand**: Displays the running sum.
*   **Save Today Button**: Saves the current cash-in-hand snapshot (working date, cash in hand, cash in app, difference, and list of holders) to the snapshots history.

### 2.6 Section 4: Cash In Hand History (04)
List of saved snapshots retrieved from the database/Hive:
*   Each item displays: `Snapshot Date`, `Status Badge (Matched / Shortage [amount] / Extra [amount])`, and details of Cash in Hand and Cash in App.
*   **Delete Snapshot Button**: Removes a snapshot from history.

### 2.7 Section 5: Verification (05)
A prominent card styled dynamically based on the verification status:
*   **Perfect Match**: Emerald color scheme, "Perfect Match" badge, displays `0.00 SAR`.
*   **Cash Shortage**: Rose/Red color scheme, "Cash Shortage" badge, displays discrepancy amount.
*   **Extra Cash**: Amber/Yellow color scheme, "Extra Cash Found" badge, displays extra amount.
*   Info button detailing formula: `Cash In Hand - Cash In App`.

---

## 3. Interactive Features & Workflows

### 3.1 Date Filtering
*   The page calculates all figures relative to the active **working date** from the `WorkingDateCubit`.
*   Whenever the working date changes, all month-to-date and snapshot calculations must update dynamically.

### 3.2 Shop Cash Position Bottom Sheet
*   Displays a list of all active shops.
*   Shows name and calculated cash position for each shop.
*   Shows a summary footer with the grand total.

### 3.3 Wholesale Current Value Bottom Sheet
*   Displays:
    *   `Current Stock` (detailed with its formula).
    *   `Receivable` (detailed with customer balances).
    *   Total `Current Value`.

### 3.4 Snapshot Persistence
*   Snapshots must be stored locally in a Hive box (e.g. `cash_in_hand_snapshots`) so they persist between sessions.
*   Holders current list must be persisted in a Hive box (e.g. `cash_holders`) so they don't disappear when reloading.
