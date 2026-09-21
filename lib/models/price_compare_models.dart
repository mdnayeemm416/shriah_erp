class PriceCompareProductModel {
  final String id;
  final String productName;
  final double sellingPrice;
  final String? productImageUrl;
  final String? productPdfUrl;
  final String? slipImageUrl;
  final String? slipPdfUrl;
  final String? imageUrl;
  final String? pdfUrl;
  final String? barcode;
  final String? category;
  final String? erpProductId;
  final String? notes;
  final String? createdAt;
  final String? updatedAt;
  final PriceCompareAnalysisModel? analysis;
  final List<PriceCompareEntryModel> history;
  final PriceCompareEntryModel? initialEntry;

  PriceCompareProductModel({
    required this.id,
    required this.productName,
    this.sellingPrice = 0.0,
    this.productImageUrl,
    this.productPdfUrl,
    this.slipImageUrl,
    this.slipPdfUrl,
    this.imageUrl,
    this.pdfUrl,
    this.barcode,
    this.category,
    this.erpProductId,
    this.notes,
    this.createdAt,
    this.updatedAt,
    this.analysis,
    this.history = const [],
    this.initialEntry,
  });

  // Convenience getters for UI compatibility
  String get name => productName;
  double get salePrice => sellingPrice;
  String? get imagePath => productImageUrl;

  double? get lowestPurchasePrice =>
      analysis?.minPurchasePrice ??
      (history.isNotEmpty
          ? history.map((e) => e.purchasePrice).reduce((a, b) => a < b ? a : b)
          : null);

  double? get highestPurchasePrice =>
      analysis?.maxPurchasePrice ??
      (history.isNotEmpty
          ? history.map((e) => e.purchasePrice).reduce((a, b) => a > b ? a : b)
          : null);

  double? get averagePurchasePrice => analysis?.avgPurchasePrice;
  double? get latestPurchasePrice => analysis?.latestPurchasePrice;
  double? get currentMargin => analysis?.currentMargin;
  double? get currentMarginPercentage => analysis?.currentMarginPercentage;
  String? get priceTrend => analysis?.priceTrend;

  factory PriceCompareProductModel.fromJson(Map<String, dynamic> json) {
    // History entries
    final historyList = <PriceCompareEntryModel>[];
    if (json['history'] is List) {
      for (final item in json['history']) {
        if (item is Map<String, dynamic>) {
          historyList.add(PriceCompareEntryModel.fromJson(item));
        }
      }
    }

    // Analysis
    PriceCompareAnalysisModel? analysis;
    if (json['analysis'] is Map<String, dynamic>) {
      analysis = PriceCompareAnalysisModel.fromJson(
        json['analysis'] as Map<String, dynamic>,
      );
    }

    // Initial entry (if returned by POST /price-compare)
    PriceCompareEntryModel? initialEntry;
    if (json['initialEntry'] is Map<String, dynamic>) {
      initialEntry = PriceCompareEntryModel.fromJson(
        json['initialEntry'] as Map<String, dynamic>,
      );
    }

    final prodImg =
        json['productImage']?.toString() ??
        json['productImageUrl']?.toString() ??
        json['imageUrl']?.toString() ??
        json['image_url']?.toString();
    final prodPdf =
        json['productPdf']?.toString() ??
        json['productPdfUrl']?.toString() ??
        json['pdfUrl']?.toString();
    final slipImg =
        json['slipImage']?.toString() ??
        json['slipImageUrl']?.toString();
    final slipPdf =
        json['slipPdf']?.toString() ??
        json['slipPdfUrl']?.toString();

    // If history is empty and initialEntry was returned, add it
    if (historyList.isEmpty && initialEntry != null) {
      historyList.add(initialEntry);
    }

    return PriceCompareProductModel(
      id: json['id']?.toString() ?? '',
      productName:
          json['productName']?.toString() ?? json['name']?.toString() ?? '',
      sellingPrice:
          (json['sellingPrice'] as num? ?? json['sale_price'] as num? ?? 0.0)
              .toDouble(),
      productImageUrl: prodImg,
      productPdfUrl: prodPdf,
      slipImageUrl: slipImg,
      slipPdfUrl: slipPdf,
      imageUrl: prodImg,
      pdfUrl: prodPdf,
      barcode: json['barcode']?.toString(),
      category: json['category']?.toString() ?? json['brand']?.toString(),
      erpProductId: json['erpProductId']?.toString(),
      notes: json['notes']?.toString(),
      createdAt: json['createdAt']?.toString(),
      updatedAt: json['updatedAt']?.toString(),
      analysis: analysis,
      history: historyList,
      initialEntry: initialEntry,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'productName': productName,
      'sellingPrice': sellingPrice,
      if (productImageUrl != null) 'productImage': productImageUrl,
      if (productPdfUrl != null) 'productPdf': productPdfUrl,
      if (slipImageUrl != null) 'slipImage': slipImageUrl,
      if (slipPdfUrl != null) 'slipPdf': slipPdfUrl,
      'barcode': barcode,
      'category': category,
      'erpProductId': erpProductId,
      'notes': notes,
      if (createdAt != null) 'createdAt': createdAt,
      if (updatedAt != null) 'updatedAt': updatedAt,
      if (analysis != null) 'analysis': analysis!.toJson(),
      'history': history.map((e) => e.toJson()).toList(),
      if (initialEntry != null) 'initialEntry': initialEntry!.toJson(),
    };
  }
}

class PriceCompareAnalysisModel {
  final int totalPurchases;
  final int vendorCount;
  final List<String> uniqueVendors;
  final double? minPurchasePrice;
  final double? maxPurchasePrice;
  final double? avgPurchasePrice;
  final double? latestPurchasePrice;
  final double? latestSellingPrice;
  final double? currentMargin;
  final double? currentMarginPercentage;
  final String? priceTrend;
  final PriceCompareEntryModel? latestPurchase;
  final PriceCompareEntryModel? lowestPurchase;
  final PriceCompareEntryModel? highestPurchase;
  final List<PriceCompareVendorBreakdownModel> vendorBreakdown;

  PriceCompareAnalysisModel({
    this.totalPurchases = 0,
    this.vendorCount = 0,
    this.uniqueVendors = const [],
    this.minPurchasePrice,
    this.maxPurchasePrice,
    this.avgPurchasePrice,
    this.latestPurchasePrice,
    this.latestSellingPrice,
    this.currentMargin,
    this.currentMarginPercentage,
    this.priceTrend,
    this.latestPurchase,
    this.lowestPurchase,
    this.highestPurchase,
    this.vendorBreakdown = const [],
  });

  factory PriceCompareAnalysisModel.fromJson(Map<String, dynamic> json) {
    final vendors = <String>[];
    if (json['uniqueVendors'] is List) {
      for (final v in json['uniqueVendors']) {
        if (v != null) vendors.add(v.toString());
      }
    }

    final breakdown = <PriceCompareVendorBreakdownModel>[];
    if (json['vendorBreakdown'] is List) {
      for (final b in json['vendorBreakdown']) {
        if (b is Map<String, dynamic>) {
          breakdown.add(PriceCompareVendorBreakdownModel.fromJson(b));
        }
      }
    }

    return PriceCompareAnalysisModel(
      totalPurchases: (json['totalPurchases'] as num? ?? 0).toInt(),
      vendorCount: (json['vendorCount'] as num? ?? 0).toInt(),
      uniqueVendors: vendors,
      minPurchasePrice: (json['minPurchasePrice'] as num?)?.toDouble(),
      maxPurchasePrice: (json['maxPurchasePrice'] as num?)?.toDouble(),
      avgPurchasePrice: (json['avgPurchasePrice'] as num?)?.toDouble(),
      latestPurchasePrice: (json['latestPurchasePrice'] as num?)?.toDouble(),
      latestSellingPrice: (json['latestSellingPrice'] as num?)?.toDouble(),
      currentMargin: (json['currentMargin'] as num?)?.toDouble(),
      currentMarginPercentage: (json['currentMarginPercentage'] as num?)
          ?.toDouble(),
      priceTrend: json['priceTrend']?.toString(),
      latestPurchase: json['latestPurchase'] is Map<String, dynamic>
          ? PriceCompareEntryModel.fromJson(
              json['latestPurchase'] as Map<String, dynamic>,
            )
          : null,
      lowestPurchase: json['lowestPurchase'] is Map<String, dynamic>
          ? PriceCompareEntryModel.fromJson(
              json['lowestPurchase'] as Map<String, dynamic>,
            )
          : null,
      highestPurchase: json['highestPurchase'] is Map<String, dynamic>
          ? PriceCompareEntryModel.fromJson(
              json['highestPurchase'] as Map<String, dynamic>,
            )
          : null,
      vendorBreakdown: breakdown,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'totalPurchases': totalPurchases,
      'vendorCount': vendorCount,
      'uniqueVendors': uniqueVendors,
      'minPurchasePrice': minPurchasePrice,
      'maxPurchasePrice': maxPurchasePrice,
      'avgPurchasePrice': avgPurchasePrice,
      'latestPurchasePrice': latestPurchasePrice,
      'latestSellingPrice': latestSellingPrice,
      'currentMargin': currentMargin,
      'currentMarginPercentage': currentMarginPercentage,
      'priceTrend': priceTrend,
      if (latestPurchase != null) 'latestPurchase': latestPurchase!.toJson(),
      if (lowestPurchase != null) 'lowestPurchase': lowestPurchase!.toJson(),
      if (highestPurchase != null) 'highestPurchase': highestPurchase!.toJson(),
      'vendorBreakdown': vendorBreakdown.map((b) => b.toJson()).toList(),
    };
  }
}

class PriceCompareVendorBreakdownModel {
  final String vendorName;
  final int purchaseCount;
  final double? minPurchasePrice;
  final double? maxPurchasePrice;
  final double? avgPurchasePrice;
  final double? latestPurchasePrice;
  final String? latestPurchaseDate;

  PriceCompareVendorBreakdownModel({
    required this.vendorName,
    this.purchaseCount = 0,
    this.minPurchasePrice,
    this.maxPurchasePrice,
    this.avgPurchasePrice,
    this.latestPurchasePrice,
    this.latestPurchaseDate,
  });

  factory PriceCompareVendorBreakdownModel.fromJson(Map<String, dynamic> json) {
    return PriceCompareVendorBreakdownModel(
      vendorName: json['vendorName']?.toString() ?? '',
      purchaseCount: (json['purchaseCount'] as num? ?? 0).toInt(),
      minPurchasePrice: (json['minPurchasePrice'] as num?)?.toDouble(),
      maxPurchasePrice: (json['maxPurchasePrice'] as num?)?.toDouble(),
      avgPurchasePrice: (json['avgPurchasePrice'] as num?)?.toDouble(),
      latestPurchasePrice: (json['latestPurchasePrice'] as num?)?.toDouble(),
      latestPurchaseDate: json['latestPurchaseDate']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'vendorName': vendorName,
      'purchaseCount': purchaseCount,
      'minPurchasePrice': minPurchasePrice,
      'maxPurchasePrice': maxPurchasePrice,
      'avgPurchasePrice': avgPurchasePrice,
      'latestPurchasePrice': latestPurchasePrice,
      'latestPurchaseDate': latestPurchaseDate,
    };
  }
}

class PriceCompareEntryModel {
  final String id;
  final String productId;
  final String? productName;
  final String? productImageUrl;
  final String? productPdfUrl;
  final String? barcode;
  final String? category;
  final String? erpProductId;
  final String vendorName;
  final double purchasePrice;
  final double? sellingPrice;
  final double? marginAmount;
  final double? marginPercentage;
  final String? purchaseDate;
  final double? quantity;
  final String? slipImageUrl;
  final String? slipPdfUrl;
  final String? imageUrl;
  final String? pdfUrl;
  final String? notes;
  final String? createdAt;
  final String? marketShop;
  final double? offerPrice;

  PriceCompareEntryModel({
    required this.id,
    required this.productId,
    this.productName,
    this.productImageUrl,
    this.productPdfUrl,
    this.barcode,
    this.category,
    this.erpProductId,
    required this.vendorName,
    required this.purchasePrice,
    this.sellingPrice,
    this.marginAmount,
    this.marginPercentage,
    this.purchaseDate,
    this.quantity,
    this.slipImageUrl,
    this.slipPdfUrl,
    this.imageUrl,
    this.pdfUrl,
    this.notes,
    this.createdAt,
    this.marketShop,
    this.offerPrice,
  });

  factory PriceCompareEntryModel.fromJson(Map<String, dynamic> json) {
    final sImg =
        json['slipImage']?.toString() ??
        json['slipImageUrl']?.toString() ??
        json['imageUrl']?.toString();
    final sPdf =
        json['slipPdf']?.toString() ??
        json['slipPdfUrl']?.toString() ??
        json['pdfUrl']?.toString();
    final pImg =
        json['productImage']?.toString() ??
        json['productImageUrl']?.toString();
    final pPdf =
        json['productPdf']?.toString() ??
        json['productPdfUrl']?.toString();

    final purchasePrice = (json['purchasePrice'] as num? ??
            json['purchase_price'] as num? ??
            0.0)
        .toDouble();
    final sellingPrice =
        (json['sellingPrice'] as num? ?? json['selling_price'] as num?)
            ?.toDouble();

    final marginAmt = (json['marginAmount'] as num? ??
            json['margin_amount'] as num?)
        ?.toDouble() ??
        (sellingPrice != null ? (sellingPrice - purchasePrice) : null);

    final marginPct = (json['marginPercentage'] as num? ??
            json['margin_percentage'] as num?)
        ?.toDouble() ??
        (sellingPrice != null && sellingPrice > 0 && marginAmt != null
            ? ((marginAmt / sellingPrice) * 100)
            : null);

    return PriceCompareEntryModel(
      id: json['id']?.toString() ?? '',
      productId:
          json['productId']?.toString() ?? json['product_id']?.toString() ?? '',
      productName: json['productName']?.toString(),
      productImageUrl: pImg,
      productPdfUrl: pPdf,
      barcode: json['barcode']?.toString(),
      category: json['category']?.toString(),
      erpProductId: json['erpProductId']?.toString(),
      vendorName:
          json['vendorName']?.toString() ?? json['supplier']?.toString() ?? '',
      purchasePrice: purchasePrice,
      sellingPrice: sellingPrice,
      marginAmount: marginAmt,
      marginPercentage: marginPct,
      purchaseDate:
          json['purchaseDate']?.toString() ?? json['record_date']?.toString(),
      quantity: (json['quantity'] as num?)?.toDouble() ?? 1.0,
      slipImageUrl: sImg,
      slipPdfUrl: sPdf,
      imageUrl: sImg,
      pdfUrl: sPdf,
      notes: json['notes']?.toString() ?? json['note']?.toString(),
      createdAt: json['createdAt']?.toString(),
      marketShop:
          json['marketShop']?.toString() ?? json['market_shop']?.toString(),
      offerPrice: (json['offerPrice'] as num? ?? json['offer_price'] as num?)
          ?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'productId': productId,
      if (productName != null) 'productName': productName,
      if (productImageUrl != null) 'productImage': productImageUrl,
      if (productPdfUrl != null) 'productPdf': productPdfUrl,
      if (barcode != null) 'barcode': barcode,
      if (category != null) 'category': category,
      if (erpProductId != null) 'erpProductId': erpProductId,
      'vendorName': vendorName,
      'purchasePrice': purchasePrice,
      if (sellingPrice != null) 'sellingPrice': sellingPrice,
      if (marginAmount != null) 'marginAmount': marginAmount,
      if (marginPercentage != null) 'marginPercentage': marginPercentage,
      if (purchaseDate != null) 'purchaseDate': purchaseDate,
      if (quantity != null) 'quantity': quantity,
      if (slipImageUrl != null) 'slipImage': slipImageUrl,
      if (slipPdfUrl != null) 'slipPdf': slipPdfUrl,
      if (notes != null) 'notes': notes,
      if (createdAt != null) 'createdAt': createdAt,
    };
  }
}

class PriceCompareVendorModel {
  final String vendorName;
  final int totalEntries;
  final int totalProducts;
  final String? latestPurchaseDate;
  final double? minPrice;
  final double? maxPrice;
  final int? erpPurchasesCount;
  final String? source;

  PriceCompareVendorModel({
    required this.vendorName,
    this.totalEntries = 0,
    this.totalProducts = 0,
    this.latestPurchaseDate,
    this.minPrice,
    this.maxPrice,
    this.erpPurchasesCount,
    this.source,
  });

  factory PriceCompareVendorModel.fromJson(Map<String, dynamic> json) {
    return PriceCompareVendorModel(
      vendorName: json['vendorName']?.toString() ?? '',
      totalEntries: (json['totalEntries'] as num? ?? 0).toInt(),
      totalProducts: (json['totalProducts'] as num? ?? 0).toInt(),
      latestPurchaseDate: json['latestPurchaseDate']?.toString(),
      minPrice: (json['minPrice'] as num?)?.toDouble(),
      maxPrice: (json['maxPrice'] as num?)?.toDouble(),
      erpPurchasesCount: (json['erpPurchasesCount'] as num?)?.toInt(),
      source: json['source']?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'vendorName': vendorName,
      'totalEntries': totalEntries,
      'totalProducts': totalProducts,
      'latestPurchaseDate': latestPurchaseDate,
      'minPrice': minPrice,
      'maxPrice': maxPrice,
      'erpPurchasesCount': erpPurchasesCount,
      'source': source,
    };
  }
}

/// Helper parameters for creating/updating a comparison product
class CreatePriceCompareProductParams {
  final String? id;
  final String productName;
  final double sellingPrice;
  final String? productImagePath;
  final String? productPdfPath;
  final String? erpProductId;
  final String? category;
  final String? barcode;
  final String? notes;

  // Optional initial vendor buy
  final String? vendorName;
  final double? purchasePrice;
  final String? purchaseDate; // YYYY-MM-DD
  final double? quantity;
  final String? slipImagePath;
  final String? slipPdfPath;

  // Explicit Removal Flags (Option A: Clears asset when true)
  final bool? removeProductImage;
  final bool? removeProductPdf;
  final bool? removeSlipImage;
  final bool? removeSlipPdf;

  CreatePriceCompareProductParams({
    this.id,
    required this.productName,
    required this.sellingPrice,
    this.productImagePath,
    this.productPdfPath,
    this.erpProductId,
    this.category,
    this.barcode,
    this.notes,
    this.vendorName,
    this.purchasePrice,
    this.purchaseDate,
    this.quantity,
    this.slipImagePath,
    this.slipPdfPath,
    this.removeProductImage,
    this.removeProductPdf,
    this.removeSlipImage,
    this.removeSlipPdf,
  });
}

class CreatePriceCompareEntryParams {
  final String productId;
  final String vendorName;
  final double purchasePrice;
  final String purchaseDate; // YYYY-MM-DD
  final double? sellingPrice;
  final double? quantity;
  final String? slipImagePath;
  final String? slipPdfPath;
  final String? notes;
  final String? marketShop;
  final double? offerPrice;

  // Explicit Removal Flags (Option A: Clears asset when true)
  final bool? removeSlipImage;
  final bool? removeSlipPdf;

  CreatePriceCompareEntryParams({
    required this.productId,
    required this.vendorName,
    required this.purchasePrice,
    required this.purchaseDate,
    this.sellingPrice,
    this.quantity,
    this.slipImagePath,
    this.slipPdfPath,
    this.notes,
    this.marketShop,
    this.offerPrice,
    this.removeSlipImage,
    this.removeSlipPdf,
  });
}
