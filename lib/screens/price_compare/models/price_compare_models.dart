class PriceCompareProduct {
  final String id;
  final String name;
  final String barcode;
  final double salePrice;
  final String? imagePath;
  final List<CompanyPurchaseItem> purchases;

  PriceCompareProduct({
    required this.id,
    required this.name,
    this.barcode = '',
    required this.salePrice,
    this.imagePath,
    this.purchases = const [],
  });

  double? get lowestPurchasePrice {
    if (purchases.isEmpty) return null;
    return purchases.map((p) => p.purchasePrice).reduce((a, b) => a < b ? a : b);
  }

  double? get highestPurchasePrice {
    if (purchases.isEmpty) return null;
    return purchases.map((p) => p.purchasePrice).reduce((a, b) => a > b ? a : b);
  }
}

class CompanyPurchaseItem {
  final String id;
  final String companyName;
  final double purchasePrice;
  final DateTime memoDate;
  final String? memoAttachment;

  CompanyPurchaseItem({
    required this.id,
    required this.companyName,
    required this.purchasePrice,
    required this.memoDate,
    this.memoAttachment,
  });
}
