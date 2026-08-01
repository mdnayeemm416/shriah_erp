class ShopSummaryModel {
  final String period;
  final String? startDate;
  final String? endDate;
  final String? shopId;
  final double cashPosition;
  final double expectedBankBalance;
  final double totalCash;
  final double totalCost;
  final double posSale;
  final double cashSale;
  final double bankSale;
  final double creditSale;
  final double purchaseAmount;
  final double expenseAmount;
  final double bankWithdraw;
  final double difference;
  final double dueReceivable;
  final double totalSales;
  final int totalEntries;

  ShopSummaryModel({
    required this.period,
    this.startDate,
    this.endDate,
    this.shopId,
    required this.cashPosition,
    required this.expectedBankBalance,
    required this.totalCash,
    required this.totalCost,
    required this.posSale,
    required this.cashSale,
    required this.bankSale,
    required this.creditSale,
    required this.purchaseAmount,
    required this.expenseAmount,
    required this.bankWithdraw,
    required this.difference,
    required this.dueReceivable,
    required this.totalSales,
    required this.totalEntries,
  });

  factory ShopSummaryModel.fromJson(Map<String, dynamic> json) {
    double toDouble(dynamic val) {
      if (val == null) return 0.0;
      if (val is num) return val.toDouble();
      return double.tryParse(val.toString()) ?? 0.0;
    }

    int toInt(dynamic val) {
      if (val == null) return 0;
      if (val is num) return val.toInt();
      return int.tryParse(val.toString()) ?? 0;
    }

    return ShopSummaryModel(
      period: json['period'] ?? '',
      startDate: json['startDate'] ?? json['start_date'],
      endDate: json['endDate'] ?? json['end_date'],
      shopId: json['shopId'] ?? json['shop_id'],
      cashPosition: toDouble(json['cashPosition'] ?? json['cash_position']),
      expectedBankBalance: toDouble(json['expectedBankBalance'] ?? json['expected_bank_balance']),
      totalCash: toDouble(json['totalCash'] ?? json['total_cash']),
      totalCost: toDouble(json['totalCost'] ?? json['total_cost']),
      posSale: toDouble(json['posSale'] ?? json['pos_sale']),
      cashSale: toDouble(json['cashSale'] ?? json['cash_sale']),
      bankSale: toDouble(json['bankSale'] ?? json['bank_sale']),
      creditSale: toDouble(json['creditSale'] ?? json['credit_sale']),
      purchaseAmount: toDouble(json['purchaseAmount'] ?? json['purchase_amount']),
      expenseAmount: toDouble(json['expenseAmount'] ?? json['expense_amount']),
      bankWithdraw: toDouble(json['bankWithdraw'] ?? json['bank_withdraw']),
      difference: toDouble(json['difference']),
      dueReceivable: toDouble(json['dueReceivable'] ?? json['due_receivable']),
      totalSales: toDouble(json['totalSales'] ?? json['total_sales']),
      totalEntries: toInt(json['totalEntries'] ?? json['total_entries']),
    );
  }
}
