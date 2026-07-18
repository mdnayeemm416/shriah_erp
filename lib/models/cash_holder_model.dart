import 'package:hive/hive.dart';

part 'cash_holder_model.g.dart';

@HiveType(typeId: 8)
class CashHolderModel extends HiveObject {
  @HiveField(0)
  final String name;

  @HiveField(1)
  final double amount;

  CashHolderModel({
    required this.name,
    required this.amount,
  });

  factory CashHolderModel.fromJson(Map<String, dynamic> json) {
    return CashHolderModel(
      name: json['name'] as String,
      amount: (json['amount'] as num? ?? 0.0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'amount': amount,
    };
  }

  CashHolderModel copyWith({
    String? name,
    double? amount,
  }) {
    return CashHolderModel(
      name: name ?? this.name,
      amount: amount ?? this.amount,
    );
  }
}
