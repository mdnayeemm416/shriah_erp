import 'package:hive/hive.dart';

part 'price_compare_models.g.dart';

@HiveType(typeId: 12)
class PriceCompareProductModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String name;

  @HiveField(2)
  final String? barcode;

  @HiveField(3)
  final String? brand;

  @HiveField(4)
  final String? imageUrl;

  @HiveField(5)
  final double salePrice;

  @HiveField(6)
  final bool isDeleted;

  PriceCompareProductModel({
    required this.id,
    required this.name,
    this.barcode,
    this.brand,
    this.imageUrl,
    this.salePrice = 0.0,
    this.isDeleted = false,
  });

  factory PriceCompareProductModel.fromJson(Map<String, dynamic> json) {
    return PriceCompareProductModel(
      id: json['id'] as String,
      name: json['name'] as String,
      barcode: json['barcode'] as String?,
      brand: json['brand'] as String?,
      imageUrl: json['image_url'] as String?,
      salePrice: (json['sale_price'] as num? ?? 0.0).toDouble(),
      isDeleted: json['is_deleted'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'barcode': barcode,
      'brand': brand,
      'image_url': imageUrl,
      'sale_price': salePrice,
      'is_deleted': isDeleted,
    };
  }

  PriceCompareProductModel copyWith({
    String? name,
    String? barcode,
    String? brand,
    String? imageUrl,
    double? salePrice,
    bool? isDeleted,
  }) {
    return PriceCompareProductModel(
      id: id,
      name: name ?? this.name,
      barcode: barcode ?? this.barcode,
      brand: brand ?? this.brand,
      imageUrl: imageUrl ?? this.imageUrl,
      salePrice: salePrice ?? this.salePrice,
      isDeleted: isDeleted ?? this.isDeleted,
    );
  }
}

@HiveType(typeId: 13)
class PriceCompareRecordModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String productId;

  @HiveField(2)
  final String supplier;

  @HiveField(3)
  final double purchasePrice;

  @HiveField(4)
  final DateTime recordDate;

  @HiveField(5)
  final String? note;

  @HiveField(6)
  final bool isDeleted;

  PriceCompareRecordModel({
    required this.id,
    required this.productId,
    required this.supplier,
    required this.purchasePrice,
    required this.recordDate,
    this.note,
    this.isDeleted = false,
  });

  factory PriceCompareRecordModel.fromJson(Map<String, dynamic> json) {
    return PriceCompareRecordModel(
      id: json['id'] as String,
      productId: json['product_id'] as String,
      supplier: json['supplier'] as String? ?? '',
      purchasePrice: (json['purchase_price'] as num? ?? 0.0).toDouble(),
      recordDate: DateTime.parse(json['record_date'] as String),
      note: json['note'] as String?,
      isDeleted: json['is_deleted'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'product_id': productId,
      'supplier': supplier,
      'purchase_price': purchasePrice,
      'record_date': recordDate.toIso8601String().split('T')[0],
      'note': note,
      'is_deleted': isDeleted,
    };
  }

  PriceCompareRecordModel copyWith({
    String? productId,
    String? supplier,
    double? purchasePrice,
    DateTime? recordDate,
    String? note,
    bool? isDeleted,
  }) {
    return PriceCompareRecordModel(
      id: id,
      productId: productId ?? this.productId,
      supplier: supplier ?? this.supplier,
      purchasePrice: purchasePrice ?? this.purchasePrice,
      recordDate: recordDate ?? this.recordDate,
      note: note ?? this.note,
      isDeleted: isDeleted ?? this.isDeleted,
    );
  }
}
