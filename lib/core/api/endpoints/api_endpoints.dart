class ApiEndpoints {
  ApiEndpoints._();

  // --- Auth & Base ---
  static const String health = '/health';
  static const String login = '/auth/login';

  // --- Products ---
  static const String products = '/products';
  static String productById(String id) => '/products/$id';

  // --- Wholesale Customers ---
  static const String wholesaleCustomers = '/wholesale/customers';
  static String wholesaleCustomerById(String id) => '/wholesale/customers/$id';
  static String wholesaleCustomerStatement(String id) => '/wholesale/customers/$id/statement';

  // --- Wholesale Sales ---
  static const String wholesaleSales = '/wholesale/sales';
  static String wholesaleSaleById(String id) => '/wholesale/sales/$id';
  static String wholesaleSaleCancel(String id) => '/wholesale/sales/$id/cancel';

  // --- Wholesale Sales Returns ---
  static const String wholesaleSalesReturns = '/wholesale/sales-returns';

  // --- Wholesale Supplier Purchases ---
  static const String wholesalePurchases = '/wholesale/purchases';
  static String wholesalePurchaseById(String id) => '/wholesale/purchases/$id';

  // --- Wholesale Storefront Orders ---
  static const String wholesaleOrders = '/wholesale/orders';
  static String wholesaleOrderById(String id) => '/wholesale/orders/$id';
  static String wholesaleOrderStatus(String id) => '/wholesale/orders/$id/status';

  // --- Wholesale Payments ---
  static const String wholesalePayments = '/wholesale/payments';
  static String wholesalePaymentById(String id) => '/wholesale/payments/$id';

  // --- Wholesale Product Categories ---
  static const String wholesaleCategories = '/wholesale/categories';
  static String wholesaleCategoryById(String id) => '/wholesale/categories/$id';

  // --- Wholesale Analytics & Dashboard ---
  static const String wholesaleDashboardSummary = '/wholesale/dashboard/summary';
  static const String wholesaleReceivablesBreakdown = '/wholesale/receivables/breakdown';

  // --- Wholesale Price Benchmark ---
  static const String wholesalePriceCompares = '/wholesale/price-compares';

  // --- Wholesale Employees ---
  static const String wholesaleEmployees = '/wholesale/employees';
  static const String wholesaleEmployeeSummary = '/wholesale/employees/summary';

  // --- Shops & Cashiers ---
  static const String shops = '/shops';
  static String shopById(String id) => '/shops/$id';
  static const String shopCashiers = '/shops/cashiers';
  static const String shopEntries = '/shops/entries';

  // --- Employees & Staff ---
  static const String employees = '/employees';
  static const String employeeEntries = '/employees/entries';

  // --- Company Transactions ---
  static const String companyTransactions = '/company-transactions';

  // --- Cash Snapshots ---
  static const String cashSnapshots = '/cash-snapshots';

  // --- Daily Closings ---
  static const String dailyClosings = '/daily-closings';

  // --- Employee Expenses ---
  static const String employeeExpenses = '/employee-expenses';
}
