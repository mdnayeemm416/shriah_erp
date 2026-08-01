import 'package:hive/hive.dart';
import 'package:intl/intl.dart';

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

  @HiveField(10, defaultValue: 0.0)
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

  factory WholesaleCustomerModel.fromJson(Map<String, dynamic> json) {
    return WholesaleCustomerModel(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? 'Customer',
      mobile: json['mobile'] as String? ?? '',
      openingDue: (json['opening_due'] as num? ?? 0.0).toDouble(),
      creditLimit: (json['credit_limit'] as num? ?? 0.0).toDouble(),
      address: json['address'] as String?,
      vatNumber: json['vat_number'] as String?,
      notes: json['notes'] as String?,
      isActive: json['is_active'] as bool? ?? true,
      isDeleted: json['is_deleted'] as bool? ?? false,
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'] as String) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'mobile': mobile,
      'opening_due': openingDue,
      'credit_limit': creditLimit,
      'address': address,
      'vat_number': vatNumber,
      'notes': notes,
      'is_active': isActive,
      'is_deleted': isDeleted,
      'created_at': createdAt.toIso8601String(),
    };
  }

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

  factory WholesalePaymentModel.fromJson(Map<String, dynamic> json) {
    return WholesalePaymentModel(
      id: json['id'] as String? ?? '',
      customerId: json['customer_id'] as String? ?? json['customerId'] as String? ?? '',
      amount: (json['amount'] as num? ?? 0.0).toDouble(),
      kind: json['kind'] as String? ?? 'payment_in',
      notes: json['notes'] as String?,
      isDeleted: json['is_deleted'] as bool? ?? false,
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'] as String) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'customer_id': customerId,
      'amount': amount,
      'kind': kind,
      'notes': notes,
      'is_deleted': isDeleted,
      'created_at': createdAt.toIso8601String(),
    };
  }

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
      qty: (json['qty'] as num? ?? json['return_qty'] as num? ?? 1.0).toDouble(),
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

  @HiveField(13)
  final double? totalReturnedAmount;

  @HiveField(14)
  final double? netTotal;

  @HiveField(15)
  final List<Map<String, dynamic>>? returns;

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
    this.totalReturnedAmount,
    this.netTotal,
    this.returns,
  });

  factory WholesaleSaleModel.fromJson(Map<String, dynamic> json) {
    int invNum = 0;
    if (json['invoice_number'] is int) {
      invNum = json['invoice_number'] as int;
    } else if (json['invoice_number'] is String) {
      invNum = int.tryParse(json['invoice_number'] as String) ?? 0;
    }

    var itemList = <WholesaleSaleItemModel>[];
    if (json['items'] is List) {
      itemList = (json['items'] as List)
          .map((i) => WholesaleSaleItemModel.fromJson(i as Map<String, dynamic>))
          .toList();
    }

    bool isDel = false;
    if (json['is_deleted'] != null) {
      if (json['is_deleted'] is bool) {
        isDel = json['is_deleted'] as bool;
      } else if (json['is_deleted'] is int) {
        isDel = (json['is_deleted'] as int) == 1;
      } else if (json['is_deleted'] is String) {
        final s = json['is_deleted'] as String;
        isDel = s == '1' || s.toLowerCase() == 'true';
      }
    }

    return WholesaleSaleModel(
      id: json['id'] as String? ?? '',
      invoiceNumber: invNum,
      customerId: json['customer_id'] as String?,
      customerName: json['customer_name'] as String? ?? 'Walk-in',
      customerMobile: json['customer_mobile'] as String? ?? '',
      items: itemList,
      total: (json['total'] as num? ?? 0.0).toDouble(),
      discount: (json['discount'] as num? ?? 0.0).toDouble(),
      dueAmount: (json['due_amount'] as num? ?? 0.0).toDouble(),
      paymentMethod: json['payment_method'] as String? ?? 'cash',
      status: json['status'] as String? ?? 'completed',
      isDeleted: isDel,
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'] as String) ?? DateTime.now()
          : DateTime.now(),
      totalReturnedAmount: json['total_returned_amount'] != null
          ? (json['total_returned_amount'] as num).toDouble()
          : null,
      netTotal: json['net_total'] != null
          ? (json['net_total'] as num).toDouble()
          : null,
      returns: json['returns'] != null
          ? (json['returns'] as List).map((r) => Map<String, dynamic>.from(r as Map)).toList()
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'invoice_number': invoiceNumber,
      'customer_id': customerId,
      'customer_name': customerName,
      'customer_mobile': customerMobile,
      'items': items.map((i) => i.toJson()).toList(),
      'total': total,
      'discount': discount,
      'due_amount': dueAmount,
      'payment_method': paymentMethod,
      'status': status,
      'is_deleted': isDeleted,
      'created_at': DateFormat('yyyy-MM-dd HH:mm:ss').format(createdAt),
      if (totalReturnedAmount != null) 'total_returned_amount': totalReturnedAmount,
      if (netTotal != null) 'net_total': netTotal,
      if (returns != null) 'returns': returns,
    };
  }

  Map<String, dynamic> toCreateJson() {
    final jsonMap = <String, dynamic>{
      'customer_name': customerName,
      'customer_mobile': customerMobile,
      'total': total,
      'discount': discount,
      'due_amount': dueAmount,
      'payment_method': paymentMethod,
      'items': items.map((i) => i.toJson()).toList(),
    };
    if (customerId != null && customerId!.isNotEmpty) {
      jsonMap['customer_id'] = customerId;
    }
    return jsonMap;
  }

  WholesaleSaleModel copyWith({
    String? id,
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
    double? totalReturnedAmount,
    double? netTotal,
    List<Map<String, dynamic>>? returns,
  }) {
    return WholesaleSaleModel(
      id: id ?? this.id,
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
      totalReturnedAmount: totalReturnedAmount ?? this.totalReturnedAmount,
      netTotal: netTotal ?? this.netTotal,
      returns: returns ?? this.returns,
    );
  }
}

class WholesaleSalesReturnModel {
  final String id;
  final String? saleId;
  final String invoiceNumber;
  final String customerName;
  final String? customerId;
  final double refundAmount;
  final String reason;
  final List<Map<String, dynamic>>? items;

  WholesaleSalesReturnModel({
    required this.id,
    this.saleId,
    required this.invoiceNumber,
    required this.customerName,
    this.customerId,
    required this.refundAmount,
    required this.reason,
    this.items,
  });

  factory WholesaleSalesReturnModel.fromJson(Map<String, dynamic> json) {
    return WholesaleSalesReturnModel(
      id: json['id'] as String? ?? '',
      saleId: json['sale_id'] as String?,
      invoiceNumber: json['invoice_number']?.toString() ?? '',
      customerName: json['customer_name'] as String? ?? '',
      customerId: json['customer_id'] as String?,
      refundAmount: (json['refund_amount'] as num? ?? 0.0).toDouble(),
      reason: json['reason'] as String? ?? '',
      items: (json['items'] as List?)?.cast<Map<String, dynamic>>(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'sale_id': saleId,
      'invoice_number': invoiceNumber,
      'customer_name': customerName,
      if (customerId != null) 'customer_id': customerId,
      'refund_amount': refundAmount,
      'reason': reason,
      'items': items ?? [],
    };
  }
}

class WholesaleInvoiceReturns {
  final String saleIdentifier;
  final double totalReturnedAmount;
  final int returnsCount;
  final List<WholesaleSalesReturnModel> returns;

  WholesaleInvoiceReturns({
    required this.saleIdentifier,
    required this.totalReturnedAmount,
    required this.returnsCount,
    required this.returns,
  });

  factory WholesaleInvoiceReturns.fromJson(Map<String, dynamic> json) {
    return WholesaleInvoiceReturns(
      saleIdentifier: json['sale_identifier']?.toString() ?? '',
      totalReturnedAmount: (json['total_returned_amount'] as num? ?? 0.0).toDouble(),
      returnsCount: json['returns_count'] as int? ?? 0,
      returns: (json['returns'] as List? ?? [])
          .map((r) => WholesaleSalesReturnModel.fromJson(Map<String, dynamic>.from(r as Map)))
          .toList(),
    );
  }
}

class WholesaleSalesReturnSummary {
  final SalesReturnMetric today;
  final SalesReturnMetric thisMonth;
  final SalesReturnMetric total;

  WholesaleSalesReturnSummary({
    required this.today,
    required this.thisMonth,
    required this.total,
  });

  factory WholesaleSalesReturnSummary.fromJson(Map<String, dynamic> json) {
    return WholesaleSalesReturnSummary(
      today: SalesReturnMetric.fromJson(Map<String, dynamic>.from(json['today'] ?? {})),
      thisMonth: SalesReturnMetric.fromJson(Map<String, dynamic>.from(json['this_month'] ?? {})),
      total: SalesReturnMetric.fromJson(Map<String, dynamic>.from(json['total'] ?? {})),
    );
  }
}

class SalesReturnMetric {
  final int count;
  final double amount;

  SalesReturnMetric({
    required this.count,
    required this.amount,
  });

  factory SalesReturnMetric.fromJson(Map<String, dynamic> json) {
    return SalesReturnMetric(
      count: json['count'] as int? ?? 0,
      amount: (json['amount'] as num? ?? 0.0).toDouble(),
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

  factory WholesalePurchaseModel.fromJson(Map<String, dynamic> json) {
    var itemList = <WholesaleSaleItemModel>[];
    if (json['items'] is List) {
      itemList = (json['items'] as List)
          .map((i) => WholesaleSaleItemModel.fromJson(i as Map<String, dynamic>))
          .toList();
    }

    return WholesalePurchaseModel(
      id: json['id'] as String? ?? '',
      invoiceNumber: json['invoice_number'] as String? ?? json['invoiceNumber'] as String? ?? '',
      supplierName: json['supplier_name'] as String? ?? json['supplierName'] as String? ?? 'Supplier',
      items: itemList,
      total: (json['total'] as num? ?? 0.0).toDouble(),
      notes: json['notes'] as String?,
      isDeleted: json['is_deleted'] as bool? ?? false,
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'] as String) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'invoice_number': invoiceNumber,
      'supplier_name': supplierName,
      'items': items.map((i) => i.toJson()).toList(),
      'total': total,
      'notes': notes,
      'is_deleted': isDeleted,
      'created_at': createdAt.toIso8601String(),
    };
  }

  Map<String, dynamic> toApiJson() {
    return {
      'id': id,
      'invoiceNumber': invoiceNumber,
      'supplierName': supplierName,
      'notes': notes,
      'total': total,
      'items': items.map((i) => i.toJson()).toList(),
    };
  }

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
  final String status;

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

  factory WholesaleOrderModel.fromJson(Map<String, dynamic> json) {
    int ordNum = 0;
    if (json['order_number'] is int) {
      ordNum = json['order_number'] as int;
    } else if (json['order_number'] is String) {
      ordNum = int.tryParse(json['order_number'] as String) ?? 0;
    }

    var itemList = <WholesaleSaleItemModel>[];
    if (json['items'] is List) {
      itemList = (json['items'] as List)
          .map((i) => WholesaleSaleItemModel.fromJson(i as Map<String, dynamic>))
          .toList();
    }

    return WholesaleOrderModel(
      id: json['id'] as String? ?? '',
      orderNumber: ordNum,
      customerName: json['customer_name'] as String? ?? 'Customer',
      customerMobile: json['customer_mobile'] as String? ?? '',
      customerAddress: json['customer_address'] as String?,
      items: itemList,
      total: (json['total'] as num? ?? 0.0).toDouble(),
      notes: json['notes'] as String?,
      status: json['status'] as String? ?? 'pending',
      isDeleted: json['is_deleted'] as bool? ?? false,
      createdAt: json['created_at'] != null
          ? DateTime.tryParse(json['created_at'] as String) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'order_number': orderNumber,
      'customer_name': customerName,
      'customer_mobile': customerMobile,
      'customer_address': customerAddress,
      'items': items.map((i) => i.toJson()).toList(),
      'total': total,
      'notes': notes,
      'status': status,
      'is_deleted': isDeleted,
      'created_at': createdAt.toIso8601String(),
    };
  }

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

  factory WholesaleCategoryModel.fromJson(Map<String, dynamic> json) {
    return WholesaleCategoryModel(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      nameAr: json['name_ar'] as String?,
      nameBn: json['name_bn'] as String?,
      sortOrder: json['sort_order'] as int? ?? 0,
      isActive: json['is_active'] as bool? ?? true,
      imageUrl: json['image_url'] as String?,
      smartSection: json['smart_section'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'name_ar': nameAr,
      'name_bn': nameBn,
      'sort_order': sortOrder,
      'is_active': isActive,
      'image_url': imageUrl,
      'smart_section': smartSection,
    };
  }

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

class WholesaleProfitDetailsModel {
  final String period;
  final String? startDate;
  final String? endDate;
  final int salesCount;
  final double totalSoldItems;
  final double totalSales;
  final double totalPurchaseCost;
  final double netProfit;
  final double profitMarginPercentage;

  WholesaleProfitDetailsModel({
    required this.period,
    this.startDate,
    this.endDate,
    required this.salesCount,
    required this.totalSoldItems,
    required this.totalSales,
    required this.totalPurchaseCost,
    required this.netProfit,
    required this.profitMarginPercentage,
  });

  factory WholesaleProfitDetailsModel.fromJson(Map<String, dynamic> json) {
    final netPrf = (json['netProfit'] as num? ?? json['net_profit'] as num? ?? 0.0).toDouble();
    final totSales = (json['totalSales'] as num? ?? json['total_sales'] as num? ?? 0.0).toDouble();

    double margin = (json['profitMarginPercentage'] as num? ?? json['profit_margin_percentage'] as num? ?? 0.0).toDouble();
    if (margin == 0.0 && totSales > 0) {
      margin = (netPrf / totSales) * 100;
    }

    return WholesaleProfitDetailsModel(
      period: json['period'] as String? ?? 'monthly',
      startDate: json['startDate'] as String? ?? json['start_date'] as String?,
      endDate: json['endDate'] as String? ?? json['end_date'] as String?,
      salesCount: (json['salesCount'] as num? ?? json['sales_count'] as num? ?? 0).toInt(),
      totalSoldItems: (json['totalSoldItems'] as num? ?? json['total_sold_items'] as num? ?? 0.0).toDouble(),
      totalSales: totSales,
      totalPurchaseCost: (json['totalPurchaseCost'] as num? ?? json['total_purchase_cost'] as num? ?? 0.0).toDouble(),
      netProfit: netPrf,
      profitMarginPercentage: margin,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'period': period,
      'startDate': startDate,
      'endDate': endDate,
      'salesCount': salesCount,
      'totalSoldItems': totalSoldItems,
      'totalSales': totalSales,
      'totalPurchaseCost': totalPurchaseCost,
      'netProfit': netProfit,
      'profitMarginPercentage': profitMarginPercentage,
    };
  }
}
