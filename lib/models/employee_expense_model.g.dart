// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'employee_expense_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class EmployeeExpenseModelAdapter extends TypeAdapter<EmployeeExpenseModel> {
  @override
  final int typeId = 11;

  @override
  EmployeeExpenseModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return EmployeeExpenseModel(
      id: fields[0] as String,
      employeeId: fields[1] as String,
      kind: fields[2] as String,
      status: fields[3] as String,
      amount: fields[4] as double,
      category: fields[5] as String,
      note: fields[6] as String,
      txnDate: fields[7] as DateTime,
      attachmentUrl: fields[8] as String?,
      createdAt: fields[9] as DateTime,
      createdBy: fields[10] as String,
      isDeleted: fields[11] as bool,
    );
  }

  @override
  void write(BinaryWriter writer, EmployeeExpenseModel obj) {
    writer
      ..writeByte(12)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.employeeId)
      ..writeByte(2)
      ..write(obj.kind)
      ..writeByte(3)
      ..write(obj.status)
      ..writeByte(4)
      ..write(obj.amount)
      ..writeByte(5)
      ..write(obj.category)
      ..writeByte(6)
      ..write(obj.note)
      ..writeByte(7)
      ..write(obj.txnDate)
      ..writeByte(8)
      ..write(obj.attachmentUrl)
      ..writeByte(9)
      ..write(obj.createdAt)
      ..writeByte(10)
      ..write(obj.createdBy)
      ..writeByte(11)
      ..write(obj.isDeleted);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is EmployeeExpenseModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
