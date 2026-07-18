import 'package:hive/hive.dart';

part 'product_model.g.dart';

@HiveType(typeId: 7)
class ProductModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String name;

  @HiveField(2)
  final String? nameAr;

  @HiveField(3)
  final String? nameBn;

  @HiveField(4)
  final String? barcode;

  @HiveField(5)
  final String? itemCode;

  @HiveField(6)
  final double price;

  @HiveField(7)
  final double purchasePrice;

  @HiveField(8)
  final double stock;

  @HiveField(9)
  final double minStock;

  @HiveField(10)
  final String? imageUrl;

  @HiveField(11)
  final bool isDeleted;

  @HiveField(12)
  final DateTime createdAt;

  ProductModel({
    required this.id,
    required this.name,
    this.nameAr,
    this.nameBn,
    this.barcode,
    this.itemCode,
    required this.price,
    required this.purchasePrice,
    this.stock = 0.0,
    this.minStock = 5.0,
    this.imageUrl,
    this.isDeleted = false,
    required this.createdAt,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      id: json['id'] as String,
      name: json['name'] as String,
      nameAr: json['name_ar'] as String?,
      nameBn: json['name_bn'] as String?,
      barcode: json['barcode'] as String?,
      itemCode: json['item_code'] as String?,
      price: (json['price'] as num? ?? 0.0).toDouble(),
      purchasePrice: (json['purchase_price'] as num? ?? 0.0).toDouble(),
      stock: (json['stock'] as num? ?? 0.0).toDouble(),
      minStock: (json['min_stock'] as num? ?? 5.0).toDouble(),
      imageUrl: json['image_url'] as String?,
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
      'name_ar': nameAr,
      'name_bn': nameBn,
      'barcode': barcode,
      'item_code': itemCode,
      'price': price,
      'purchase_price': purchasePrice,
      'stock': stock,
      'min_stock': minStock,
      'image_url': imageUrl,
      'is_deleted': isDeleted,
      'created_at': createdAt.toIso8601String(),
    };
  }

  ProductModel copyWith({
    String? name,
    String? nameAr,
    String? nameBn,
    String? barcode,
    String? itemCode,
    double? price,
    double? purchasePrice,
    double? stock,
    double? minStock,
    String? imageUrl,
    bool? isDeleted,
  }) {
    return ProductModel(
      id: id,
      name: name ?? this.name,
      nameAr: nameAr ?? this.nameAr,
      nameBn: nameBn ?? this.nameBn,
      barcode: barcode ?? this.barcode,
      itemCode: itemCode ?? this.itemCode,
      price: price ?? this.price,
      purchasePrice: purchasePrice ?? this.purchasePrice,
      stock: stock ?? this.stock,
      minStock: minStock ?? this.minStock,
      imageUrl: imageUrl ?? this.imageUrl,
      isDeleted: isDeleted ?? this.isDeleted,
      createdAt: createdAt,
    );
  }
}
