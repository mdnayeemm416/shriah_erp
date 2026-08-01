import 'package:hive/hive.dart';

part 'shop_model.g.dart';

@HiveType(typeId: 0)
class ShopModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String name;

  @HiveField(2)
  final String? shopType; // 'full_erp' | 'simple_cash'

  @HiveField(3)
  final bool isDeleted;

  @HiveField(4)
  final DateTime createdAt;

  @HiveField(5)
  final double? openingCash;

  // Extra statistics from the GET /shops API response
  final double? cashPosition;
  final double? expectedBankBalance;
  final double? totalCash;
  final double? totalCost;
  final double? cashSale;
  final double? bankSale;
  final double? bankWithdraw;
  final double? purchaseAmount;
  final double? expenseAmount;

  ShopModel({
    required this.id,
    required this.name,
    this.shopType = 'full_erp',
    this.isDeleted = false,
    required this.createdAt,
    this.openingCash,
    this.cashPosition,
    this.expectedBankBalance,
    this.totalCash,
    this.totalCost,
    this.cashSale,
    this.bankSale,
    this.bankWithdraw,
    this.purchaseAmount,
    this.expenseAmount,
  });

  factory ShopModel.fromJson(Map<String, dynamic> json) {
    return ShopModel(
      id: json['id'] as String,
      name: json['name'] as String,
      shopType: (json['shopType'] ?? json['shop_type']) as String?,
      isDeleted: (json['isDeleted'] ?? json['is_deleted']) as bool? ?? false,
      createdAt: json['createdAt'] != null 
          ? DateTime.parse(json['createdAt'] as String) 
          : (json['created_at'] != null 
              ? DateTime.parse(json['created_at'] as String) 
              : DateTime.now()),
      openingCash: ((json['openingBalance'] ?? json['opening_balance'] ?? json['opening_cash']) as num?)?.toDouble(),
      cashPosition: ((json['cashPosition'] ?? json['cash_position']) as num?)?.toDouble(),
      expectedBankBalance: ((json['expectedBankBalance'] ?? json['expected_bank_balance']) as num?)?.toDouble(),
      totalCash: ((json['totalCash'] ?? json['total_cash']) as num?)?.toDouble(),
      totalCost: ((json['totalCost'] ?? json['total_cost']) as num?)?.toDouble(),
      cashSale: ((json['cashSale'] ?? json['cash_sale']) as num?)?.toDouble(),
      bankSale: ((json['bankSale'] ?? json['bank_sale']) as num?)?.toDouble(),
      bankWithdraw: ((json['bankWithdraw'] ?? json['bank_withdraw']) as num?)?.toDouble(),
      purchaseAmount: ((json['purchaseAmount'] ?? json['purchase_amount']) as num?)?.toDouble(),
      expenseAmount: ((json['expenseAmount'] ?? json['expense_amount']) as num?)?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'shop_type': shopType,
      'is_deleted': isDeleted,
      'created_at': createdAt.toIso8601String(),
      'opening_cash': openingCash,
      'cash_position': cashPosition,
      'expected_bank_balance': expectedBankBalance,
      'total_cash': totalCash,
      'total_cost': totalCost,
      'cash_sale': cashSale,
      'bank_sale': bankSale,
      'bank_withdraw': bankWithdraw,
      'purchase_amount': purchaseAmount,
      'expense_amount': expenseAmount,
    };
  }

  ShopModel copyWith({
    String? name,
    String? shopType,
    bool? isDeleted,
    double? openingCash,
    double? cashPosition,
    double? expectedBankBalance,
    double? totalCash,
    double? totalCost,
    double? cashSale,
    double? bankSale,
    double? bankWithdraw,
    double? purchaseAmount,
    double? expenseAmount,
  }) {
    return ShopModel(
      id: id,
      name: name ?? this.name,
      shopType: shopType ?? this.shopType,
      isDeleted: isDeleted ?? this.isDeleted,
      createdAt: createdAt,
      openingCash: openingCash ?? this.openingCash,
      cashPosition: cashPosition ?? this.cashPosition,
      expectedBankBalance: expectedBankBalance ?? this.expectedBankBalance,
      totalCash: totalCash ?? this.totalCash,
      totalCost: totalCost ?? this.totalCost,
      cashSale: cashSale ?? this.cashSale,
      bankSale: bankSale ?? this.bankSale,
      bankWithdraw: bankWithdraw ?? this.bankWithdraw,
      purchaseAmount: purchaseAmount ?? this.purchaseAmount,
      expenseAmount: expenseAmount ?? this.expenseAmount,
    );
  }
}
