import 'package:hive/hive.dart';
import 'cash_holder_model.dart';

part 'cash_snapshot_model.g.dart';

@HiveType(typeId: 9)
class CashInHandSnapshotModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final DateTime snapshotDate;

  @HiveField(2)
  final double cashInHand;

  @HiveField(3)
  final double cashInApp;

  @HiveField(4)
  final double difference;

  @HiveField(5)
  final List<CashHolderModel> holders;

  @HiveField(6)
  final DateTime createdAt;

  CashInHandSnapshotModel({
    required this.id,
    required this.snapshotDate,
    required this.cashInHand,
    required this.cashInApp,
    required this.difference,
    required this.holders,
    required this.createdAt,
  });

  factory CashInHandSnapshotModel.fromJson(Map<String, dynamic> json) {
    var holdersList = json['holders'] as List? ?? [];
    return CashInHandSnapshotModel(
      id: json['id'] as String,
      snapshotDate: DateTime.parse(json['snapshot_date'] as String),
      cashInHand: (json['cash_in_hand'] as num? ?? 0.0).toDouble(),
      cashInApp: (json['cash_in_app'] as num? ?? 0.0).toDouble(),
      difference: (json['difference'] as num? ?? 0.0).toDouble(),
      holders: holdersList
          .map((h) => CashHolderModel.fromJson(h as Map<String, dynamic>))
          .toList(),
      createdAt: json['created_at'] != null 
          ? DateTime.parse(json['created_at'] as String) 
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'snapshot_date': snapshotDate.toIso8601String().split('T')[0],
      'cash_in_hand': cashInHand,
      'cash_in_app': cashInApp,
      'difference': difference,
      'holders': holders.map((h) => h.toJson()).toList(),
      'created_at': createdAt.toIso8601String(),
    };
  }

  CashInHandSnapshotModel copyWith({
    DateTime? snapshotDate,
    double? cashInHand,
    double? cashInApp,
    double? difference,
    List<CashHolderModel>? holders,
    DateTime? createdAt,
  }) {
    return CashInHandSnapshotModel(
      id: id,
      snapshotDate: snapshotDate ?? this.snapshotDate,
      cashInHand: cashInHand ?? this.cashInHand,
      cashInApp: cashInApp ?? this.cashInApp,
      difference: difference ?? this.difference,
      holders: holders ?? this.holders,
      createdAt: createdAt ?? this.createdAt,
    );
  }
}
