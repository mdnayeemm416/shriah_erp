# Shop Page Specification: Components, Logic, and Features

This document specifies the database schemas, user interface layout, shop workflow modes, calculations, validation rules, and other features of the **Shop Page**, extracted from the legacy web application (`legacy-web-app/src/routes/_app/shop.tsx` and related components).

---

## 1. Data Schema & Models

### 1.1 Shop Model (`ShopModel`)
Defines the retail store or warehouse entity.
*   `id` (String): Unique identifier.
*   `name` (String): Display name of the shop.
*   `shopType` (String): `'full_erp'` or `'simple_cash'` (defaults to `'full_erp'`).
*   `isDeleted` (Boolean): Soft-delete flag.
*   `createdAt` (DateTime): Record creation timestamp.

### 1.2 Cashier Model (`CashierModel`)
Defines the cashier accounts linked to a specific shop.
*   `id` (String): Unique identifier.
*   `name` (String): Cashier's display name.
*   `shopId` (String): Associated shop ID.
*   `isDeleted` (Boolean): Soft-delete flag.

### 1.3 Shop Entry Model (`ShopEntryModel`)
Stores transaction records for shop sales, purchases, expenses, and withdrawals.
*   `id` (String): Unique identifier.
*   `shopId` (String): Associated shop ID.
*   `cashierId` (String?): Associated cashier ID (required for full sales).
*   `entryType` (String): `'sale'` | `'purchase'` | `'expense'` | `'withdraw'`.
*   `posSale` (Double): Z-report card/POS transaction total.
*   `cashSale` (Double): Sales paid in physical cash. (Also represents **Cash In** in simple cash shops).
*   `bankSale` (Double): Sales paid via card terminal or direct bank transfer.
*   `creditSale` (Double): Sales given on credit/due.
*   `dueReceivable` (Double): Cash received from previous dues/baki.
*   `purchaseAmount` (Double): Value of inventory/supplier purchases.
*   `expenseAmount` (Double): Operating expenses paid from the cash drawer.
*   `withdrawAmount` (Double): Cash withdrawn and deposited/transferred.
*   `difference` (Double): Calculated discrepant amount (`Total Sale - POS Sale`).
*   `notes` (String?): Descriptive notes (required for purchase, expense, withdraw).
*   `attachmentUrl` (String?): URL to receipt/invoice images or slip attachments.
*   `txnDate` (DateTime): The working transaction date.
*   `isDeleted` (Boolean): Soft-delete flag.
*   `createdAt` (DateTime): Timestamp of creation.

---

## 2. Shop Workflow Modes

The shop page dynamically displays input options and calculates values based on the selected shop's type:

### 2.1 Simple Cash Mode (`simple_cash`)
Designed for simplified cash drawers (e.g., small retail stands or warehouses).
*   **Allowed Entry Types**: Only "Cash In" (stored in `cashSale`) and "Expense" (stored in `expenseAmount`).
*   **Disabled Options**: POS Sale, Bank Sale, Credit Sale, Withdraw, Purchase, Cashier selection.
*   **Primary Metric**: Cash In.
*   **Secondary Metric**: Simple Expense.

### 2.2 Full ERP Mode (`full_erp`)
Designed for comprehensive outlets.
*   **Allowed Entry Types**: All 4 tabs: "Sale", "Purchase", "Expense", "Withdraw".
*   **Required Fields**: Cashier selection (for sales), Notes (for purchase, expense, withdraw).

---

## 3. Financial Metrics & Formulas

All metrics are calculated for a selected date range.

1.  **Total Sale**:
    *   `Total Sale` = `Cash Sale + Bank Sale + Credit Sale - Due Receivable`
    *   *Note*: POS Sale is excluded from this calculation.
2.  **Plus / Minus (Difference)**:
    *   `Difference` = `Total Sale - POS Sale`
3.  **Expected Bank**:
    *   `Expected Bank` = `Bank Sale - Bank Withdraw`
4.  **Cash Position**:
    *   **Simple Cash Shop**: `Cash In - Expense`
    *   **Full ERP Shop**: `(Cash Sale + Bank Withdraw) - (Purchase + Expense)`
    *   *Note*: Only represents physical cash flowing in/out of the shop drawer. Direct card/bank sales are excluded.
5.  **Net Total (Active Filter Summary)**:
    *   If no entry type is selected: `Cash Sales + Bank Sales + Credit Sales + Withdraw - Purchase - Expense` for all filtered entries.
    *   If specific entry types are selected (e.g. POS Sale + Cash Sale), displays the sum of those selected fields.

---

## 4. Filters & Queries

Unlike simple single-date lists, the shop page retrieves all active records and filters them client-side for immediate responsiveness:

### 4.1 Date Range Filters
Calculated relative to the active global working date (e.g., `YYYY-MM-DD`):
*   **Today**: Transactions where `txnDate == YYYY-MM-DD`.
*   **Yesterday**: Transactions where `txnDate == YYYY-MM-(DD-1)`.
*   **Weekly**: Transactions where `txnDate` is within `[YYYY-MM-DD - 6 days, YYYY-MM-DD]`.
*   **Monthly**: Transactions where `txnDate` is within `[YYYY-MM-01, YYYY-MM-DD]`.
*   **Custom**: Custom user-defined start date and end date range.

### 4.2 Shop Filter
*   Can filter to a single shop or select **"All Shops"** (default) to show combined entries.
*   Toggled by tapping the per-shop summary cards.

### 4.3 Entry Type Filter
*   Multi-select pills: All, POS Sale, Cash Sale, Bank Sale, Credit Sale, Purchase, Expense, Withdraw, Plus/Minus.
*   Toggling pills dynamically filters the list and updates the **Net Total** banner.

---

## 5. UI Layout & Design Structure

The page uses a premium layout with modern typography, smooth animations, and high contrast status indicators.

### 5.1 Main Screen
*   **Date Range Pills**: Horizontal scrollable list at the top.
*   **Custom Date Selector**: Animated panel with "From" and "To" inputs (visible only when "Custom" is selected).
*   **Per-Shop Summary Cards**: Grid of cards showing:
    *   Shop name.
    *   Metrics: `Expected Bank`, `Cash Position`, `Last Date` of transaction.
    *   Clicking a card toggles filtering of the recent entries list.
*   **Recent Entries Card**:
    *   Filter pills.
    *   Net Total banner (glowing gradient background, colors dynamically adjust to positive/negative values).
    *   Paginated transaction list (default 20 rows, "Load More" button for pagination).
*   **Floating Action Button (FAB)**: Quick action selection to create new entries of specific kinds (Sale, Purchase, Expense, Withdraw).

### 5.2 Entry Form Sheet
A bottom sheet modal containing:
*   **Tabs**: Depending on shop type (Simple Cash: 2 tabs; Full ERP: 4 tabs).
*   **Date & Shop Selector**: Prefilled with the current active shop and date.
*   **Cashier Selector**: For Full ERP Sales (populated with cashiers of the selected shop).
*   **Input Fields**: Large, easy-to-tap inputs for money amounts.
*   **Read-only Calculation Cards**: Total Sale and Plus/Minus cards updating reactively as user types.
*   **OCR Scan Section (Purchase)**: OCR options (Camera/Image/PDF) for invoice reading.
*   **Notes Field**: Rich description field (required for purchase, expense, withdraw).
*   **File Attachment Field**: Upload image or invoice copy.

### 5.3 Entry Details Modal
*   Displays all detailed fields of an entry.
*   Provides buttons to Edit or Move to Recycle Bin (Delete).

---

## 6. Business Logic & Validation Gates

### 6.1 Required Notes
*   For purchase, expense, and withdraw entries, the `notes` field must not be empty.

### 6.2 Duplicate Detection Warnings
Prevents double-entry errors before saving:
*   **Hard Block (Sale)**: If an entry of type `'sale'` already exists for the same shop, date, and cashier, block saving and display a warning sheet.
*   **Hard Block (Purchase)**: If a `'purchase'` entry already exists for the same shop and date, block saving.
*   **Soft Warning (Withdraw)**: If a `'withdraw'` entry already exists with the same date and amount, show a warning but allow the user to override and save.

### 6.3 OCR Purchase Scanner (OCR Integration)
*   User can upload an invoice or take a photo.
*   OCR extracts transaction date, total purchase amount, and row details.
*   Fills fields and displays an **OCR Mismatch Warning Card** if the OCR-detected grand total differs from the sum of extracted line items. User must confirm before saving.

### 6.4 Soft Deletes
*   Deleting an entry does not erase it from the database immediately. It updates `isDeleted = true` so it can be viewed/restored in the recycle bin.
