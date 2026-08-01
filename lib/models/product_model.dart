import 'package:hive/hive.dart';

class ProductModel extends HiveObject {
  final String id;
  final String name;
  final String? nameAr;
  final String? nameBn;
  final String? barcode;
  final String? itemCode;
  final double price;
  final double purchasePrice;
  final double stock;
  final double minStock;
  final String? imageUrl;
  final bool isDeleted;
  final DateTime createdAt;
  final double? comparePrice;
  final double? taxRate;
  final String? description;
  final List<String>? categoryIds;
  final bool isVisibleOnWebsite;
  final bool isFeatured;
  final bool showStock;
  final List<String>? images;

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
    this.comparePrice,
    this.taxRate = 15.0,
    this.description,
    this.categoryIds,
    this.isVisibleOnWebsite = true,
    this.isFeatured = false,
    this.showStock = true,
    this.images,
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
      comparePrice: (json['compare_price'] as num?)?.toDouble(),
      taxRate: (json['tax_rate'] as num? ?? 15.0).toDouble(),
      description: json['description'] as String?,
      categoryIds: (json['category_ids'] as List?)?.cast<String>(),
      isVisibleOnWebsite: json['is_visible_on_website'] as bool? ?? true,
      isFeatured: json['is_featured'] as bool? ?? false,
      showStock: json['show_stock'] as bool? ?? true,
      images: (json['images'] as List?)?.cast<String>(),
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
      'compare_price': comparePrice,
      'tax_rate': taxRate,
      'description': description,
      'category_ids': categoryIds,
      'is_visible_on_website': isVisibleOnWebsite,
      'is_featured': isFeatured,
      'show_stock': showStock,
      'images': images,
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
    double? comparePrice,
    double? taxRate,
    String? description,
    List<String>? categoryIds,
    bool? isVisibleOnWebsite,
    bool? isFeatured,
    bool? showStock,
    List<String>? images,
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
      comparePrice: comparePrice ?? this.comparePrice,
      taxRate: taxRate ?? this.taxRate,
      description: description ?? this.description,
      categoryIds: categoryIds ?? this.categoryIds,
      isVisibleOnWebsite: isVisibleOnWebsite ?? this.isVisibleOnWebsite,
      isFeatured: isFeatured ?? this.isFeatured,
      showStock: showStock ?? this.showStock,
      images: images ?? this.images,
    );
  }
}

class ProductModelAdapter extends TypeAdapter<ProductModel> {
  @override
  final int typeId = 7;

  @override
  ProductModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return ProductModel(
      id: fields[0] as String,
      name: fields[1] as String,
      nameAr: fields[2] as String?,
      nameBn: fields[3] as String?,
      barcode: fields[4] as String?,
      itemCode: fields[5] as String?,
      price: (fields[6] as num).toDouble(),
      purchasePrice: (fields[7] as num).toDouble(),
      stock: (fields[8] as num).toDouble(),
      minStock: (fields[9] as num).toDouble(),
      imageUrl: fields[10] as String?,
      isDeleted: fields[11] as bool? ?? false,
      createdAt: fields[12] as DateTime,
      comparePrice: (fields[13] as num?)?.toDouble(),
      taxRate: (fields[14] as num?)?.toDouble() ?? 15.0,
      description: fields[15] as String?,
      categoryIds: (fields[16] as List?)?.cast<String>(),
      isVisibleOnWebsite: (fields[17] as bool?) ?? true,
      isFeatured: (fields[18] as bool?) ?? false,
      showStock: (fields[19] as bool?) ?? true,
      images: (fields[20] as List?)?.cast<String>(),
    );
  }

  @override
  void write(BinaryWriter writer, ProductModel obj) {
    writer
      ..writeByte(21)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.nameAr)
      ..writeByte(3)
      ..write(obj.nameBn)
      ..writeByte(4)
      ..write(obj.barcode)
      ..writeByte(5)
      ..write(obj.itemCode)
      ..writeByte(6)
      ..write(obj.price)
      ..writeByte(7)
      ..write(obj.purchasePrice)
      ..writeByte(8)
      ..write(obj.stock)
      ..writeByte(9)
      ..write(obj.minStock)
      ..writeByte(10)
      ..write(obj.imageUrl)
      ..writeByte(11)
      ..write(obj.isDeleted)
      ..writeByte(12)
      ..write(obj.createdAt)
      ..writeByte(13)
      ..write(obj.comparePrice)
      ..writeByte(14)
      ..write(obj.taxRate)
      ..writeByte(15)
      ..write(obj.description)
      ..writeByte(16)
      ..write(obj.categoryIds)
      ..writeByte(17)
      ..write(obj.isVisibleOnWebsite)
      ..writeByte(18)
      ..write(obj.isFeatured)
      ..writeByte(19)
      ..write(obj.showStock)
      ..writeByte(20)
      ..write(obj.images);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ProductModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
