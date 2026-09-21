export '../../../models/price_compare_models.dart';

import '../../../models/price_compare_models.dart';

/// Legacy bridge adapter for UI components
class PriceCompareProduct {
  final String id;
  final String name;
  final String barcode;
  final double salePrice;
  final String? imagePath;
  final List<CompanyPurchaseItem> purchases;
  final PriceCompareProductModel? originalModel;

  PriceCompareProduct({
    required this.id,
    required this.name,
    this.barcode = '',
    required this.salePrice,
    this.imagePath,
    this.purchases = const [],
    this.originalModel,
  });

  factory PriceCompareProduct.fromModel(PriceCompareProductModel model) {
    final purchaseItems = model.history.map((h) {
      DateTime memoDt = DateTime.now();
      if (h.purchaseDate != null) {
        memoDt = DateTime.tryParse(h.purchaseDate!) ?? DateTime.now();
      }
      return CompanyPurchaseItem(
        id: h.id,
        companyName: h.vendorName,
        purchasePrice: h.purchasePrice,
        memoDate: memoDt,
        memoAttachment: h.slipImageUrl ?? h.slipPdfUrl,
        slipImageUrl: h.slipImageUrl,
        slipPdfUrl: h.slipPdfUrl,
        quantity: h.quantity,
        notes: h.notes,
      );
    }).toList();

    // If history is empty and initialEntry exists
    if (purchaseItems.isEmpty && model.initialEntry != null) {
      final h = model.initialEntry!;
      DateTime memoDt = DateTime.now();
      if (h.purchaseDate != null) {
        memoDt = DateTime.tryParse(h.purchaseDate!) ?? DateTime.now();
      }
      purchaseItems.add(
        CompanyPurchaseItem(
          id: h.id,
          companyName: h.vendorName,
          purchasePrice: h.purchasePrice,
          memoDate: memoDt,
          memoAttachment: h.slipImageUrl ?? h.slipPdfUrl,
          slipImageUrl: h.slipImageUrl,
          slipPdfUrl: h.slipPdfUrl,
          quantity: h.quantity,
          notes: h.notes,
        ),
      );
    }

    // If history is empty but vendorBreakdown has entries
    if (purchaseItems.isEmpty && model.analysis?.vendorBreakdown.isNotEmpty == true) {
      for (int i = 0; i < model.analysis!.vendorBreakdown.length; i++) {
        final b = model.analysis!.vendorBreakdown[i];
        purchaseItems.add(
          CompanyPurchaseItem(
            id: 'vb_$i',
            companyName: b.vendorName,
            purchasePrice: b.latestPurchasePrice ?? b.avgPurchasePrice ?? 0.0,
            memoDate: b.latestPurchaseDate != null
                ? (DateTime.tryParse(b.latestPurchaseDate!) ?? DateTime.now())
                : DateTime.now(),
          ),
        );
      }
    }

    return PriceCompareProduct(
      id: model.id,
      name: model.productName,
      barcode: model.barcode ?? '',
      salePrice: model.sellingPrice,
      imagePath: model.productImageUrl,
      purchases: purchaseItems,
      originalModel: model,
    );
  }

  double? get lowestPurchasePrice {
    if (originalModel?.lowestPurchasePrice != null) {
      return originalModel!.lowestPurchasePrice;
    }
    if (purchases.isEmpty) return null;
    return purchases.map((p) => p.purchasePrice).reduce((a, b) => a < b ? a : b);
  }

  double? get highestPurchasePrice {
    if (originalModel?.highestPurchasePrice != null) {
      return originalModel!.highestPurchasePrice;
    }
    if (purchases.isEmpty) return null;
    return purchases.map((p) => p.purchasePrice).reduce((a, b) => a > b ? a : b);
  }

  double? get averagePurchasePrice => originalModel?.averagePurchasePrice;
  double? get latestPurchasePrice => originalModel?.latestPurchasePrice;
  double? get currentMargin => originalModel?.currentMargin;
  double? get currentMarginPercentage => originalModel?.currentMarginPercentage;
  String? get priceTrend => originalModel?.priceTrend;
}

class CompanyPurchaseItem {
  final String id;
  final String companyName;
  final double purchasePrice;
  final DateTime memoDate;
  final String? memoAttachment;
  final String? slipImageUrl;
  final String? slipPdfUrl;
  final double? quantity;
  final String? notes;

  CompanyPurchaseItem({
    required this.id,
    required this.companyName,
    required this.purchasePrice,
    required this.memoDate,
    this.memoAttachment,
    this.slipImageUrl,
    this.slipPdfUrl,
    this.quantity,
    this.notes,
  });
}
