import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:uuid/uuid.dart';
import '../../models/price_compare_models.dart';
import '../../repositories/price_compare_repository.dart';

class PriceCompareState {
  final bool loading;
  final List<PriceCompareProductModel> products;
  final PriceCompareProductModel? selectedProduct;
  final List<PriceCompareRecordModel> records; // raw list matching product
  final List<PriceCompareRecordModel> filteredRecords; // filtered list
  final List<String> suppliers;
  
  // Computed price compare stats
  final double lowestPrice;
  final double highestPrice;
  final double averagePrice;
  final double latestPrice;
  final double deltaPercentage; // Variation delta percentage

  // Filters
  final String filterPreset; // 'today' | 'week' | 'month' | 'custom' | 'all'
  final DateTime? fromDate;
  final DateTime? toDate;
  final String? filterSupplier;

  PriceCompareState({
    this.loading = false,
    required this.products,
    this.selectedProduct,
    required this.records,
    required this.filteredRecords,
    required this.suppliers,
    this.lowestPrice = 0.0,
    this.highestPrice = 0.0,
    this.averagePrice = 0.0,
    this.latestPrice = 0.0,
    this.deltaPercentage = 0.0,
    this.filterPreset = 'all',
    this.fromDate,
    this.toDate,
    this.filterSupplier,
  });

  PriceCompareState copyWith({
    bool? loading,
    List<PriceCompareProductModel>? products,
    PriceCompareProductModel? selectedProduct,
    List<PriceCompareRecordModel>? records,
    List<PriceCompareRecordModel>? filteredRecords,
    List<String>? suppliers,
    double? lowestPrice,
    double? highestPrice,
    double? averagePrice,
    double? latestPrice,
    double? deltaPercentage,
    String? filterPreset,
    DateTime? fromDate,
    DateTime? toDate,
    String? filterSupplier,
  }) {
    return PriceCompareState(
      loading: loading ?? this.loading,
      products: products ?? this.products,
      selectedProduct: selectedProduct ?? this.selectedProduct,
      records: records ?? this.records,
      filteredRecords: filteredRecords ?? this.filteredRecords,
      suppliers: suppliers ?? this.suppliers,
      lowestPrice: lowestPrice ?? this.lowestPrice,
      highestPrice: highestPrice ?? this.highestPrice,
      averagePrice: averagePrice ?? this.averagePrice,
      latestPrice: latestPrice ?? this.latestPrice,
      deltaPercentage: deltaPercentage ?? this.deltaPercentage,
      filterPreset: filterPreset ?? this.filterPreset,
      fromDate: fromDate ?? this.fromDate,
      toDate: toDate ?? this.toDate,
      filterSupplier: filterSupplier ?? this.filterSupplier,
    );
  }
}

class PriceCompareCubit extends Cubit<PriceCompareState> {
  final PriceCompareRepository _compareRepo;

  PriceCompareCubit({
    required PriceCompareRepository compareRepo,
  })  : _compareRepo = compareRepo,
        super(PriceCompareState(
          products: [],
          records: [],
          filteredRecords: [],
          suppliers: [],
        ));

  Future<void> loadProducts() async {
    emit(state.copyWith(loading: true));
    try {
      final list = await _compareRepo.getProducts();
      final suppliers = await _compareRepo.listSuppliers();
      emit(state.copyWith(
        loading: false,
        products: list,
        suppliers: suppliers,
      ));
    } catch (_) {
      emit(state.copyWith(loading: false));
    }
  }

  Future<void> selectProduct(PriceCompareProductModel? product) async {
    if (product == null) {
      emit(state.copyWith(selectedProduct: null, records: [], filteredRecords: []));
      return;
    }
    emit(state.copyWith(loading: true, selectedProduct: product));
    try {
      final records = await _compareRepo.getRecords(product.id);
      emit(state.copyWith(loading: false, records: records));
      _computeAndFilter();
    } catch (_) {
      emit(state.copyWith(loading: false));
    }
  }

  Future<void> scanBarcode(String barcode) async {
    emit(state.copyWith(loading: true));
    try {
      final matched = await _compareRepo.getProductByBarcode(barcode);
      emit(state.copyWith(loading: false));
      if (matched != null) {
        selectProduct(matched);
      }
    } catch (_) {
      emit(state.copyWith(loading: false));
    }
  }

  void changeFilters({
    String? preset,
    DateTime? from,
    DateTime? to,
    String? supplier,
  }) {
    emit(state.copyWith(
      filterPreset: preset ?? state.filterPreset,
      fromDate: from ?? state.fromDate,
      toDate: to ?? state.toDate,
      filterSupplier: supplier == 'all' ? null : (supplier ?? state.filterSupplier),
    ));
    _computeAndFilter();
  }

  void _computeAndFilter() {
    if (state.selectedProduct == null) return;
    
    final all = state.records;
    
    // Filter records
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);

    final filtered = all.where((r) {
      if (state.filterSupplier != null && r.supplier != state.filterSupplier) {
        return false;
      }

      if (state.filterPreset == 'all') return true;
      if (state.filterPreset == 'custom') {
        if (state.fromDate == null || state.toDate == null) return true;
        final rStr = r.recordDate.toIso8601String().split('T')[0];
        final fStr = state.fromDate!.toIso8601String().split('T')[0];
        final tStr = state.toDate!.toIso8601String().split('T')[0];
        return rStr.compareTo(fStr) >= 0 && rStr.compareTo(tStr) <= 0;
      }

      DateTime start = today;
      if (state.filterPreset == 'today') {
        start = today;
      } else if (state.filterPreset == 'week') {
        start = today.subtract(const Duration(days: 7));
      } else if (state.filterPreset == 'month') {
        start = DateTime(now.year, now.month, 1);
      }

      return r.recordDate.isAfter(start) || r.recordDate.isAtSameMomentAs(start);
    }).toList();

    // Compute stats
    if (filtered.isEmpty) {
      emit(state.copyWith(
        filteredRecords: filtered,
        lowestPrice: 0.0,
        highestPrice: 0.0,
        averagePrice: 0.0,
        latestPrice: 0.0,
        deltaPercentage: 0.0,
      ));
      return;
    }

    double min = double.infinity;
    double max = 0.0;
    double sum = 0.0;

    for (final r in filtered) {
      final p = r.purchasePrice;
      if (p < min) min = p;
      if (p > max) max = p;
      sum += p;
    }

    final average = sum / filtered.length;
    
    // Latest price is the first one since it's sorted descending by recordDate
    final latest = filtered.first.purchasePrice;

    // Delta calculation: compare latest to the second latest if exists
    double delta = 0.0;
    if (filtered.length > 1) {
      final secondLatest = filtered[1].purchasePrice;
      if (secondLatest > 0) {
        delta = ((latest - secondLatest) / secondLatest) * 100;
      }
    }

    emit(state.copyWith(
      filteredRecords: filtered,
      lowestPrice: min == double.infinity ? 0.0 : min,
      highestPrice: max,
      averagePrice: average,
      latestPrice: latest,
      deltaPercentage: delta,
    ));
  }

  Future<void> addProduct(String name, String? barcode, String? brand, double salePrice) async {
    final product = PriceCompareProductModel(
      id: const Uuid().v4(),
      name: name,
      barcode: barcode,
      brand: brand,
      salePrice: salePrice,
    );

    await _compareRepo.saveProduct(product);
    await loadProducts();
    await selectProduct(product);
  }

  Future<void> addRecord(String supplier, double purchasePrice, DateTime date, String? note) async {
    if (state.selectedProduct == null) return;
    
    final record = PriceCompareRecordModel(
      id: const Uuid().v4(),
      productId: state.selectedProduct!.id,
      supplier: supplier,
      purchasePrice: purchasePrice,
      recordDate: date,
      note: note,
    );

    await _compareRepo.saveRecord(record);
    
    // Reload
    final records = await _compareRepo.getRecords(state.selectedProduct!.id);
    final suppliers = await _compareRepo.listSuppliers();
    emit(state.copyWith(records: records, suppliers: suppliers));
    _computeAndFilter();
  }

  Future<void> deleteRecord(String id) async {
    if (state.selectedProduct == null) return;
    await _compareRepo.deleteRecord(id);
    
    // Reload
    final records = await _compareRepo.getRecords(state.selectedProduct!.id);
    emit(state.copyWith(records: records));
    _computeAndFilter();
  }

  Future<void> deleteProduct() async {
    if (state.selectedProduct == null) return;
    await _compareRepo.deleteProduct(state.selectedProduct!.id);
    emit(state.copyWith(selectedProduct: null, records: [], filteredRecords: []));
    await loadProducts();
  }
}
