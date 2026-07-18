// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'wholesale_models.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class WholesaleCustomerModelAdapter
    extends TypeAdapter<WholesaleCustomerModel> {
  @override
  final int typeId = 14;

  @override
  WholesaleCustomerModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return WholesaleCustomerModel(
      id: fields[0] as String,
      name: fields[1] as String,
      mobile: fields[2] as String,
      openingDue: fields[3] as double,
      isActive: fields[4] as bool,
      isDeleted: fields[5] as bool,
      createdAt: fields[6] as DateTime,
    );
  }

  @override
  void write(BinaryWriter writer, WholesaleCustomerModel obj) {
    writer
      ..writeByte(7)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.mobile)
      ..writeByte(3)
      ..write(obj.openingDue)
      ..writeByte(4)
      ..write(obj.isActive)
      ..writeByte(5)
      ..write(obj.isDeleted)
      ..writeByte(6)
      ..write(obj.createdAt);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is WholesaleCustomerModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class WholesalePaymentModelAdapter extends TypeAdapter<WholesalePaymentModel> {
  @override
  final int typeId = 15;

  @override
  WholesalePaymentModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return WholesalePaymentModel(
      id: fields[0] as String,
      customerId: fields[1] as String,
      amount: fields[2] as double,
      kind: fields[3] as String,
      notes: fields[4] as String?,
      isDeleted: fields[5] as bool,
      createdAt: fields[6] as DateTime,
    );
  }

  @override
  void write(BinaryWriter writer, WholesalePaymentModel obj) {
    writer
      ..writeByte(7)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.customerId)
      ..writeByte(2)
      ..write(obj.amount)
      ..writeByte(3)
      ..write(obj.kind)
      ..writeByte(4)
      ..write(obj.notes)
      ..writeByte(5)
      ..write(obj.isDeleted)
      ..writeByte(6)
      ..write(obj.createdAt);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is WholesalePaymentModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class WholesaleSaleItemModelAdapter
    extends TypeAdapter<WholesaleSaleItemModel> {
  @override
  final int typeId = 17;

  @override
  WholesaleSaleItemModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return WholesaleSaleItemModel(
      productId: fields[0] as String,
      name: fields[1] as String,
      qty: fields[2] as double,
      price: fields[3] as double,
      purchasePrice: fields[4] as double,
    );
  }

  @override
  void write(BinaryWriter writer, WholesaleSaleItemModel obj) {
    writer
      ..writeByte(5)
      ..writeByte(0)
      ..write(obj.productId)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.qty)
      ..writeByte(3)
      ..write(obj.price)
      ..writeByte(4)
      ..write(obj.purchasePrice);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is WholesaleSaleItemModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class WholesaleSaleModelAdapter extends TypeAdapter<WholesaleSaleModel> {
  @override
  final int typeId = 16;

  @override
  WholesaleSaleModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return WholesaleSaleModel(
      id: fields[0] as String,
      invoiceNumber: fields[1] as int,
      customerId: fields[2] as String?,
      customerName: fields[3] as String,
      customerMobile: fields[4] as String,
      items: (fields[5] as List).cast<WholesaleSaleItemModel>(),
      total: fields[6] as double,
      discount: fields[7] as double,
      dueAmount: fields[8] as double,
      paymentMethod: fields[9] as String,
      status: fields[10] as String,
      isDeleted: fields[11] as bool,
      createdAt: fields[12] as DateTime,
    );
  }

  @override
  void write(BinaryWriter writer, WholesaleSaleModel obj) {
    writer
      ..writeByte(13)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.invoiceNumber)
      ..writeByte(2)
      ..write(obj.customerId)
      ..writeByte(3)
      ..write(obj.customerName)
      ..writeByte(4)
      ..write(obj.customerMobile)
      ..writeByte(5)
      ..write(obj.items)
      ..writeByte(6)
      ..write(obj.total)
      ..writeByte(7)
      ..write(obj.discount)
      ..writeByte(8)
      ..write(obj.dueAmount)
      ..writeByte(9)
      ..write(obj.paymentMethod)
      ..writeByte(10)
      ..write(obj.status)
      ..writeByte(11)
      ..write(obj.isDeleted)
      ..writeByte(12)
      ..write(obj.createdAt);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is WholesaleSaleModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class WholesalePurchaseModelAdapter
    extends TypeAdapter<WholesalePurchaseModel> {
  @override
  final int typeId = 18;

  @override
  WholesalePurchaseModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return WholesalePurchaseModel(
      id: fields[0] as String,
      invoiceNumber: fields[1] as String,
      supplierName: fields[2] as String,
      items: (fields[3] as List).cast<WholesaleSaleItemModel>(),
      total: fields[4] as double,
      notes: fields[5] as String?,
      isDeleted: fields[6] as bool,
      createdAt: fields[7] as DateTime,
    );
  }

  @override
  void write(BinaryWriter writer, WholesalePurchaseModel obj) {
    writer
      ..writeByte(8)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.invoiceNumber)
      ..writeByte(2)
      ..write(obj.supplierName)
      ..writeByte(3)
      ..write(obj.items)
      ..writeByte(4)
      ..write(obj.total)
      ..writeByte(5)
      ..write(obj.notes)
      ..writeByte(6)
      ..write(obj.isDeleted)
      ..writeByte(7)
      ..write(obj.createdAt);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is WholesalePurchaseModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class WholesaleOrderModelAdapter extends TypeAdapter<WholesaleOrderModel> {
  @override
  final int typeId = 19;

  @override
  WholesaleOrderModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return WholesaleOrderModel(
      id: fields[0] as String,
      orderNumber: fields[1] as int,
      customerName: fields[2] as String,
      customerMobile: fields[3] as String,
      customerAddress: fields[4] as String?,
      items: (fields[5] as List).cast<WholesaleSaleItemModel>(),
      total: fields[6] as double,
      notes: fields[7] as String?,
      status: fields[8] as String,
      isDeleted: fields[9] as bool,
      createdAt: fields[10] as DateTime,
    );
  }

  @override
  void write(BinaryWriter writer, WholesaleOrderModel obj) {
    writer
      ..writeByte(11)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.orderNumber)
      ..writeByte(2)
      ..write(obj.customerName)
      ..writeByte(3)
      ..write(obj.customerMobile)
      ..writeByte(4)
      ..write(obj.customerAddress)
      ..writeByte(5)
      ..write(obj.items)
      ..writeByte(6)
      ..write(obj.total)
      ..writeByte(7)
      ..write(obj.notes)
      ..writeByte(8)
      ..write(obj.status)
      ..writeByte(9)
      ..write(obj.isDeleted)
      ..writeByte(10)
      ..write(obj.createdAt);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is WholesaleOrderModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

class WholesaleCategoryModelAdapter
    extends TypeAdapter<WholesaleCategoryModel> {
  @override
  final int typeId = 20;

  @override
  WholesaleCategoryModel read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return WholesaleCategoryModel(
      id: fields[0] as String,
      name: fields[1] as String,
      nameAr: fields[2] as String?,
      nameBn: fields[3] as String?,
      sortOrder: fields[4] as int,
      isActive: fields[5] as bool,
    );
  }

  @override
  void write(BinaryWriter writer, WholesaleCategoryModel obj) {
    writer
      ..writeByte(6)
      ..writeByte(0)
      ..write(obj.id)
      ..writeByte(1)
      ..write(obj.name)
      ..writeByte(2)
      ..write(obj.nameAr)
      ..writeByte(3)
      ..write(obj.nameBn)
      ..writeByte(4)
      ..write(obj.sortOrder)
      ..writeByte(5)
      ..write(obj.isActive);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is WholesaleCategoryModelAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
