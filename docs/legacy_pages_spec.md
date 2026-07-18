# Legacy Pages Specification: Components, Logic, and Features (Excluding Home & Shop)

This document specifies the user interface, business logic, calculations, database dependencies, and interactive features of all pages in the legacy web application (excluding the Home and Shop pages, which are documented in [home_page_spec.md](file:///Users/mdnayeemdewan/Desktop/flutterproject/saudi/docs/home_page_spec.md) and [shop_page_spec.md](file:///Users/mdnayeemdewan/Desktop/flutterproject/saudi/docs/shop_page_spec.md)).

---

## 1. Login Page (`login.tsx`)
Centered card interface for user authentication.

### 1.1 UI & Layout
*   **Card Layout**: Centered elegant login card with the ShRiAh Group wallet branding.
*   **Input Fields**: Account Identifier (Username / Email / Mobile) and Password.
*   **Password Toggle**: Show/hide password visibility button in the password input suffix.
*   **Remember Me**: Checkbox to save the identifier locally on the device (`localStorage`).
*   **Support & Registration Links**: Quick links to email (`aahsanuh62@gmail.com`) and WhatsApp chat (`wa.me/966553687388`) for administrative contact.

### 1.2 Business Logic & Features
*   **Server Authentication**: Uses `erpPasswordLogin` server function to authenticate user credentials.
*   **Session Creation**: Uses Supabase OTP verify flow via magic link tokens (`verifyOtp`).
*   **Auto-redirect**: If user session is active, automatically redirects to dashboard (`/`).
*   **Persistent Sign-in**: Saves user identifier in `shriah.remember.identifier` to prefill on subsequent visits.

---

## 2. Wholesale / Store Admin Page (`store-admin.tsx` / `store.tsx`)
Management portal for wholesale items, orders, and storefront configuration, paired with a public ordering catalog.

### 2.1 UI & Layout
*   **Multitab View**: Swaps between Dashboard, Sales, Purchases, Customers, Payments, Orders, and Website.
*   **Quick Menu Dropdown**: Three-dot icon opening access to Category Manager, Customers, Alerts, Banner Ads, Website Banners, Suppliers, Stock Count, Excel import dialog, and Tab customizer.
*   **Tab Customizer**: Bottom sheet allowing administrators to show, hide, reorder, and change colors of navigation tabs.

### 2.2 Core Components & Features
*   **Dashboard**: Shows wholesale statistics, active banner counts, quick-action buttons for sales/payments/purchases.
*   **Product & Category Management**: Search and filter products by text, barcode, or category. Offers product image uploads, gallery photo grids, and Vyapar Excel imports.
*   **Barcode Scanning**: Connects to the device camera/input to instantly fetch a product profile by barcode.
*   **Order-to-Sale Conversion**: Tapping an order pre-populates a wholesale checkout cart with all item quantities, pricing, customer name, notes, and contact details.
*   **Printing**: Custom Print Dialog to generate tabular, printable product price sheets.

### 2.3 Public Storefront Catalog (`store.tsx`)
*   **Localization**: Dynamic i18n supporting English, Bengali, and Arabic with RTL page directions.
*   **Product Search**: Real-time fuzzy filtering of public products by multi-lang name, barcode, and categories.
*   **Promotion Carousels**: Displays active promotional banners and popped-up "ad of the day" modals.
*   **WhatsApp Checkout**: Serializes shopping cart items into a formatted text message, redirecting customers to place orders directly on the store's WhatsApp number.

---

## 3. Daily Closing Page (`daily-closing.tsx`)
Handover register for tracking physical cash drawers, operating expenses, and cash distributions.

### 3.1 Mathematical Calculations & Flows
1.  **Expected Closing Cash**:
    *   `Expected Closing` = `(Opening Cash + Shop Withdrawals + Other Cash In + Employee Received Cash) - (Tomorrow Distribution + Shop Operating Expenses + Employee Given Cash)`
2.  **Counted Cash**:
    *   `Counted Cash` = Running sum of money inputted under manual cash holder fields.
3.  **Difference**:
    *   `Difference` = `Counted Cash - Expected Closing`
    *   Status labels: **Closing Matched** (diff = 0), **Cash Shortage** (diff < -0.01), or **Extra Cash** (diff > 0.01).

### 3.2 Key Features & Workflows
*   **Suggested Opening Cash**: Automatically fetches the preceding date's `counted_cash` from the database.
*   **Opening Cash Override**: Users can unlock and edit the opening cash. Overrides trigger a warning prompt.
*   **Auto Tomorrow Distribution**: Auto-fills suggested distributions to shops ("Azzouz", "Nujum", "Aklas", "Khaled", "Warehouse") by summing the next day's pre-entered purchase entries.
*   **Tamper Detection Warning**: Banners display if a user adds/edits a transaction or shop entry whose timestamp is *newer* than the saved closing's `updated_at` time.
*   **WhatsApp Sharing**: Generates a complete financial statement containing opening capital, inflow detail, outflow detail, distribution logs, discrepancies, and notes.

---

## 4. Profit Summary Page (`profit-summary.tsx`)
Aggregated profit & loss reporting across retail shops and company accounts.

### 4.1 Shop Profit Calculations
*   **Cash Position**:
    *   *Simple Cash Shops*: `Cash In - Operating Expense`
    *   *Full ERP Shops*: `(Cash Sale + Bank Withdraw) - (Purchase + Operating Expense)`
*   **Profit Before Expense**:
    *   `Profit Before Expense` = `Cash Position + Total Operating Expense`
*   **Net Profit**:
    *   `Net Profit` = `Profit Before Expense - Total Operating Expense` (equals Cash Position).
*   **Employee Salaries**:
    *   Apportions monthly salaries based on date filters: `(monthly_salary / 30) * period_days`. Every active employee is assumed to work all days of the selected period.

### 4.2 Company Calculations & Final Profit
*   **Company Net**:
    *   `Company Net` = `Company Income - Company Expense` (sums from company transactions independent of shops).
*   **Final Business Profit**:
    *   `Final Business Profit` = `Total Shops Net Profit + Company Net`
*   **Expense Note Bucketing**: Operating expenses are categorized dynamically using the written Note string as-is. Standard categories are ignored.

### 4.3 Lock Controls
*   **Closed Month Lock**: Checking `monthly_closings` status. If a month's status is `closed`, users cannot generate new reports or edit values.

---

## 5. Employees Page (`employees.index.tsx` / `expenses.tsx` / `$employeeId.tsx`)
Advance tracking, wage ledgers, and expense reimbursement systems.

### 5.1 Given / Received Balances
*   **Employee Balance**:
    *   `Employee Balance` = `Total Given - Total Received`
    *   `Total Given`: Sum of employee entries with type `given` (salaries, advances, cash handouts).
    *   `Total Received`: Sum of employee entries with type `received` (cash returned or settled).
    *   *Outstanding representation*: Positive balances indicate due from the employee; negative balances show company advance liabilities.

### 5.2 Employee Wallet Requisitions (`expenses.tsx`)
*   **Employee Wallet Balance**:
    *   `Wallet Balance` = `Total Verified Deposits - Total Expenses`
*   **Verification Gate**: Cash deposits submitted by employees must be explicitly vetted and marked as `verified` by a Manager or Administrator in the ledger. Unverified deposits do not increase the wallet balance.
*   **Editing Restraints**: Employees can only update or delete expense submissions within 24 hours of creation, provided they were the author.

---

## 6. Sales Return Page (`sales-return.tsx`)
Refund and inventory restocking processor for wholesale orders.

### 6.1 UI & Layout
*   **Return Statistics Cards**: Visual representation of return value, unit quantities returned, and averages.
*   **Fuzzy Search**: Filter returns by invoice number, customer name, mobile, or return number.
*   **Dashboard Charts**: Lists top return items, refund dates, and frequent returning customers.

### 6.2 Return Wizard Component
*   **Invoice Look-up**: Search engine for original wholesale invoices.
*   **Restocking Checklists**: Picker to select which invoice items are being returned, entering custom return quantities and item refund values.
*   **Refund Settlements**: Supports three settlement strategies:
    *   `due_reduction` (reduces customer's outstanding balance).
    *   `cash` (gives physical cash back).
    *   `credit` (allocates customer credit).
*   **Invoice PDF Generating**: Exports customized return slips containing items list, notes, and values.

---

## 7. My Expenses Page (`my-expenses.tsx`)
User-facing panel for employees to log operational expenditures and cash receipts.

### 7.1 Features & Validation
*   **Profile Link check**: Matches the signed-in user's authentication profile (`user.id`) to their corresponding employee record.
*   **Requisition Forms**: Simple input dialog for expense amount, category, date, and description.
*   **Attachment Uploads**: Offers slip photo/invoice file attachments.
*   **Author Safeguards**: Restricts edits and deletions of expenses to a 24-hour window from the creation timestamp.

---

## 8. Price Compare Page (`price-compare.tsx`)
Independent purchase price variation tracker.

### 8.1 Key Features & Metrics
*   **Metric Fields**:
    *   `Latest Price`: Price from the newest recorded transaction.
    *   `Lowest Price`: Minimum purchase price documented.
    *   `Highest Price`: Maximum purchase price documented.
    *   `Price Delta`: Reactive up/down arrow indicators showing percentage changes between consecutive purchases.
*   **Independent Database**: Structured on isolated tables (`price_compare_products` and `price_compare_records`) separate from standard storefront inventories.
*   **Export Actions**: Custom PDF layouts, Excel documents, and WhatsApp formatting for price summaries.

---

## 9. Reports Page (`reports.tsx`)
Consolidated download repository and log book.

### 9.1 Features & Controls
*   **Data Generation Gate**: Does not load database tables automatically. Users select date filters and click "Generate". Changing filters afterwards does not trigger refetches until generated again.
*   **Audit Exports**: Compiles transactions, shop cashiers, parties, warehouse ledgers, and employee accounts into spreadsheets and PDFs.
*   **Drill-down Inspector**: Bottom sheets detailing per-shop entries, categories, and payment breakdowns.

---

## 10. Settings Page (`settings.tsx`)
Administrative switches and maintenance tools.

### 10.1 UI & Features
*   **Backup & Restore**: Download overall database states as JSON and import files to restore system baselines.
*   **Recycle Bin**: Unified recycle tab that retrieves soft-deleted records (`is_deleted = true`) from shops, warehouses, employee ledgers, and cash transactions, allowing permanent deletion or one-click restorations.
*   **Email Recipients**: Admin section to manage alert emails dispatched when storefront orders are filed.
*   **FCM Push Registrations**: Registers browsers and phones to receive push warnings on stock levels or handovers.
