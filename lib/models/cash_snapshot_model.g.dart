// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'cash_snapshot_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class CashInHandSnapshotModelAdapter
    extends TypeAdapter<CashInHandSnapshotModel> {
  @override
  final int typeId = 9;

  @override
  CashInHandSnapshotModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return CashInHandSnapshotModel(
      id: fields[0] as String,
      snapshotDate: fields[1] as DateTime,
      cashInHand: fields[2] as double,
      cashInApp: fields[3] as double,
      difference: fields[4] as double,
      holders: (fields[5] as List).cast<CashHolderModel>(),
      createdAt: fields[6] as DateTime,
    );
  }

  @override
  void write(BinaryWriter writer, CashInHandSnapshotModel obj) {
    writer
      ..writeByte(7)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.snapshotDate)
      ..writeByte(2)
      ..write(obj.cashInHand)
      ..writeByte(3)
      ..write(obj.cashInApp)
      ..writeByte(4)
      ..write(obj.difference)
      ..writeByte(5)
      ..write(obj.holders)
      ..writeByte(6)
      ..write(obj.createdAt);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CashInHandSnapshotModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
