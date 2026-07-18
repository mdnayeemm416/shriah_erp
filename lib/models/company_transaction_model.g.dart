// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'company_transaction_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class CompanyTransactionModelAdapter
    extends TypeAdapter<CompanyTransactionModel> {
  @override
  final int typeId = 5;

  @override
  CompanyTransactionModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return CompanyTransactionModel(
      id: fields[0] as String,
      amount: fields[1] as double,
      attachmentUrl: fields[2] as String?,
      category: fields[3] as String,
      notes: fields[4] as String?,
      txnDate: fields[5] as DateTime,
      txnType: fields[6] as String,
      isDeleted: fields[7] as bool,
      createdAt: fields[8] as DateTime,
    );
  }

  @override
  void write(BinaryWriter writer, CompanyTransactionModel obj) {
    writer
      ..writeByte(9)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.amount)
      ..writeByte(2)
      ..write(obj.attachmentUrl)
      ..writeByte(3)
      ..write(obj.category)
      ..writeByte(4)
      ..write(obj.notes)
      ..writeByte(5)
      ..write(obj.txnDate)
      ..writeByte(6)
      ..write(obj.txnType)
      ..writeByte(7)
      ..write(obj.isDeleted)
      ..writeByte(8)
      ..write(obj.createdAt);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CompanyTransactionModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
