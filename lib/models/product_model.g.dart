// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'product_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

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
      price: fields[6] as double,
      purchasePrice: fields[7] as double,
      stock: fields[8] as double,
      minStock: fields[9] as double,
      imageUrl: fields[10] as String?,
      isDeleted: fields[11] as bool,
      createdAt: fields[12] as DateTime,
      comparePrice: fields[13] as double?,
      taxRate: fields[14] as double?,
      description: fields[15] as String?,
      categoryIds: (fields[16] as List?)?.cast<String>(),
      isVisibleOnWebsite: fields[17] as bool,
      isFeatured: fields[18] as bool,
      showStock: fields[19] as bool,
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
