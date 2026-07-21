const METRIC_INFO = {
  cash_in_hand: {
    title: "Cash in Hand",
    what: "Total physical cash currently held across all shops and the office.",
    formula: "Opening Cash + Shop Cash Sales + Warehouse Cash Sales + Bank Withdraw − Purchases − Expenses − Cash Out",
    inputs: [
      "Opening Cash (Settings)",
      "Shop entries — Cash Sale",
      "Warehouse cash receipts",
      "Bank Withdraw entries",
      "Purchase entries",
      "Expense entries",
      "Manual Cash Out transactions"
    ],
    example: "If opening cash is 1,000 and you record 500 cash sale and 100 expense, Cash in Hand = 1,400."
  },
  bank_balance: {
    title: "Bank Balance",
    what: "Estimated balance held in the company bank account.",
    formula: "Opening Bank Balance + Shop Bank Sale − Bank Withdraw",
    inputs: [
      "Opening Bank Balance (Settings)",
      "Shop entries — Bank Sale",
      "Bank Withdraw entries"
    ],
    example: "Opening 2,000 + 500 bank sale − 300 withdraw = 2,200 Bank Balance."
  },
  warehouse_value: {
    title: "Warehouse Value",
    what: "Approximate financial value of stock & receivables held in the warehouse.",
    formula: "Opening Stock + Due Receivable + New Stock Purchases − Warehouse Sales",
    inputs: [
      "Opening Stock (Settings)",
      "Due Receivable (Settings)",
      "Warehouse purchase entries",
      "Warehouse sale entries"
    ]
  },
  total_expense: {
    title: "Total Expense",
    what: "Every outflow recorded across shops, warehouse and manual entries.",
    formula: "Shop Expenses + Manual Cash Out + Warehouse Purchases",
    inputs: ["Shop expense entries", "Manual Cash Out", "Warehouse purchases"]
  },
  net_position: {
    title: "Net Position",
    what: "The bottom-line worth across cash, bank and warehouse.",
    formula: "Cash in Hand + Bank Balance + Warehouse Value − Liabilities"
  },
  due_receivable: {
    title: "Due Receivable",
    what: "Money owed to the company from customers / partners.",
    formula: "Opening Due Receivable + Credit Sales − Collections"
  },
  // Shop entry types
  pos_sale: {
    title: "POS Sale",
    what: "Total amount printed by the POS / Z-report at end of day.",
    formula: "Sum of all POS receipts for the day"
  },
  cash_sale: {
    title: "Cash Sale",
    what: "Portion of POS Sale that was paid in physical cash."
  },
  bank_sale: {
    title: "Bank Sale",
    what: "Portion of POS Sale paid via bank card or transfer."
  },
  credit_sale: {
    title: "Credit Sale",
    what: 'Sale given on due / "baki" — customer pays later.'
  },
  total_sale: {
    title: "Total Sale",
    what: "Sum of all payment channels for the day.",
    formula: "Cash Sale + Bank Sale + Credit Sale"
  },
  plus_minus: {
    title: "Plus / Minus",
    what: "Daily reconciliation difference between what POS reported and what was actually collected.",
    formula: "(Cash Sale + Bank Sale + Credit Sale) − POS Sale",
    example: "Positive = collected more than POS (over). Negative = short (under)."
  },
  purchase: {
    title: "Purchase",
    what: "Inventory or supplies bought for the shop."
  },
  expense: {
    title: "Expense",
    what: "Day-to-day shop spending — salaries, utilities, repairs, supplies, etc."
  },
  withdraw: {
    title: "Bank Withdraw",
    what: "Cash pulled from the bank account into the shop till."
  },
  // Employees
  employee_due: {
    title: "Employee Due / Balance",
    what: "Net amount owed by (or to) an employee. Positive = employee owes you, negative = advance held.",
    formula: "Total Given − Total Received"
  },
  // Overview page
  opening_balance: {
    title: "Opening Balance",
    what: "Company-level opening cash the business started with. Single global value — independent of individual shop opening cash. Editable from this card.",
    formula: "Set manually in Settings / Overview (Company Opening Balance)"
  },
  outside_income: {
    title: "Outside Income",
    what: "Manual income from sources outside shops or warehouse — investments, refunds, owner deposits, etc.",
    formula: "Sum of all Overview entries with type = Income",
    inputs: ["Overview page — Income entries"]
  },
  shop_cash_position: {
    title: "Shop Cash Position",
    what: "Net cash a shop currently holds. Synced directly with Dashboard. If positive, business must collect it (shown as liability). If negative, the shop owes the business (shown as recoverable asset).",
    formula: "ERP shop: Cash Sales + Bank Withdraw − Purchases · Simple shop: Cash In − Expense"
  },
  employee_outstanding: {
    title: "Employee Outstanding",
    what: "Net advance/loan position with employees. Positive = employees owe the business.",
    formula: "Sum(Money Given to employees) − Sum(Money Received from employees)"
  },
  total_cost: {
    title: "Total Cost",
    what: "Manual costs and outside expenses entered on the Overview page.",
    formula: "Sum of all Overview entries with type = Cost"
  },
  expected_cash_in_hand: {
    title: "Expected Cash In Hand",
    what: "How much cash should actually exist right now — the executive bottom line.",
    formula: "Total Assets − Total Liabilities",
    inputs: [
      "Assets: Warehouse Converted + Employee Outstanding + Outside Income + Negative Shop Positions (recoverable)",
      "Liabilities: Positive Shop Cash Positions + Manual Costs"
    ]
  },
  warehouse_converted_to_cash: {
    title: "Warehouse Converted To Cash",
    what: "Change in warehouse value vs the opening baseline. Positive means warehouse value grew; negative means it shrank.",
    formula: "(Current Stock + Receivable) − Opening Stock  =  Current Value − Opening Stock",
    example: "160,249 − 175,000 = −14,751"
  },
  filter_today: {
    title: "Today",
    what: "Only entries dated today are included in the summaries."
  },
  filter_yesterday: {
    title: "Yesterday",
    what: "Only entries dated yesterday."
  },
  filter_week: {
    title: "Weekly",
    what: "Entries from the last 7 days (including today)."
  },
  filter_month: {
    title: "Monthly",
    what: "Entries from the 1st of the current month to today."
  },
  filter_custom: {
    title: "Custom Date",
    what: "Pick any From and To dates — both are inclusive. Useful for arbitrary periods."
  }
};
const HOW_TO = [
  {
    id: "dashboard",
    title: "Dashboard",
    purpose: "Live snapshot of money across cash, bank and warehouse — refreshed every time you save an entry.",
    inputs: [
      "Opening balances (Settings)",
      "All Shop entries",
      "Warehouse entries",
      "Manual transactions"
    ],
    workflow: [
      "Open Dashboard for a quick health check at the start of the day.",
      "Tap any ⓘ icon to see how a KPI is calculated.",
      "Use the date filter to inspect any period (Today / Week / Month)."
    ],
    bestPractice: "Use Dashboard for high-level reading only. Make actual entries from Shop, Warehouse or Transactions."
  },
  {
    id: "shop",
    title: "Shop Page",
    purpose: "Daily operational ledger — record POS readings, cash, bank, credit, purchases, expenses and withdraws per shop.",
    inputs: [
      "POS Sale, Cash Sale, Bank Sale, Credit Sale",
      "Purchase, Expense, Bank Withdraw",
      "OCR-scanned receipts"
    ],
    workflow: [
      "Pick a shop card to scope filters and summaries.",
      'Tap the floating "+" to open a new entry.',
      "Choose the entry type and fill the relevant fields — Plus/Minus is calculated automatically.",
      "Use the 3-dot menu for Import, Generate Report, Export or WhatsApp share."
    ],
    bestPractice: "Close each shop day-by-day. The Plus/Minus column tells you if cash matches POS."
  },
  {
    id: "transactions",
    title: "Transactions",
    purpose: "Manual money movements that are not tied to a shop — bank, cash-out, supervisor payments, adjustments.",
    inputs: ["Cash In / Out", "Bank Withdraw", "Supervisor / Adjustment"],
    workflow: [
      "Pick a date and type.",
      "Add the counter-party (shop, employee or party) when relevant.",
      "Save — the entry instantly affects Dashboard balances."
    ],
    bestPractice: "Always use Transactions for adjustments rather than editing opening balances."
  },
  {
    id: "warehouse",
    title: "Warehouse",
    purpose: "Track inventory value, new stock purchases, wholesale receivables and warehouse-direct sales.",
    inputs: ["Opening Stock", "Due Receivable", "Warehouse Sales", "Warehouse Purchases"],
    workflow: [
      "Record every wholesale movement with date, party and amount.",
      "Warehouse Value updates live with the formula shown in the ⓘ."
    ],
    bestPractice: "Reconcile Due Receivable monthly — collections should drop it back near zero."
  },
  {
    id: "employees",
    title: "Employees",
    purpose: "Track money given to and received from each employee. Generates a printable / WhatsApp-ready statement.",
    inputs: ["Given entries", "Received entries"],
    workflow: [
      "Open an employee profile.",
      "Add Given (money you handed out) or Received (money paid back).",
      "Share History generates a finance-receipt-style image."
    ],
    bestPractice: "Settle balances regularly. A positive balance means the employee still owes you."
  },
  {
    id: "reports",
    title: "Reports",
    purpose: "Aggregated, exportable view of all data across any period.",
    inputs: ["Every Shop / Warehouse / Transaction entry"],
    workflow: [
      "Pick a date filter and (optionally) a shop.",
      "Tap any summary card to drill into the underlying records.",
      "Export to PDF, Excel or share via WhatsApp."
    ],
    bestPractice: "Use Monthly for management reviews and Custom Date for audits."
  },
  {
    id: "ocr",
    title: "OCR Import",
    purpose: "Scan paper receipts / Z-reports — the system extracts totals and line items automatically.",
    inputs: ["Photos or PDFs of receipts"],
    workflow: [
      'Tap the "Scan" button inside a Shop entry.',
      "Review extracted totals — low-confidence fields are flagged.",
      "Save when correct — the original image stays attached for audit."
    ],
    bestPractice: "Always sanity-check totals before saving; OCR is a helper, not a replacement."
  },
  {
    id: "backup",
    title: "Backup & Export",
    purpose: "Download spreadsheets and PDFs for offline backup, accounting or sharing.",
    inputs: ["Any report or shop view"],
    workflow: [
      "Open Reports or Shop → 3-dot menu.",
      "Choose Export Excel, Export PDF or Share Report."
    ],
    bestPractice: "Export Excel monthly and archive it outside the device."
  }
];
const CALCULATION_KEYS = [
  "cash_in_hand",
  "bank_balance",
  "warehouse_value",
  "net_position",
  "plus_minus",
  "total_sale",
  "employee_due",
  "due_receivable"
];
export {
  CALCULATION_KEYS as C,
  HOW_TO as H,
  METRIC_INFO as M
};
