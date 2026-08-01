import 'package:hive/hive.dart';

part 'shop_entry_model.g.dart';

@HiveType(typeId: 2)
class ShopEntryModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String shopId;

  @HiveField(2)
  final String? cashierId;

  @HiveField(3)
  final String entryType; // 'sale' | 'purchase' | 'expense' | 'withdraw'

  @HiveField(4)
  final double posSale;

  @HiveField(5)
  final double cashSale;

  @HiveField(6)
  final double bankSale;

  @HiveField(7)
  final double creditSale;

  @HiveField(8)
  final double purchaseAmount;

  @HiveField(9)
  final double expenseAmount;

  @HiveField(10)
  final double withdrawAmount;

  @HiveField(11)
  final double difference;

  @HiveField(12)
  final double dueReceivable;

  @HiveField(13)
  final String? notes;

  @HiveField(14)
  final String? attachmentUrl;

  @HiveField(15)
  final DateTime txnDate;

  @HiveField(16)
  final bool isDeleted;

  @HiveField(17)
  final DateTime createdAt;

  ShopEntryModel({
    required this.id,
    required this.shopId,
    this.cashierId,
    required this.entryType,
    this.posSale = 0.0,
    this.cashSale = 0.0,
    this.bankSale = 0.0,
    this.creditSale = 0.0,
    this.purchaseAmount = 0.0,
    this.expenseAmount = 0.0,
    this.withdrawAmount = 0.0,
    this.difference = 0.0,
    this.dueReceivable = 0.0,
    this.notes,
    this.attachmentUrl,
    required this.txnDate,
    this.isDeleted = false,
    required this.createdAt,
  });

  double calculateTotalSale() {
    return cashSale + bankSale + creditSale - dueReceivable;
  }

  double get totalSale => calculateTotalSale();

  factory ShopEntryModel.fromJson(Map<String, dynamic> json) {
    return ShopEntryModel(
      id: json['id'] as String,
      shopId: (json['shopId'] ?? json['shop_id']) as String,
      cashierId: (json['cashierId'] ?? json['cashier_id']) as String?,
      entryType: (json['entryType'] ?? json['entry_type']) as String,
      posSale: ((json['posSale'] ?? json['pos_sale']) as num? ?? 0.0).toDouble(),
      cashSale: ((json['cashSale'] ?? json['cash_sale']) as num? ?? 0.0).toDouble(),
      bankSale: ((json['bankSale'] ?? json['bank_sale']) as num? ?? 0.0).toDouble(),
      creditSale: ((json['creditSale'] ?? json['credit_sale']) as num? ?? 0.0).toDouble(),
      purchaseAmount: ((json['purchaseAmount'] ?? json['purchase_amount']) as num? ?? 0.0).toDouble(),
      expenseAmount: ((json['expenseAmount'] ?? json['expense_amount']) as num? ?? 0.0).toDouble(),
      withdrawAmount: ((json['withdrawAmount'] ?? json['withdraw_amount']) as num? ?? 0.0).toDouble(),
      difference: (json['difference'] as num? ?? 0.0).toDouble(),
      dueReceivable: ((json['dueReceivable'] ?? json['due_receivable']) as num? ?? 0.0).toDouble(),
      notes: json['notes'] as String?,
      attachmentUrl: (json['assetUrl'] ?? json['attachmentUrl'] ?? json['attachment_url']) as String?,
      txnDate: DateTime.parse((json['txnDate'] ?? json['txn_date']) as String),
      isDeleted: (json['isDeleted'] ?? json['is_deleted']) as bool? ?? false,
      createdAt: json['createdAt'] != null 
          ? DateTime.parse(json['createdAt'] as String) 
          : (json['created_at'] != null 
              ? DateTime.parse(json['created_at'] as String) 
              : DateTime.now()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'shop_id': shopId,
      'cashier_id': cashierId,
      'entry_type': entryType,
      'pos_sale': posSale,
      'cash_sale': cashSale,
      'bank_sale': bankSale,
      'credit_sale': creditSale,
      'purchase_amount': purchaseAmount,
      'expense_amount': expenseAmount,
      'withdraw_amount': withdrawAmount,
      'difference': difference,
      'due_receivable': dueReceivable,
      'notes': notes,
      'attachment_url': attachmentUrl,
      'txn_date': txnDate.toIso8601String().split('T')[0],
      'is_deleted': isDeleted,
      'created_at': createdAt.toIso8601String(),
    };
  }

  ShopEntryModel copyWith({
    String? shopId,
    String? cashierId,
    String? entryType,
    double? posSale,
    double? cashSale,
    double? bankSale,
    double? creditSale,
    double? purchaseAmount,
    double? expenseAmount,
    double? withdrawAmount,
    double? difference,
    double? dueReceivable,
    String? notes,
    String? attachmentUrl,
    DateTime? txnDate,
    bool? isDeleted,
  }) {
    return ShopEntryModel(
      id: id,
      shopId: shopId ?? this.shopId,
      cashierId: cashierId ?? this.cashierId,
      entryType: entryType ?? this.entryType,
      posSale: posSale ?? this.posSale,
      cashSale: cashSale ?? this.cashSale,
      bankSale: bankSale ?? this.bankSale,
      creditSale: creditSale ?? this.creditSale,
      purchaseAmount: purchaseAmount ?? this.purchaseAmount,
      expenseAmount: expenseAmount ?? this.expenseAmount,
      withdrawAmount: withdrawAmount ?? this.withdrawAmount,
      difference: difference ?? this.difference,
      dueReceivable: dueReceivable ?? this.dueReceivable,
      notes: notes ?? this.notes,
      attachmentUrl: attachmentUrl ?? this.attachmentUrl,
      txnDate: txnDate ?? this.txnDate,
      isDeleted: isDeleted ?? this.isDeleted,
      createdAt: createdAt,
    );
  }
}
