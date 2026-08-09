
class VisitRecord {
  final String id;
  final String? userId;
  final String customerName;
  final String shopName;
  final double amount;
  final String paymentType;
  final double cashAmount;
  final double bankAmount;
  final double creditAmount;
  final String notes;
  final String photoPath; // Maps to photoUrl from backend
  final DateTime dateTime;
  final String shopLocation;
  final String salesmanName;

  const VisitRecord({
    required this.id,
    this.userId,
    required this.customerName,
    required this.shopName,
    required this.amount,
    required this.paymentType,
    required this.cashAmount,
    required this.bankAmount,
    required this.creditAmount,
    required this.notes,
    required this.photoPath,
    required this.dateTime,
    required this.shopLocation,
    required this.salesmanName,
  });

  factory VisitRecord.fromJson(Map<String, dynamic> json) {
    DateTime parsedDate = DateTime.now();
    String? rawDateStr = json['visitDate']?.toString() ??
        json['visit_date']?.toString() ??
        json['dateTime']?.toString() ??
        json['date_time']?.toString();

    if (rawDateStr != null && rawDateStr.trim().isNotEmpty) {
      String cleanStr = rawDateStr.trim();
      if (!cleanStr.endsWith('Z') && !cleanStr.contains('+') && !cleanStr.contains('-')) {
        cleanStr = '${cleanStr.replaceAll(' ', 'T')}Z';
      }
      parsedDate = DateTime.tryParse(cleanStr)?.toLocal() ?? DateTime.now();
    }

    return VisitRecord(
      id: json['id']?.toString() ?? '',
      userId: json['userId']?.toString() ?? json['user_id']?.toString(),
      customerName: json['customerName']?.toString() ?? json['customer_name']?.toString() ?? '',
      shopName: json['shopName']?.toString() ?? json['shop_name']?.toString() ?? '',
      amount: (json['amount'] as num? ?? 0.0).toDouble(),
      paymentType: (json['paymentType']?.toString() ?? json['payment_type']?.toString() ?? 'Cash') == 'Split'
          ? 'Partial'
          : (json['paymentType']?.toString() ?? json['payment_type']?.toString() ?? 'Cash'),
      cashAmount: (json['cashAmount'] as num? ?? json['cash_amount'] as num? ?? 0.0).toDouble(),
      bankAmount: (json['bankAmount'] as num? ?? json['bank_amount'] as num? ?? 0.0).toDouble(),
      creditAmount: (json['creditAmount'] as num? ?? json['credit_amount'] as num? ?? 0.0).toDouble(),
      notes: json['notes']?.toString() ?? '',
      photoPath: json['photoUrl']?.toString() ?? json['photo_url']?.toString() ?? '',
      dateTime: parsedDate,
      shopLocation: json['shopLocation']?.toString() ?? json['shop_location']?.toString() ?? '',
      salesmanName: json['salesmanName']?.toString() ?? json['salesman_name']?.toString() ?? 'Mohammed',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'customerName': customerName,
      'shopName': shopName,
      'amount': amount,
      'paymentType': paymentType,
      'cashAmount': cashAmount,
      'bankAmount': bankAmount,
      'creditAmount': creditAmount,
      'notes': notes,
      'shopLocation': shopLocation,
      'salesmanName': salesmanName,
    };
  }

  VisitRecord copyWith({
    String? id,
    String? userId,
    String? customerName,
    String? shopName,
    double? amount,
    String? paymentType,
    double? cashAmount,
    double? bankAmount,
    double? creditAmount,
    String? notes,
    String? photoPath,
    DateTime? dateTime,
    String? shopLocation,
    String? salesmanName,
  }) {
    return VisitRecord(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      customerName: customerName ?? this.customerName,
      shopName: shopName ?? this.shopName,
      amount: amount ?? this.amount,
      paymentType: paymentType ?? this.paymentType,
      cashAmount: cashAmount ?? this.cashAmount,
      bankAmount: bankAmount ?? this.bankAmount,
      creditAmount: creditAmount ?? this.creditAmount,
      notes: notes ?? this.notes,
      photoPath: photoPath ?? this.photoPath,
      dateTime: dateTime ?? this.dateTime,
      shopLocation: shopLocation ?? this.shopLocation,
      salesmanName: salesmanName ?? this.salesmanName,
    );
  }
}

class DailyVisitSummaryMetrics {
  final String date;
  final int totalVisits;
  final int uniqueShops;
  final double totalReportedSale;
  final double cashTotal;
  final double bankTotal;
  final double creditTotal;
  final int zeroSaleCount;
  final String firstVisitTime;
  final String lastVisitTime;
  final String avgTimeBetweenShops;

  const DailyVisitSummaryMetrics({
    required this.date,
    required this.totalVisits,
    required this.uniqueShops,
    required this.totalReportedSale,
    required this.cashTotal,
    required this.bankTotal,
    required this.creditTotal,
    required this.zeroSaleCount,
    required this.firstVisitTime,
    required this.lastVisitTime,
    required this.avgTimeBetweenShops,
  });

  factory DailyVisitSummaryMetrics.fromJson(Map<String, dynamic> json) {
    return DailyVisitSummaryMetrics(
      date: json['date']?.toString() ?? '',
      totalVisits: json['totalVisits'] as int? ?? json['total_visits'] as int? ?? 0,
      uniqueShops: json['uniqueShops'] as int? ?? json['unique_shops'] as int? ?? 0,
      totalReportedSale: (json['totalAmount'] as num? ?? json['totalReportedSale'] as num? ?? json['total_reported_sale'] as num? ?? 0.0).toDouble(),
      cashTotal: (json['totalCash'] as num? ?? json['cashTotal'] as num? ?? json['cash_total'] as num? ?? 0.0).toDouble(),
      bankTotal: (json['totalBank'] as num? ?? json['bankTotal'] as num? ?? json['bank_total'] as num? ?? 0.0).toDouble(),
      creditTotal: (json['totalCredit'] as num? ?? json['creditTotal'] as num? ?? json['credit_total'] as num? ?? 0.0).toDouble(),
      zeroSaleCount: json['zeroSaleCount'] as int? ?? json['zero_sale_count'] as int? ?? 0,
      firstVisitTime: json['firstVisitTime']?.toString() ?? json['first_visit_time']?.toString() ?? '--:--',
      lastVisitTime: json['lastVisitTime']?.toString() ?? json['last_visit_time']?.toString() ?? '--:--',
      avgTimeBetweenShops: json['avgTimeBetweenShops']?.toString() ?? json['avg_time_between_shops']?.toString() ?? 'N/A',
    );
  }
}

class SalesmanPerformanceBreakdown {
  final String salesmanName;
  final int totalVisits;
  final int totalClosedShops;
  final double averageSaleValue;
  final double productivityRate;
  final double totalReportedSale;
  final double cashTotal;
  final double bankTotal;
  final double creditTotal;
  final int zeroSaleCount;

  const SalesmanPerformanceBreakdown({
    required this.salesmanName,
    required this.totalVisits,
    required this.totalClosedShops,
    required this.averageSaleValue,
    required this.productivityRate,
    required this.totalReportedSale,
    required this.cashTotal,
    required this.bankTotal,
    required this.creditTotal,
    required this.zeroSaleCount,
  });

  factory SalesmanPerformanceBreakdown.fromJson(Map<String, dynamic> json) {
    return SalesmanPerformanceBreakdown(
      salesmanName: json['salesmanName']?.toString() ?? json['salesman_name']?.toString() ?? '',
      totalVisits: json['visitCount'] as int? ?? json['totalVisits'] as int? ?? json['total_visits'] as int? ?? 0,
      totalClosedShops: json['totalClosedShops'] as int? ?? json['total_closed_shops'] as int? ?? 0,
      averageSaleValue: (json['averageSaleValue'] as num? ?? json['average_sale_value'] as num? ?? 0.0).toDouble(),
      productivityRate: (json['productivityRate'] as num? ?? json['productivity_rate'] as num? ?? 0.0).toDouble(),
      totalReportedSale: (json['totalAmount'] as num? ?? json['totalReportedSale'] as num? ?? json['total_reported_sale'] as num? ?? 0.0).toDouble(),
      cashTotal: (json['totalCash'] as num? ?? json['cashTotal'] as num? ?? json['cash_total'] as num? ?? 0.0).toDouble(),
      bankTotal: (json['totalBank'] as num? ?? json['bankTotal'] as num? ?? json['bank_total'] as num? ?? 0.0).toDouble(),
      creditTotal: (json['totalCredit'] as num? ?? json['creditTotal'] as num? ?? json['credit_total'] as num? ?? 0.0).toDouble(),
      zeroSaleCount: json['zeroSaleCount'] as int? ?? json['zero_sale_count'] as int? ?? 0,
    );
  }
}

class SalesCustomerModel {
  final String id;
  final String? userId;
  final String name;
  final String? shopName;
  final String mobile;
  final String? address;
  final String? shopLocation;
  final String? notes;
  final bool isActive;
  final bool isDeleted;
  final DateTime createdAt;

  const SalesCustomerModel({
    required this.id,
    this.userId,
    required this.name,
    this.shopName,
    required this.mobile,
    this.address,
    this.shopLocation,
    this.notes,
    this.isActive = true,
    this.isDeleted = false,
    required this.createdAt,
  });

  factory SalesCustomerModel.fromJson(Map<String, dynamic> json) {
    return SalesCustomerModel(
      id: json['id']?.toString() ?? '',
      userId: json['userId']?.toString() ?? json['user_id']?.toString(),
      name: json['name']?.toString() ?? '',
      shopName: json['shopName']?.toString() ?? json['shop_name']?.toString(),
      mobile: json['mobile']?.toString() ?? '',
      address: json['address']?.toString() ?? json['address_line']?.toString(),
      shopLocation: json['shopLocation']?.toString() ?? json['shop_location']?.toString(),
      notes: json['notes']?.toString(),
      isActive: json['isActive'] as bool? ?? json['is_active'] as bool? ?? true,
      isDeleted: json['isDeleted'] as bool? ?? json['is_deleted'] as bool? ?? false,
      createdAt: json['createdAt'] != null
          ? DateTime.tryParse(json['createdAt'] as String) ?? DateTime.now()
          : (json['created_at'] != null ? DateTime.tryParse(json['created_at'] as String) ?? DateTime.now() : DateTime.now()),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'shopName': shopName,
      'mobile': mobile,
      'address': address,
      'shopLocation': shopLocation,
      'notes': notes,
    };
  }
}
