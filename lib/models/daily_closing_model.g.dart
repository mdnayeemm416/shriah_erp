// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'daily_closing_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class DailyClosingModelAdapter extends TypeAdapter<DailyClosingModel> {
  @override
  final int typeId = 10;

  @override
  DailyClosingModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return DailyClosingModel(
      id: fields[0] as String,
      closingDate: fields[1] as DateTime,
      openingCash: fields[2] as double,
      cashSale: fields[3] as double,
      withdraw: fields[4] as double,
      purchase: fields[5] as double,
      expense: fields[6] as double,
      expectedCash: fields[7] as double,
      countedCash: fields[8] as double,
      difference: fields[9] as double,
      status: fields[10] as String,
      notes: fields[11] as String?,
      holders: (fields[12] as List).cast<CashHolderModel>(),
      distribution: (fields[13] as Map).cast<String, double>(),
      distributionTotal: fields[14] as double,
      createdBy: fields[15] as String,
      createdAt: fields[16] as DateTime,
      updatedAt: fields[17] as DateTime?,
      isDeleted: fields[18] as bool,
    );
  }

  @override
  void write(BinaryWriter writer, DailyClosingModel obj) {
    writer
      ..writeByte(19)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.closingDate)
      ..writeByte(2)
      ..write(obj.openingCash)
      ..writeByte(3)
      ..write(obj.cashSale)
      ..writeByte(4)
      ..write(obj.withdraw)
      ..writeByte(5)
      ..write(obj.purchase)
      ..writeByte(6)
      ..write(obj.expense)
      ..writeByte(7)
      ..write(obj.expectedCash)
      ..writeByte(8)
      ..write(obj.countedCash)
      ..writeByte(9)
      ..write(obj.difference)
      ..writeByte(10)
      ..write(obj.status)
      ..writeByte(11)
      ..write(obj.notes)
      ..writeByte(12)
      ..write(obj.holders)
      ..writeByte(13)
      ..write(obj.distribution)
      ..writeByte(14)
      ..write(obj.distributionTotal)
      ..writeByte(15)
      ..write(obj.createdBy)
      ..writeByte(16)
      ..write(obj.createdAt)
      ..writeByte(17)
      ..write(obj.updatedAt)
      ..writeByte(18)
      ..write(obj.isDeleted);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is DailyClosingModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
