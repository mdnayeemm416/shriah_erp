// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'price_compare_models.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class PriceCompareProductModelAdapter
    extends TypeAdapter<PriceCompareProductModel> {
  @override
  final int typeId = 12;

  @override
  PriceCompareProductModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return PriceCompareProductModel(
      id: fields[0] as String,
      name: fields[1] as String,
      barcode: fields[2] as String?,
      brand: fields[3] as String?,
      imageUrl: fields[4] as String?,
      salePrice: fields[5] as double,
      isDeleted: fields[6] as bool,
    );
  }

  @override
  void write(BinaryWriter writer, PriceCompareProductModel obj) {
    writer
      ..writeByte(7)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.barcode)
      ..writeByte(3)
      ..write(obj.brand)
      ..writeByte(4)
      ..write(obj.imageUrl)
      ..writeByte(5)
      ..write(obj.salePrice)
      ..writeByte(6)
      ..write(obj.isDeleted);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is PriceCompareProductModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class PriceCompareRecordModelAdapter
    extends TypeAdapter<PriceCompareRecordModel> {
  @override
  final int typeId = 13;

  @override
  PriceCompareRecordModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return PriceCompareRecordModel(
      id: fields[0] as String,
      productId: fields[1] as String,
      supplier: fields[2] as String,
      purchasePrice: fields[3] as double,
      recordDate: fields[4] as DateTime,
      note: fields[5] as String?,
      isDeleted: fields[6] as bool,
    );
  }

  @override
  void write(BinaryWriter writer, PriceCompareRecordModel obj) {
    writer
      ..writeByte(7)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.productId)
      ..writeByte(2)
      ..write(obj.supplier)
      ..writeByte(3)
      ..write(obj.purchasePrice)
      ..writeByte(4)
      ..write(obj.recordDate)
      ..writeByte(5)
      ..write(obj.note)
      ..writeByte(6)
      ..write(obj.isDeleted);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is PriceCompareRecordModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
