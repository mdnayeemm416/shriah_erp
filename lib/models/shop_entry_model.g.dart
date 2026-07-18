// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'shop_entry_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class ShopEntryModelAdapter extends TypeAdapter<ShopEntryModel> {
  @override
  final int typeId = 2;

  @override
  ShopEntryModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return ShopEntryModel(
      id: fields[0] as String,
      shopId: fields[1] as String,
      cashierId: fields[2] as String?,
      entryType: fields[3] as String,
      posSale: fields[4] as double,
      cashSale: fields[5] as double,
      bankSale: fields[6] as double,
      creditSale: fields[7] as double,
      purchaseAmount: fields[8] as double,
      expenseAmount: fields[9] as double,
      withdrawAmount: fields[10] as double,
      difference: fields[11] as double,
      dueReceivable: fields[12] as double,
      notes: fields[13] as String?,
      attachmentUrl: fields[14] as String?,
      txnDate: fields[15] as DateTime,
      isDeleted: fields[16] as bool,
      createdAt: fields[17] as DateTime,
    );
  }

  @override
  void write(BinaryWriter writer, ShopEntryModel obj) {
    writer
      ..writeByte(18)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.shopId)
      ..writeByte(2)
      ..write(obj.cashierId)
      ..writeByte(3)
      ..write(obj.entryType)
      ..writeByte(4)
      ..write(obj.posSale)
      ..writeByte(5)
      ..write(obj.cashSale)
      ..writeByte(6)
      ..write(obj.bankSale)
      ..writeByte(7)
      ..write(obj.creditSale)
      ..writeByte(8)
      ..write(obj.purchaseAmount)
      ..writeByte(9)
      ..write(obj.expenseAmount)
      ..writeByte(10)
      ..write(obj.withdrawAmount)
      ..writeByte(11)
      ..write(obj.difference)
      ..writeByte(12)
      ..write(obj.dueReceivable)
      ..writeByte(13)
      ..write(obj.notes)
      ..writeByte(14)
      ..write(obj.attachmentUrl)
      ..writeByte(15)
      ..write(obj.txnDate)
      ..writeByte(16)
      ..write(obj.isDeleted)
      ..writeByte(17)
      ..write(obj.createdAt);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ShopEntryModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
