import 'package:hive/hive.dart';
import 'cash_holder_model.dart';

part 'daily_closing_model.g.dart';

@HiveType(typeId: 10)
class DailyClosingModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final DateTime closingDate;

  @HiveField(2)
  final double openingCash;

  @HiveField(3)
  final double cashSale;

  @HiveField(4)
  final double withdraw;

  @HiveField(5)
  final double purchase;

  @HiveField(6)
  final double expense;

  @HiveField(7)
  final double expectedCash;

  @HiveField(8)
  final double countedCash;

  @HiveField(9)
  final double difference;

  @HiveField(10)
  final String status; // 'matched' | 'shortage' | 'extra'

  @HiveField(11)
  final String? notes;

  @HiveField(12)
  final List<CashHolderModel> holders;

  @HiveField(13)
  final Map<String, double> distribution; // Azzouz, Nujum, etc.

  @HiveField(14)
  final double distributionTotal;

  @HiveField(15)
  final String createdBy;

  @HiveField(16)
  final DateTime createdAt;

  @HiveField(17)
  final DateTime? updatedAt;

  @HiveField(18)
  final bool isDeleted;

  DailyClosingModel({
    required this.id,
    required this.closingDate,
    required this.openingCash,
    required this.cashSale,
    required this.withdraw,
    required this.purchase,
    required this.expense,
    required this.expectedCash,
    required this.countedCash,
    required this.difference,
    required this.status,
    this.notes,
    required this.holders,
    required this.distribution,
    required this.distributionTotal,
    required this.createdBy,
    required this.createdAt,
    this.updatedAt,
    this.isDeleted = false,
  });

  factory DailyClosingModel.fromJson(Map<String, dynamic> json) {
    var holdersList = json['holders'] as List? ?? [];
    var distMap = json['distribution'] as Map<String, dynamic>? ?? {};
    
    return DailyClosingModel(
      id: json['id'] as String,
      closingDate: DateTime.parse(json['closing_date'] as String),
      openingCash: (json['opening_cash'] as num? ?? 0.0).toDouble(),
      cashSale: (json['cash_sale'] as num? ?? 0.0).toDouble(),
      withdraw: (json['withdraw'] as num? ?? 0.0).toDouble(),
      purchase: (json['purchase'] as num? ?? 0.0).toDouble(),
      expense: (json['expense'] as num? ?? 0.0).toDouble(),
      expectedCash: (json['expected_cash'] as num? ?? 0.0).toDouble(),
      countedCash: (json['counted_cash'] as num? ?? 0.0).toDouble(),
      difference: (json['difference'] as num? ?? 0.0).toDouble(),
      status: json['status'] as String? ?? 'matched',
      notes: json['notes'] as String?,
      holders: holdersList
          .map((h) => CashHolderModel.fromJson(h as Map<String, dynamic>))
          .toList(),
      distribution: distMap.map((key, value) => MapEntry(key, (value as num).toDouble())),
      distributionTotal: (json['distribution_total'] as num? ?? 0.0).toDouble(),
      createdBy: json['created_by'] as String? ?? '',
      createdAt: json['created_at'] != null 
          ? DateTime.parse(json['created_at'] as String) 
          : DateTime.now(),
      updatedAt: json['updated_at'] != null 
          ? DateTime.parse(json['updated_at'] as String) 
          : null,
      isDeleted: json['is_deleted'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'closing_date': closingDate.toIso8601String().split('T')[0],
      'opening_cash': openingCash,
      'cash_sale': cashSale,
      'withdraw': withdraw,
      'purchase': purchase,
      'expense': expense,
      'expected_cash': expectedCash,
      'counted_cash': countedCash,
      'difference': difference,
      'status': status,
      'notes': notes,
      'holders': holders.map((h) => h.toJson()).toList(),
      'distribution': distribution,
      'distribution_total': distributionTotal,
      'created_by': createdBy,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
      'is_deleted': isDeleted,
    };
  }

  DailyClosingModel copyWith({
    DateTime? closingDate,
    double? openingCash,
    double? cashSale,
    double? withdraw,
    double? purchase,
    double? expense,
    double? expectedCash,
    double? countedCash,
    double? difference,
    String? status,
    String? notes,
    List<CashHolderModel>? holders,
    Map<String, double>? distribution,
    double? distributionTotal,
    String? createdBy,
    DateTime? createdAt,
    DateTime? updatedAt,
    bool? isDeleted,
  }) {
    return DailyClosingModel(
      id: id,
      closingDate: closingDate ?? this.closingDate,
      openingCash: openingCash ?? this.openingCash,
      cashSale: cashSale ?? this.cashSale,
      withdraw: withdraw ?? this.withdraw,
      purchase: purchase ?? this.purchase,
      expense: expense ?? this.expense,
      expectedCash: expectedCash ?? this.expectedCash,
      countedCash: countedCash ?? this.countedCash,
      difference: difference ?? this.difference,
      status: status ?? this.status,
      notes: notes ?? this.notes,
      holders: holders ?? this.holders,
      distribution: distribution ?? this.distribution,
      distributionTotal: distributionTotal ?? this.distributionTotal,
      createdBy: createdBy ?? this.createdBy,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      isDeleted: isDeleted ?? this.isDeleted,
    );
  }
}
