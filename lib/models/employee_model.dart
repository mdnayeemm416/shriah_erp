import 'package:hive/hive.dart';

part 'employee_model.g.dart';

@HiveType(typeId: 3)
class EmployeeModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String name;

  @HiveField(2)
  final String? shopId;

  @HiveField(3)
  final double monthlySalary;

  @HiveField(4)
  final bool isDeleted;

  @HiveField(5)
  final DateTime createdAt;

  EmployeeModel({
    required this.id,
    required this.name,
    this.shopId,
    required this.monthlySalary,
    this.isDeleted = false,
    required this.createdAt,
  });

  factory EmployeeModel.fromJson(Map<String, dynamic> json) {
    return EmployeeModel(
      id: json['id'] as String,
      name: json['name'] as String,
      shopId: json['shop_id'] as String?,
      monthlySalary: (json['monthly_salary'] as num? ?? 0.0).toDouble(),
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
      'shop_id': shopId,
      'monthly_salary': monthlySalary,
      'is_deleted': isDeleted,
      'created_at': createdAt.toIso8601String(),
    };
  }

  EmployeeModel copyWith({
    String? name,
    String? shopId,
    double? monthlySalary,
    bool? isDeleted,
  }) {
    return EmployeeModel(
      id: id,
      name: name ?? this.name,
      shopId: shopId ?? this.shopId,
      monthlySalary: monthlySalary ?? this.monthlySalary,
      isDeleted: isDeleted ?? this.isDeleted,
      createdAt: createdAt,
    );
  }
}
