import 'package:hive/hive.dart';

part 'wholesale_models.g.dart';

@HiveType(typeId: 14)
class WholesaleCustomerModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String name;

  @HiveField(2)
  final String mobile;

  @HiveField(3)
  final double openingDue;

  @HiveField(4)
  final bool isActive;

  @HiveField(5)
  final bool isDeleted;

  @HiveField(6)
  final DateTime createdAt;

  @HiveField(7)
  final String? address;

  @HiveField(8)
  final String? vatNumber;

  @HiveField(9)
  final String? notes;

  @HiveField(10)
  final double creditLimit;

  WholesaleCustomerModel({
    required this.id,
    required this.name,
    required this.mobile,
    required this.openingDue,
    this.isActive = true,
    this.isDeleted = false,
    required this.createdAt,
    this.address,
    this.vatNumber,
    this.notes,
    this.creditLimit = 0.0,
  });

  WholesaleCustomerModel copyWith({
    String? name,
    String? mobile,
    double? openingDue,
    bool? isActive,
    bool? isDeleted,
    String? address,
    String? vatNumber,
    String? notes,
    double? creditLimit,
  }) {
    return WholesaleCustomerModel(
      id: id,
      name: name ?? this.name,
      mobile: mobile ?? this.mobile,
      openingDue: openingDue ?? this.openingDue,
      isActive: isActive ?? this.isActive,
      isDeleted: isDeleted ?? this.isDeleted,
      createdAt: createdAt,
      address: address ?? this.address,
      vatNumber: vatNumber ?? this.vatNumber,
      notes: notes ?? this.notes,
      creditLimit: creditLimit ?? this.creditLimit,
    );
  }
}

@HiveType(typeId: 15)
class WholesalePaymentModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String customerId;

  @HiveField(2)
  final double amount;

  @HiveField(3)
  final String kind; // 'payment_in' or 'payment_out'

  @HiveField(4)
  final String? notes;

  @HiveField(5)
  final bool isDeleted;

  @HiveField(6)
  final DateTime createdAt;

  WholesalePaymentModel({
    required this.id,
    required this.customerId,
    required this.amount,
    required this.kind,
    this.notes,
    this.isDeleted = false,
    required this.createdAt,
  });

  WholesalePaymentModel copyWith({
    String? customerId,
    double? amount,
    String? kind,
    String? notes,
    bool? isDeleted,
  }) {
    return WholesalePaymentModel(
      id: id,
      customerId: customerId ?? this.customerId,
      amount: amount ?? this.amount,
      kind: kind ?? this.kind,
      notes: notes ?? this.notes,
      isDeleted: isDeleted ?? this.isDeleted,
      createdAt: createdAt,
    );
  }
}

@HiveType(typeId: 17)
class WholesaleSaleItemModel extends HiveObject {
  @HiveField(0)
  final String productId;

  @HiveField(1)
  final String name;

  @HiveField(2)
  final double qty;

  @HiveField(3)
  final double price;

  @HiveField(4)
  final double purchasePrice;

  WholesaleSaleItemModel({
    required this.productId,
    required this.name,
    required this.qty,
    required this.price,
    required this.purchasePrice,
  });

  factory WholesaleSaleItemModel.fromJson(Map<String, dynamic> json) {
    return WholesaleSaleItemModel(
      productId: json['product_id'] as String? ?? json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      qty: (json['qty'] as num? ?? 1.0).toDouble(),
      price: (json['price'] as num? ?? 0.0).toDouble(),
      purchasePrice: (json['purchase_price'] as num? ?? 0.0).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'product_id': productId,
      'name': name,
      'qty': qty,
      'price': price,
      'purchase_price': purchasePrice,
    };
  }
}

@HiveType(typeId: 16)
class WholesaleSaleModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final int invoiceNumber;

  @HiveField(2)
  final String? customerId;

  @HiveField(3)
  final String customerName;

  @HiveField(4)
  final String customerMobile;

  @HiveField(5)
  final List<WholesaleSaleItemModel> items;

  @HiveField(6)
  final double total;

  @HiveField(7)
  final double discount;

  @HiveField(8)
  final double dueAmount;

  @HiveField(9)
  final String paymentMethod; // 'cash', 'pos', 'bank', 'due', 'mixed'

  @HiveField(10)
  final String status; // 'completed', 'cancelled'

  @HiveField(11)
  final bool isDeleted;

  @HiveField(12)
  final DateTime createdAt;

  WholesaleSaleModel({
    required this.id,
    required this.invoiceNumber,
    this.customerId,
    required this.customerName,
    required this.customerMobile,
    required this.items,
    required this.total,
    this.discount = 0.0,
    required this.dueAmount,
    required this.paymentMethod,
    this.status = 'completed',
    this.isDeleted = false,
    required this.createdAt,
  });

  WholesaleSaleModel copyWith({
    int? invoiceNumber,
    String? customerId,
    String? customerName,
    String? customerMobile,
    List<WholesaleSaleItemModel>? items,
    double? total,
    double? discount,
    double? dueAmount,
    String? paymentMethod,
    String? status,
    bool? isDeleted,
  }) {
    return WholesaleSaleModel(
      id: id,
      invoiceNumber: invoiceNumber ?? this.invoiceNumber,
      customerId: customerId ?? this.customerId,
      customerName: customerName ?? this.customerName,
      customerMobile: customerMobile ?? this.customerMobile,
      items: items ?? this.items,
      total: total ?? this.total,
      discount: discount ?? this.discount,
      dueAmount: dueAmount ?? this.dueAmount,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      status: status ?? this.status,
      isDeleted: isDeleted ?? this.isDeleted,
      createdAt: createdAt,
    );
  }
}

@HiveType(typeId: 18)
class WholesalePurchaseModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String invoiceNumber;

  @HiveField(2)
  final String supplierName;

  @HiveField(3)
  final List<WholesaleSaleItemModel> items;

  @HiveField(4)
  final double total;

  @HiveField(5)
  final String? notes;

  @HiveField(6)
  final bool isDeleted;

  @HiveField(7)
  final DateTime createdAt;

  WholesalePurchaseModel({
    required this.id,
    required this.invoiceNumber,
    required this.supplierName,
    required this.items,
    required this.total,
    this.notes,
    this.isDeleted = false,
    required this.createdAt,
  });

  WholesalePurchaseModel copyWith({
    String? invoiceNumber,
    String? supplierName,
    List<WholesaleSaleItemModel>? items,
    double? total,
    String? notes,
    bool? isDeleted,
  }) {
    return WholesalePurchaseModel(
      id: id,
      invoiceNumber: invoiceNumber ?? this.invoiceNumber,
      supplierName: supplierName ?? this.supplierName,
      items: items ?? this.items,
      total: total ?? this.total,
      notes: notes ?? this.notes,
      isDeleted: isDeleted ?? this.isDeleted,
      createdAt: createdAt,
    );
  }
}

@HiveType(typeId: 19)
class WholesaleOrderModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final int orderNumber;

  @HiveField(2)
  final String customerName;

  @HiveField(3)
  final String customerMobile;

  @HiveField(4)
  final String? customerAddress;

  @HiveField(5)
  final List<WholesaleSaleItemModel> items;

  @HiveField(6)
  final double total;

  @HiveField(7)
  final String? notes;

  @HiveField(8)
  final String status; // 'pending', 'confirmed', 'preparing', 'delivered', 'cancelled'

  @HiveField(9)
  final bool isDeleted;

  @HiveField(10)
  final DateTime createdAt;

  WholesaleOrderModel({
    required this.id,
    required this.orderNumber,
    required this.customerName,
    required this.customerMobile,
    this.customerAddress,
    required this.items,
    required this.total,
    this.notes,
    this.status = 'pending',
    this.isDeleted = false,
    required this.createdAt,
  });

  WholesaleOrderModel copyWith({
    int? orderNumber,
    String? customerName,
    String? customerMobile,
    String? customerAddress,
    List<WholesaleSaleItemModel>? items,
    double? total,
    String? notes,
    String? status,
    bool? isDeleted,
  }) {
    return WholesaleOrderModel(
      id: id,
      orderNumber: orderNumber ?? this.orderNumber,
      customerName: customerName ?? this.customerName,
      customerMobile: customerMobile ?? this.customerMobile,
      customerAddress: customerAddress ?? this.customerAddress,
      items: items ?? this.items,
      total: total ?? this.total,
      notes: notes ?? this.notes,
      status: status ?? this.status,
      isDeleted: isDeleted ?? this.isDeleted,
      createdAt: createdAt,
    );
  }
}

@HiveType(typeId: 20)
class WholesaleCategoryModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String name;

  @HiveField(2)
  final String? nameAr;

  @HiveField(3)
  final String? nameBn;

  @HiveField(4)
  final int sortOrder;

  @HiveField(5)
  final bool isActive;

  @HiveField(6)
  final String? imageUrl;

  @HiveField(7)
  final String? smartSection;

  WholesaleCategoryModel({
    required this.id,
    required this.name,
    this.nameAr,
    this.nameBn,
    this.sortOrder = 0,
    this.isActive = true,
    this.imageUrl,
    this.smartSection,
  });

  WholesaleCategoryModel copyWith({
    String? name,
    String? nameAr,
    String? nameBn,
    int? sortOrder,
    bool? isActive,
    String? imageUrl,
    String? smartSection,
  }) {
    return WholesaleCategoryModel(
      id: id,
      name: name ?? this.name,
      nameAr: nameAr ?? this.nameAr,
      nameBn: nameBn ?? this.nameBn,
      sortOrder: sortOrder ?? this.sortOrder,
      isActive: isActive ?? this.isActive,
      imageUrl: imageUrl ?? this.imageUrl,
      smartSection: smartSection ?? this.smartSection,
    );
  }
}
