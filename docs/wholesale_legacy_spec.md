# Legacy Wholesale Screen Specification

This document provides a comprehensive specification of the components, database structures, business logic, calculations, and features of the **Wholesale / Store Admin** module in the legacy web application. This acts as the specification to guide the porting and implementation in the Flutter application.

---

## 1. Core Architecture & Navigation

The Wholesale screen (Store Admin) acts as a local ERP portal. It is structured around a multi-tab view where administrators toggle between core business operations.

### 1.1 Tabs & Sections
*   **Dashboard**: High-level financial KPIs, live profit calculations, recent transaction logs, and quick action panels.
*   **Sales**: Unified sales ledger showing completed wholesale sales, invoice detail inspections, print actions, and soft-delete/bin management.
*   **Purchases**: Purchase ledger logging transactions from suppliers, showing items list, cost values, and invoice details.
*   **Customer Ledger**: A directory of active customers, summarizing their mobile contact, opening dues, and current due balances. Integrates statement drill-downs and WhatsApp actions.
*   **Payment Ledger**: Logging of incoming customer payments ("Payment In") and outgoing payments ("Payment Out"). Settle dues directly here.
*   **Order Manager**: Lists incoming orders placed via the public storefront catalog (`store.tsx`). Contains status workflows (pending, confirmed, preparing, delivered, cancelled) and a one-click "Convert to Sale" wizard.
*   **Products (Warehouse / Catalog)**: Database management of products. Handles price levels (selling price vs. purchase cost), stock quantities, minimum stock alerts, categories, barcode lookup, Excel import (Vyapar), and catalog print operations.
*   **Categories**: A sorted directory mapping products into specific categories. Supports sorting indices and multi-language names.
*   **Suppliers**: Management of inventory suppliers and outstanding supplier payables.

### 1.2 ERP Quick Menu & Configurations
*   **ERP Header Dropdown**: Provides quick links to nested utility screens (Category Manager, Customer Statement, Stock Count session, Vyapar Excel import, Recycle Bin).
*   **Tab Customizer**: Bottom sheet allowing administrators to re-order tabs, toggle active states (show/hide specific tabs), and change visual color schemes (e.g., Emerald, Blue, Rose, Violet).
*   **Working Date System**: Shared state allowing the administrator to retroactively set a "Working Date". All statistics, dashboard profit buckets, and transaction timestamps anchor to this working date by default instead of the current system clock.

---

## 2. Database Schema (Supabase)

Below is the database structure the legacy web app interfaces with:

| Table Name | Primary Fields | Key Relations & Behaviors |
| :--- | :--- | :--- |
| `shop_products` | `id`, `name`, `name_bn`, `name_ar`, `description`, `price` (sell), `purchase_price` (cost), `compare_price`, `stock`, `min_stock`, `item_code` (primary code/SKU), `barcode`, `category_id`, `category_ids` (array), `is_visible`, `is_deleted`, `show_stock` | Products catalog. Soft-delete flag `is_deleted = true`. Valuation uses `purchase_price` (purchase cost) as base. |
| `shop_sales` | `id`, `invoice_number` (serial), `customer_id`, `customer_name`, `customer_mobile`, `items` (JSONB array), `total` (revenue), `discount`, `due_amount` (unpaid due), `payment_method` (cash, pos, bank, due, mixed), `status` (completed, cancelled), `is_deleted` | Wholesale sales transactions. `items` stores serialized snapshot: `[{product_id, name, qty, price, purchase_price}]`. |
| `shop_purchases` | `id`, `invoice_number`, `supplier_id`, `supplier_name`, `items` (JSONB array), `total`, `is_deleted`, `created_at` | Wholesale replenishment purchase logs. |
| `pos_customers` | `id`, `name`, `mobile`, `opening_due`, `is_active`, `is_deleted` | Wholesale customer registry. Tracks starting capital balance due. |
| `pos_payments` | `id`, `customer_id`, `amount`, `kind` (`payment_in` / `payment_out`), `notes`, `created_at`, `is_deleted` | Financial ledger recording collections and payables. Settle customer receivables. |
| `shop_orders` | `id`, `order_number` (serial), `customer_name`, `customer_mobile`, `customer_address`, `items` (JSONB array), `total`, `status` (`pending`, `confirmed`, `preparing`, `delivered`, `cancelled`), `is_deleted` | Incoming orders from public web catalog checkout. |
| `shop_categories` | `id`, `name`, `name_bn`, `name_ar`, `sort_order`, `is_active` | Catalog categories. |

---

## 3. Financial Metrics & Calculations

Calculations are computed dynamically based on the selected **Working Date**:

### 3.1 Business Overview KPI Cards
1.  **Today Sales**:
    *   Formula: Sum of `total` from `shop_sales` where `is_deleted = false` and `created_at` is between `WorkingDate 00:00:00` and `WorkingDate 23:59:59`.
2.  **Today Purchases**:
    *   Formula: Sum of `total` from `shop_purchases` where `is_deleted = false` and `created_at` is between `WorkingDate 00:00:00` and `WorkingDate 23:59:59`.
3.  **Stock Value (Warehouse Valuation)**:
    *   Formula: $\sum (\max(0, \text{product.stock}) \times \text{valuation\_base})$
    *   `valuation_base`: Prefers `product.purchase_price`. If zero or null, falls back to `product.price`.
    *   *Rule*: Negative stocks are clamped to `0` in valuation computations (Vyapar parity).
4.  **Customer Due (Total Outstanding Receivables)**:
    *   Formula: $\text{Total Opening Dues} + \text{Total Sales Dues} - \text{Total Payment In Amount}$
    *   $\text{Total Opening Dues}$: Sum of `opening_due` from `pos_customers` (where `is_active = true` and `is_deleted = false`).
    *   $\text{Total Sales Dues}$: Sum of `due_amount` from all `shop_sales` (where `is_deleted = false` and `status != 'cancelled'`).
    *   $\text{Total Payment In Amount}$: Sum of `amount` from `pos_payments` where `kind = 'payment_in'` and `is_deleted = false`.

### 3.2 Profit & Cost Analysis
Computed across three timelines (Daily (Working Date), Monthly, and Overall):
*   **Revenue**: Sum of $\text{qty} \times \text{sale\_price}$ for all items in active transactions.
*   **Total Cost**: Sum of $\text{qty} \times \text{product.purchase\_price}$ for all items sold. The cost is fetched from the current cost value in `shop_products` matching `product_id`.
*   **Net Profit**: $\text{Revenue} - \text{Total Cost} - \text{Discount}$

---

## 4. Key Workflows & Features

### 4.1 Order-to-Sale Conversion
When an administrator inspects a pending storefront order:
1.  They can click **"Convert to Sale"**.
2.  This launches the Wholesale Transaction Dialog.
3.  It automatically pre-fills:
    *   `partyName` $\rightarrow$ `customer_name`
    *   `partyMobile` $\rightarrow$ `customer_mobile`
    *   `notes` $\rightarrow$ `order.notes`
    *   `lines` $\rightarrow$ Map order item list. Looks up corresponding `product_id` to attach current pricing and capture product cost structures.
4.  Saving the transaction updates inventory levels, creates the sale entry, and updates `shop_orders.status` to `confirmed`/`delivered`.

### 4.2 Barcode Scanner & Quick-Add Wizard
Available inside the transaction entry dialog:
1.  **Scanning**: Connects to the device scanner. Instantly matches an inputted string against `item_code` or `barcode` in the catalog.
2.  **Tolerant Numeric Matching**: If code is purely numeric, strips leading zeros or spaces to match dirty legacy records.
3.  **Auto Cart Placement**: If a match is found, increments quantity in the checkout basket and plays a confirmation beep.
4.  **Quick-Add Wizard**: If the scanned barcode does *not* exist in the system, a inline dialog pops up allowing the clerk to instantly create a new catalog item (Title, Price, Cost, Stock, Barcode) without closing or resetting the checkout draft.

### 4.3 Customer Statement Ledger
When viewing a customer profile:
*   Displays complete transaction statement logs:
    *   Lists Sales (as debit +) and Payments In (as credit -).
    *   Calculates a running, line-by-line due balance.
*   **WhatsApp Statement**: Serializes statement data into a text message and redirects to WhatsApp (e.g., *"Dear [Customer], your outstanding balance is SAR [Balance]..."*).
*   **Share Invoice**: Generates PDF formats (V2 or 80mm roll) and formats a WhatsApp sharing URL.

### 4.4 Vyapar Excel Import
*   Allows bulk uploads of inventory sheets.
*   Maps column fields: Item Name, SKU/Item Code, Barcode, Sale Price, Purchase Cost, Current Stock, Min Stock.
*   Validates headers, matches existing item codes to update stock levels, or creates new items if they are unique.
