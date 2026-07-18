// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'cash_holder_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class CashHolderModelAdapter extends TypeAdapter<CashHolderModel> {
  @override
  final int typeId = 8;

  @override
  CashHolderModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return CashHolderModel(
      name: fields[0] as String,
      amount: fields[1] as double,
    );
  }

  @override
  void write(BinaryWriter writer, CashHolderModel obj) {
    writer
      ..writeByte(2)
      ..writeByte(0)
      ..write(obj.name)
      ..writeByte(1)
      ..write(obj.amount);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CashHolderModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
