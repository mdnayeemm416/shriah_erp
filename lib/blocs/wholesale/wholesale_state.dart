import '../../models/wholesale_models.dart';
import '../../models/product_model.dart';

class WholesaleState {
  final List<WholesaleCustomerModel> customers;
  final List<WholesalePaymentModel> payments;
  final List<WholesaleSaleModel> sales;
  final List<WholesalePurchaseModel> purchases;
  final List<WholesaleOrderModel> orders;
  final List<WholesaleCategoryModel> categories;
  final List<ProductModel> products;
  final bool loading;
  final String error;
  final int activeTab;
  final String searchQuery;
  final WholesaleSalesReturnSummary? salesReturnSummary;

  WholesaleState({
    this.customers = const [],
    this.payments = const [],
    this.sales = const [],
    this.purchases = const [],
    this.orders = const [],
    this.categories = const [],
    this.products = const [],
    this.loading = false,
    this.error = '',
    this.activeTab = 0,
    this.searchQuery = '',
    this.salesReturnSummary,
  });

  // KPI Calculations
  double get todaySales {
    final today = DateTime.now().toIso8601String().split('T')[0];
    return sales
        .where((s) => s.createdAt.toIso8601String().split('T')[0] == today)
        .fold(0.0, (sum, s) => sum + s.total);
  }

  double get todayPurchases {
    final today = DateTime.now().toIso8601String().split('T')[0];
    return purchases
        .where((p) => p.createdAt.toIso8601String().split('T')[0] == today)
        .fold(0.0, (sum, p) => sum + p.total);
  }

  double get totalCustomerDue {
    final openingDues = customers.fold(0.0, (sum, c) => sum + c.openingDue);
    final salesDues = sales.fold(0.0, (sum, s) => sum + s.dueAmount);
    final paymentsIn = payments
        .where((p) => p.kind == 'payment_in')
        .fold(0.0, (sum, p) => sum + p.amount);
    return (openingDues + salesDues - paymentsIn).clamp(0.0, double.infinity);
  }

  double get stockValuation {
    return products.fold(0.0, (sum, p) {
      final qty = p.stock > 0 ? p.stock : 0.0;
      final cost = p.purchasePrice;
      return sum + (qty * cost);
    });
  }

  int get pendingOrdersCount {
    return orders.where((o) => o.status == 'pending').length;
  }

  // Customer due mapping by customer ID
  double getCustomerDue(String customerId) {
    final customer = customers.firstWhere((c) => c.id == customerId);
    final salesDues = sales
        .where((s) => s.customerId == customerId)
        .fold(0.0, (sum, s) => sum + s.dueAmount);
    final paymentsIn = payments
        .where((p) => p.customerId == customerId && p.kind == 'payment_in')
        .fold(0.0, (sum, p) => sum + p.amount);
    return (customer.openingDue + salesDues - paymentsIn).clamp(0.0, double.infinity);
  }

  // Profit Analysis (Daily, Monthly, All-time)
  Map<String, double> get profitSummary {
    final now = DateTime.now();
    final todayStr = now.toIso8601String().split('T')[0];
    final currentMonth = now.month;
    final currentYear = now.year;

    double dailyRevenue = 0.0;
    double dailyCost = 0.0;
    double monthlyRevenue = 0.0;
    double monthlyCost = 0.0;
    double allRevenue = 0.0;
    double allCost = 0.0;

    for (final sale in sales) {
      final saleDateStr = sale.createdAt.toIso8601String().split('T')[0];
      final isToday = saleDateStr == todayStr;
      final isThisMonth = sale.createdAt.month == currentMonth && sale.createdAt.year == currentYear;

      double saleRevenue = sale.total;
      double saleCost = sale.items.fold(0.0, (sum, item) => sum + (item.qty * item.purchasePrice));

      allRevenue += saleRevenue;
      allCost += saleCost;

      if (isToday) {
        dailyRevenue += saleRevenue;
        dailyCost += saleCost;
      }
      if (isThisMonth) {
        monthlyRevenue += saleRevenue;
        monthlyCost += saleCost;
      }
    }

    return {
      'dailyProfit': dailyRevenue - dailyCost,
      'dailyRevenue': dailyRevenue,
      'monthlyProfit': monthlyRevenue - monthlyCost,
      'monthlyRevenue': monthlyRevenue,
      'allProfit': allRevenue - allCost,
      'allRevenue': allRevenue,
    };
  }

  WholesaleState copyWith({
    List<WholesaleCustomerModel>? customers,
    List<WholesalePaymentModel>? payments,
    List<WholesaleSaleModel>? sales,
    List<WholesalePurchaseModel>? purchases,
    List<WholesaleOrderModel>? orders,
    List<WholesaleCategoryModel>? categories,
    List<ProductModel>? products,
    bool? loading,
    String? error,
    int? activeTab,
    String? searchQuery,
    WholesaleSalesReturnSummary? salesReturnSummary,
  }) {
    return WholesaleState(
      customers: customers ?? this.customers,
      payments: payments ?? this.payments,
      sales: sales ?? this.sales,
      purchases: purchases ?? this.purchases,
      orders: orders ?? this.orders,
      categories: categories ?? this.categories,
      products: products ?? this.products,
      loading: loading ?? this.loading,
      error: error ?? this.error,
      activeTab: activeTab ?? this.activeTab,
      searchQuery: searchQuery ?? this.searchQuery,
      salesReturnSummary: salesReturnSummary ?? this.salesReturnSummary,
    );
  }
}
