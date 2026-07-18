// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'cashier_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class CashierModelAdapter extends TypeAdapter<CashierModel> {
  @override
  final int typeId = 1;

  @override
  CashierModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return CashierModel(
      id: fields[0] as String,
      name: fields[1] as String,
      shopId: fields[2] as String,
      isDeleted: fields[3] as bool,
    );
  }

  @override
  void write(BinaryWriter writer, CashierModel obj) {
    writer
      ..writeByte(4)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.shopId)
      ..writeByte(3)
      ..write(obj.isDeleted);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CashierModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
