import 'package:flutter_bloc/flutter_bloc.dart';
import '../../models/price_compare_models.dart';
import '../../repositories/price_compare_repository.dart';

class PriceCompareState {
  final bool loading;
  final bool actionLoading;
  final String? errorMessage;
  final String? successMessage;
  final List<PriceCompareProductModel> products;
  final List<PriceCompareVendorModel> vendors;
  final List<PriceCompareEntryModel> entries;
  final PriceCompareProductModel? selectedProduct;

  // Filter params
  final String searchQuery;
  final String? selectedVendor;
  final String? startDate;
  final String? endDate;

  PriceCompareState({
    this.loading = false,
    this.actionLoading = false,
    this.errorMessage,
    this.successMessage,
    this.products = const [],
    this.vendors = const [],
    this.entries = const [],
    this.selectedProduct,
    this.searchQuery = '',
    this.selectedVendor,
    this.startDate,
    this.endDate,
  });

  List<PriceCompareProductModel> get filteredProducts {
    if (searchQuery.trim().isEmpty) return products;
    final q = searchQuery.toLowerCase().trim();
    return products.where((p) {
      final nameMatches = p.productName.toLowerCase().contains(q);
      final barcodeMatches = (p.barcode ?? '').toLowerCase().contains(q);
      final categoryMatches = (p.category ?? '').toLowerCase().contains(q);
      return nameMatches || barcodeMatches || categoryMatches;
    }).toList();
  }

  PriceCompareState copyWith({
    bool? loading,
    bool? actionLoading,
    String? errorMessage,
    String? successMessage,
    bool clearError = false,
    bool clearSuccess = false,
    List<PriceCompareProductModel>? products,
    List<PriceCompareVendorModel>? vendors,
    List<PriceCompareEntryModel>? entries,
    PriceCompareProductModel? selectedProduct,
    bool clearSelectedProduct = false,
    String? searchQuery,
    String? selectedVendor,
    bool clearVendor = false,
    String? startDate,
    String? endDate,
    bool clearDateRange = false,
  }) {
    return PriceCompareState(
      loading: loading ?? this.loading,
      actionLoading: actionLoading ?? this.actionLoading,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      successMessage: clearSuccess ? null : (successMessage ?? this.successMessage),
      products: products ?? this.products,
      vendors: vendors ?? this.vendors,
      entries: entries ?? this.entries,
      selectedProduct: clearSelectedProduct ? null : (selectedProduct ?? this.selectedProduct),
      searchQuery: searchQuery ?? this.searchQuery,
      selectedVendor: clearVendor ? null : (selectedVendor ?? this.selectedVendor),
      startDate: clearDateRange ? null : (startDate ?? this.startDate),
      endDate: clearDateRange ? null : (endDate ?? this.endDate),
    );
  }
}

class PriceCompareCubit extends Cubit<PriceCompareState> {
  final PriceCompareRepository _compareRepo;

  PriceCompareCubit({
    required PriceCompareRepository compareRepo,
  })  : _compareRepo = compareRepo,
        super(PriceCompareState());

  /// Load all products with analysis from live API
  Future<void> loadProducts({bool showLoading = true}) async {
    if (showLoading) {
      emit(state.copyWith(loading: true, clearError: true));
    }
    try {
      final productsFuture = _compareRepo.getProducts(
        search: state.searchQuery.isNotEmpty ? state.searchQuery : null,
        vendor: state.selectedVendor,
        startDate: state.startDate,
        endDate: state.endDate,
      );

      final vendorsFuture = _compareRepo.getVendors().catchError((_) => <PriceCompareVendorModel>[]);

      final results = await Future.wait([productsFuture, vendorsFuture]);
      final products = results[0] as List<PriceCompareProductModel>;
      final vendors = results[1] as List<PriceCompareVendorModel>;

      emit(state.copyWith(
        loading: false,
        products: products,
        vendors: vendors,
        clearError: true,
      ));
    } catch (e) {
      emit(state.copyWith(
        loading: false,
        errorMessage: _formatError(e),
      ));
    }
  }

  /// Search by product name, barcode, or category
  void search(String query) {
    emit(state.copyWith(searchQuery: query));
    loadProducts(showLoading: false);
  }

  /// Filter products by vendor
  void filterByVendor(String? vendor) {
    if (vendor == null || vendor.isEmpty || vendor == 'All') {
      emit(state.copyWith(clearVendor: true));
    } else {
      emit(state.copyWith(selectedVendor: vendor));
    }
    loadProducts(showLoading: true);
  }

  /// Filter products by date range
  void filterByDateRange(String? start, String? end) {
    if (start == null || end == null) {
      emit(state.copyWith(clearDateRange: true));
    } else {
      emit(state.copyWith(startDate: start, endDate: end));
    }
    loadProducts(showLoading: true);
  }

  /// Fetch single product details with full history
  Future<void> selectProduct(String productId) async {
    emit(state.copyWith(loading: true, clearError: true));
    try {
      final product = await _compareRepo.getProductById(productId);
      emit(state.copyWith(loading: false, selectedProduct: product));
    } catch (e) {
      emit(state.copyWith(loading: false, errorMessage: _formatError(e)));
    }
  }

  void clearSelectedProduct() {
    emit(state.copyWith(clearSelectedProduct: true));
  }

  /// GET /price-compare/entries: Flat list of purchase entries across products
  Future<void> loadEntries({
    String? vendor,
    String? productId,
    String? startDate,
    String? endDate,
    String? search,
  }) async {
    try {
      final entries = await _compareRepo.getEntries(
        vendor: vendor ?? state.selectedVendor,
        productId: productId,
        startDate: startDate ?? state.startDate,
        endDate: endDate ?? state.endDate,
        search: search ?? (state.searchQuery.isNotEmpty ? state.searchQuery : null),
      );
      emit(state.copyWith(entries: entries));
    } catch (_) {}
  }

  /// POST /api/v1/price-compare: Create product (+ optional initial buy)
  /// If extra entries are supplied (e.g., from multiple company inputs),
  /// automatically creates them via POST /api/v1/price-compare/entries.
  Future<bool> createProduct(
    CreatePriceCompareProductParams params, {
    List<CreatePriceCompareEntryParams>? additionalEntries,
  }) async {
    emit(state.copyWith(actionLoading: true, clearError: true, clearSuccess: true));
    try {
      final createdProduct = await _compareRepo.createProduct(params);

      // If user added additional company entries, post each entry
      if (additionalEntries != null && additionalEntries.isNotEmpty) {
        for (final entry in additionalEntries) {
          final updatedEntry = CreatePriceCompareEntryParams(
            productId: createdProduct.id,
            vendorName: entry.vendorName,
            purchasePrice: entry.purchasePrice,
            purchaseDate: entry.purchaseDate,
            sellingPrice: entry.sellingPrice,
            quantity: entry.quantity,
            slipImagePath: entry.slipImagePath,
            slipPdfPath: entry.slipPdfPath,
            notes: entry.notes,
          );
          try {
            await _compareRepo.addPurchaseEntry(updatedEntry);
          } catch (_) {
            // Continue saving remaining entries
          }
        }
      }

      await loadProducts(showLoading: false);
      emit(state.copyWith(
        actionLoading: false,
        successMessage: "Product '${createdProduct.productName}' saved successfully",
      ));
      return true;
    } catch (e) {
      emit(state.copyWith(
        actionLoading: false,
        errorMessage: _formatError(e),
      ));
      return false;
    }
  }

  /// POST /api/v1/price-compare/entries: Record an additional vendor purchase
  Future<bool> addPurchaseEntry(CreatePriceCompareEntryParams params) async {
    emit(state.copyWith(actionLoading: true, clearError: true, clearSuccess: true));
    try {
      final entry = await _compareRepo.addPurchaseEntry(params);
      await loadProducts(showLoading: false);

      if (state.selectedProduct?.id == params.productId) {
        await selectProduct(params.productId);
      }

      emit(state.copyWith(
        actionLoading: false,
        successMessage: "Vendor purchase entry from '${entry.vendorName}' recorded successfully",
      ));
      return true;
    } catch (e) {
      emit(state.copyWith(
        actionLoading: false,
        errorMessage: _formatError(e),
      ));
      return false;
    }
  }

  /// PUT /api/v1/price-compare/:id: Update product details
  Future<bool> updateProduct(String id, CreatePriceCompareProductParams params) async {
    emit(state.copyWith(actionLoading: true, clearError: true, clearSuccess: true));
    try {
      final updated = await _compareRepo.updateProduct(id, params);
      await loadProducts(showLoading: false);
      if (state.selectedProduct?.id == id) {
        await selectProduct(id);
      }
      emit(state.copyWith(
        actionLoading: false,
        successMessage: "Product '${updated.productName}' updated successfully",
      ));
      return true;
    } catch (e) {
      emit(state.copyWith(
        actionLoading: false,
        errorMessage: _formatError(e),
      ));
      return false;
    }
  }

  /// PUT /api/v1/price-compare/entries/:id: Update vendor purchase entry
  Future<bool> updatePurchaseEntry(String entryId, CreatePriceCompareEntryParams params) async {
    emit(state.copyWith(actionLoading: true, clearError: true, clearSuccess: true));
    try {
      final updated = await _compareRepo.updatePurchaseEntry(entryId, params);
      await loadProducts(showLoading: false);
      if (state.selectedProduct?.id == params.productId) {
        await selectProduct(params.productId);
      }
      emit(state.copyWith(
        actionLoading: false,
        successMessage: "Vendor quote from '${updated.vendorName}' updated successfully",
      ));
      return true;
    } catch (e) {
      emit(state.copyWith(
        actionLoading: false,
        errorMessage: _formatError(e),
      ));
      return false;
    }
  }

  /// DELETE /api/v1/price-compare/:id
  Future<bool> deleteProduct(String id) async {
    emit(state.copyWith(actionLoading: true, clearError: true, clearSuccess: true));
    try {
      await _compareRepo.deleteProduct(id);
      await loadProducts(showLoading: false);
      if (state.selectedProduct?.id == id) {
        emit(state.copyWith(clearSelectedProduct: true));
      }
      emit(state.copyWith(
        actionLoading: false,
        successMessage: 'Comparison product deleted successfully',
      ));
      return true;
    } catch (e) {
      emit(state.copyWith(
        actionLoading: false,
        errorMessage: _formatError(e),
      ));
      return false;
    }
  }

  /// DELETE /api/v1/price-compare/entries/:id
  Future<bool> deletePurchaseEntry(String entryId, {String? productId}) async {
    emit(state.copyWith(actionLoading: true, clearError: true, clearSuccess: true));
    try {
      await _compareRepo.deletePurchaseEntry(entryId);
      await loadProducts(showLoading: false);
      if (productId != null && state.selectedProduct?.id == productId) {
        await selectProduct(productId);
      }
      emit(state.copyWith(
        actionLoading: false,
        successMessage: 'Vendor purchase entry deleted successfully',
      ));
      return true;
    } catch (e) {
      emit(state.copyWith(
        actionLoading: false,
        errorMessage: _formatError(e),
      ));
      return false;
    }
  }

  /// Clear messages
  void clearMessages() {
    emit(state.copyWith(clearError: true, clearSuccess: true));
  }

  String _formatError(dynamic e) {
    if (e == null) return 'An unexpected error occurred';
    final str = e.toString();
    if (str.startsWith('Exception: ')) {
      return str.replaceFirst('Exception: ', '');
    }
    return str;
  }
}
