// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'employee_entry_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class EmployeeEntryModelAdapter extends TypeAdapter<EmployeeEntryModel> {
  @override
  final int typeId = 4;

  @override
  EmployeeEntryModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return EmployeeEntryModel(
      id: fields[0] as String,
      employeeId: fields[1] as String,
      entryType: fields[2] as String,
      amount: fields[3] as double,
      kind: fields[4] as String,
      notes: fields[5] as String?,
      attachmentUrl: fields[6] as String?,
      txnDate: fields[7] as DateTime,
      isDeleted: fields[8] as bool,
      createdAt: fields[9] as DateTime,
    );
  }

  @override
  void write(BinaryWriter writer, EmployeeEntryModel obj) {
    writer
      ..writeByte(10)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.employeeId)
      ..writeByte(2)
      ..write(obj.entryType)
      ..writeByte(3)
      ..write(obj.amount)
      ..writeByte(4)
      ..write(obj.kind)
      ..writeByte(5)
      ..write(obj.notes)
      ..writeByte(6)
      ..write(obj.attachmentUrl)
      ..writeByte(7)
      ..write(obj.txnDate)
      ..writeByte(8)
      ..write(obj.isDeleted)
      ..writeByte(9)
      ..write(obj.createdAt);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is EmployeeEntryModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
