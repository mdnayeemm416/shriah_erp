import '../../models/shop_model.dart';
import '../../models/cashier_model.dart';
import '../../models/shop_entry_model.dart';

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

  ShopLoaded({
    required this.shops,
    this.selectedShop,
    this.cashiers = const [],
    this.entries = const [],
    this.isLoadingEntries = false,
    this.error,
  });

  // Helper getters to compute daily statistics reactively
  double get totalSales => entries
      .where((e) => e.entryType == 'sale')
      .fold(0.0, (sum, e) => sum + e.posSale + e.cashSale + e.bankSale + e.creditSale);

  double get totalPurchases => entries
      .where((e) => e.entryType == 'purchase')
      .fold(0.0, (sum, e) => sum + e.purchaseAmount);

  double get totalExpenses => entries
      .where((e) => e.entryType == 'expense')
      .fold(0.0, (sum, e) => sum + e.expenseAmount);

  double get totalWithdrawals => entries
      .where((e) => e.entryType == 'withdraw')
      .fold(0.0, (sum, e) => sum + e.withdrawAmount);

  double get netPosition => totalSales - totalPurchases - totalExpenses - totalWithdrawals;

  ShopLoaded copyWith({
    List<ShopModel>? shops,
    ShopModel? selectedShop,
    List<CashierModel>? cashiers,
    List<ShopEntryModel>? entries,
    bool? isLoadingEntries,
    String? error,
  }) {
    return ShopLoaded(
      shops: shops ?? this.shops,
      selectedShop: selectedShop ?? this.selectedShop,
      cashiers: cashiers ?? this.cashiers,
      entries: entries ?? this.entries,
      isLoadingEntries: isLoadingEntries ?? this.isLoadingEntries,
      error: error,
    );
  }
}

class ShopErrorState extends ShopState {
  final String message;
  ShopErrorState(this.message);
}
