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

  ShopModel({
    required this.id,
    required this.name,
    this.shopType = 'full_erp',
    this.isDeleted = false,
    required this.createdAt,
  });

  factory ShopModel.fromJson(Map<String, dynamic> json) {
    return ShopModel(
      id: json['id'] as String,
      name: json['name'] as String,
      shopType: json['shop_type'] as String?,
      isDeleted: json['is_deleted'] as bool? ?? false,
      createdAt: json['created_at'] != null 
          ? DateTime.parse(json['created_at'] as String) 
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'shop_type': shopType,
      'is_deleted': isDeleted,
      'created_at': createdAt.toIso8601String(),
    };
  }

  ShopModel copyWith({
    String? name,
    String? shopType,
    bool? isDeleted,
  }) {
    return ShopModel(
      id: id,
      name: name ?? this.name,
      shopType: shopType ?? this.shopType,
      isDeleted: isDeleted ?? this.isDeleted,
      createdAt: createdAt,
    );
  }
}
