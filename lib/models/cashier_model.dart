import 'package:hive/hive.dart';

part 'cashier_model.g.dart';

@HiveType(typeId: 1)
class CashierModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String name;

  @HiveField(2)
  final String shopId;

  @HiveField(3)
  final bool isDeleted;

  CashierModel({
    required this.id,
    required this.name,
    required this.shopId,
    this.isDeleted = false,
  });

  factory CashierModel.fromJson(Map<String, dynamic> json) {
    return CashierModel(
      id: (json['id'] ?? '') as String,
      name: (json['name'] ?? '') as String,
      shopId: (json['shop_id'] ?? json['shopId'] ?? '') as String,
      isDeleted: (json['is_deleted'] ?? json['isDeleted']) as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'shop_id': shopId,
      'is_deleted': isDeleted,
    };
  }

  CashierModel copyWith({
    String? name,
    String? shopId,
    bool? isDeleted,
  }) {
    return CashierModel(
      id: id,
      name: name ?? this.name,
      shopId: shopId ?? this.shopId,
      isDeleted: isDeleted ?? this.isDeleted,
    );
  }
}
