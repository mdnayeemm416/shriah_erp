import '../../models/shop_model.dart';
import '../../models/cashier_model.dart';
import '../../models/shop_entry_model.dart';
import '../../models/shop_summary_model.dart';

abstract class ShopState {}

class ShopInitial extends ShopState {}

class ShopLoading extends ShopState {}

class ShopLoaded extends ShopState {
  final List<ShopModel> shops;
  final ShopModel? selectedShop;
  final List<CashierModel> cashiers;
  final List<ShopEntryModel> entries;
  final bool isLoadingEntries;
  final String? error;
  final ShopSummaryModel? shopSummary;
  final String? period;
  final String? startDate;
  final String? endDate;
  final String? date;

  ShopLoaded({
    required this.shops,
    this.selectedShop,
    this.cashiers = const [],
    this.entries = const [],
    this.isLoadingEntries = false,
    this.error,
    this.shopSummary,
    this.period,
    this.startDate,
    this.endDate,
    this.date,
  });

  // Helper getters to compute statistics, using server values if available
  double get totalSales => shopSummary?.totalSales ?? entries
      .where((e) => e.entryType == 'sale')
      .fold(0.0, (sum, e) => sum + e.posSale + e.cashSale + e.bankSale + e.creditSale);

  double get totalPurchases => shopSummary?.purchaseAmount ?? entries
      .where((e) => e.entryType == 'purchase')
      .fold(0.0, (sum, e) => sum + e.purchaseAmount);

  double get totalExpenses => shopSummary?.expenseAmount ?? entries
      .where((e) => e.entryType == 'expense')
      .fold(0.0, (sum, e) => sum + e.expenseAmount);

  double get totalWithdrawals => shopSummary?.bankWithdraw ?? entries
      .where((e) => e.entryType == 'withdraw')
      .fold(0.0, (sum, e) => sum + e.withdrawAmount);

  double get netPosition => shopSummary != null
      ? (shopSummary!.totalSales - shopSummary!.purchaseAmount - shopSummary!.expenseAmount - shopSummary!.bankWithdraw)
      : (totalSales - totalPurchases - totalExpenses - totalWithdrawals);

  ShopLoaded copyWith({
    List<ShopModel>? shops,
    ShopModel? selectedShop,
    List<CashierModel>? cashiers,
    List<ShopEntryModel>? entries,
    bool? isLoadingEntries,
    String? error,
    ShopSummaryModel? shopSummary,
    String? period,
    String? startDate,
    String? endDate,
    String? date,
  }) {
    return ShopLoaded(
      shops: shops ?? this.shops,
      selectedShop: selectedShop ?? this.selectedShop,
      cashiers: cashiers ?? this.cashiers,
      entries: entries ?? this.entries,
      isLoadingEntries: isLoadingEntries ?? this.isLoadingEntries,
      error: error,
      shopSummary: shopSummary ?? this.shopSummary,
      period: period ?? this.period,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      date: date ?? this.date,
    );
  }
}

class ShopErrorState extends ShopState {
  final String message;
  ShopErrorState(this.message);
}
