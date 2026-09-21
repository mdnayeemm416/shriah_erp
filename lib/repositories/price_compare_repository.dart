import 'dart:io';
import 'package:dio/dio.dart';
import '../core/api/api_client.dart';
import '../core/api/endpoints/api_endpoints.dart';
import '../models/price_compare_models.dart';

class PriceCompareRepository {
  final ApiClient _apiClient = ApiClient();

  /// Helper to attach either local file as MultipartFile or web URL/string to FormData map
  Future<void> _attachFileOrUrl(
    Map<String, dynamic> formMap,
    String fieldKey,
    String? pathOrUrl,
  ) async {
    if (pathOrUrl == null) return;
    final trimmed = pathOrUrl.trim();
    if (trimmed.isEmpty) return;

    final isWebUrl = trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.startsWith('data:');

    if (isWebUrl) {
      formMap[fieldKey] = trimmed;
      if (fieldKey == 'productImage') formMap['imageUrl'] = trimmed;
      if (fieldKey == 'productPdf') formMap['pdfUrl'] = trimmed;
      if (fieldKey == 'slipImage') formMap['slipImageUrl'] = trimmed;
      if (fieldKey == 'slipPdf') formMap['slipPdfUrl'] = trimmed;
      return;
    }

    try {
      final file = File(trimmed);
      if (file.existsSync()) {
        final filename = trimmed.split('/').last;
        formMap[fieldKey] = await MultipartFile.fromFile(trimmed, filename: filename);
        return;
      }
    } catch (_) {}

    // Fallback if not a local file: send as string
    formMap[fieldKey] = trimmed;
    if (fieldKey == 'productImage') formMap['imageUrl'] = trimmed;
    if (fieldKey == 'productPdf') formMap['pdfUrl'] = trimmed;
    if (fieldKey == 'slipImage') formMap['slipImageUrl'] = trimmed;
    if (fieldKey == 'slipPdf') formMap['slipPdfUrl'] = trimmed;
  }

  /// 1. GET /api/v1/price-compare
  /// Retrieves all products with full multi-vendor analysis & purchase timelines.
  Future<List<PriceCompareProductModel>> getProducts({
    String? search,
    String? vendor,
    String? startDate,
    String? endDate,
    String? productId,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (search != null && search.trim().isNotEmpty) {
        queryParams['search'] = search.trim();
      }
      if (vendor != null && vendor.trim().isNotEmpty) {
        queryParams['vendor'] = vendor.trim();
      }
      if (startDate != null && startDate.trim().isNotEmpty) {
        queryParams['startDate'] = startDate.trim();
      }
      if (endDate != null && endDate.trim().isNotEmpty) {
        queryParams['endDate'] = endDate.trim();
      }
      if (productId != null && productId.trim().isNotEmpty) {
        queryParams['productId'] = productId.trim();
      }

      final response = await _apiClient.dio.get(
        ApiEndpoints.priceCompare,
        queryParameters: queryParams.isNotEmpty ? queryParams : null,
      );

      if (response.statusCode == 200 && response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        if (body['success'] == true && body['data'] is List) {
          final list = <PriceCompareProductModel>[];
          for (final item in body['data'] as List) {
            if (item is Map<String, dynamic>) {
              list.add(PriceCompareProductModel.fromJson(item));
            }
          }
          return list;
        } else {
          throw Exception(body['message'] ?? 'Failed to load price compare products');
        }
      } else if (response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        throw Exception(body['message'] ?? 'Server error ${response.statusCode}');
      } else {
        throw Exception('Server error: ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.response?.data is Map) {
        final body = Map<String, dynamic>.from(e.response!.data as Map);
        throw Exception(body['message'] ?? 'Network error (${e.response?.statusCode})');
      }
      throw Exception(e.message ?? 'Failed to connect to server');
    }
  }

  /// 2. GET /api/v1/price-compare/:id
  /// Single Product Details
  Future<PriceCompareProductModel> getProductById(String id) async {
    try {
      final response = await _apiClient.dio.get(
        ApiEndpoints.priceCompareById(id),
      );

      if (response.statusCode == 200 && response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        if (body['success'] == true && body['data'] is Map) {
          return PriceCompareProductModel.fromJson(
            Map<String, dynamic>.from(body['data'] as Map),
          );
        } else {
          throw Exception(body['message'] ?? 'Product not found');
        }
      } else if (response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        throw Exception(body['message'] ?? 'Server error ${response.statusCode}');
      } else {
        throw Exception('Server error: ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.response?.data is Map) {
        final body = Map<String, dynamic>.from(e.response!.data as Map);
        throw Exception(body['message'] ?? 'Network error (${e.response?.statusCode})');
      }
      throw Exception(e.message ?? 'Failed to fetch product details');
    }
  }

  /// 3. POST /price-compare
  /// Creates or updates a product in comparison benchmark.
  /// Optionally records its first vendor purchase + slips in the same request.
  Future<PriceCompareProductModel> createProduct(
    CreatePriceCompareProductParams params,
  ) async {
    try {
      final formMap = <String, dynamic>{
        'productName': params.productName,
        'sellingPrice': params.sellingPrice,
      };

      if (params.id != null && params.id!.trim().isNotEmpty) {
        formMap['id'] = params.id!.trim();
        formMap['productId'] = params.id!.trim();
      }
      if (params.erpProductId != null && params.erpProductId!.trim().isNotEmpty) {
        formMap['erpProductId'] = params.erpProductId!.trim();
      }
      if (params.category != null && params.category!.trim().isNotEmpty) {
        formMap['category'] = params.category!.trim();
      }
      if (params.barcode != null && params.barcode!.trim().isNotEmpty) {
        formMap['barcode'] = params.barcode!.trim();
      }
      if (params.notes != null && params.notes!.trim().isNotEmpty) {
        formMap['notes'] = params.notes!.trim();
      }

      // Initial vendor purchase info (optional)
      if (params.vendorName != null && params.vendorName!.trim().isNotEmpty) {
        formMap['vendorName'] = params.vendorName!.trim();
      }
      if (params.purchasePrice != null && params.purchasePrice! > 0) {
        formMap['purchasePrice'] = params.purchasePrice;
      }
      if (params.purchaseDate != null && params.purchaseDate!.trim().isNotEmpty) {
        formMap['purchaseDate'] = params.purchaseDate!.trim();
      }
      if (params.quantity != null && params.quantity! > 0) {
        formMap['quantity'] = params.quantity;
      }

      // Attach Images & Documents OR send explicit remove flags (Option A)
      if (params.removeProductImage == true) {
        formMap['removeProductImage'] = true;
      } else if (params.productImagePath != null && params.productImagePath!.trim().isNotEmpty) {
        await _attachFileOrUrl(formMap, 'productImage', params.productImagePath);
      }

      if (params.removeProductPdf == true) {
        formMap['removeProductPdf'] = true;
      } else if (params.productPdfPath != null && params.productPdfPath!.trim().isNotEmpty) {
        await _attachFileOrUrl(formMap, 'productPdf', params.productPdfPath);
      }

      if (params.removeSlipImage == true) {
        formMap['removeSlipImage'] = true;
      } else if (params.slipImagePath != null && params.slipImagePath!.trim().isNotEmpty) {
        await _attachFileOrUrl(formMap, 'slipImage', params.slipImagePath);
      }

      if (params.removeSlipPdf == true) {
        formMap['removeSlipPdf'] = true;
      } else if (params.slipPdfPath != null && params.slipPdfPath!.trim().isNotEmpty) {
        await _attachFileOrUrl(formMap, 'slipPdf', params.slipPdfPath);
      }

      final formData = FormData.fromMap(formMap);

      final response = await _apiClient.dio.post(
        ApiEndpoints.priceCompare,
        data: formData,
        options: Options(
          headers: {
            'Content-Type': 'multipart/form-data; boundary=${formData.boundary}',
          },
        ),
      );

      if ((response.statusCode == 200 || response.statusCode == 201) && response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        if (body['success'] == true && body['data'] is Map) {
          return PriceCompareProductModel.fromJson(
            Map<String, dynamic>.from(body['data'] as Map),
          );
        } else {
          throw Exception(body['message'] ?? 'Failed to save product');
        }
      } else if (response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        throw Exception(body['message'] ?? 'Server error ${response.statusCode}');
      } else {
        throw Exception('Server error ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.response?.data is Map) {
        final body = Map<String, dynamic>.from(e.response!.data as Map);
        throw Exception(body['message'] ?? 'Failed to create product (${e.response?.statusCode})');
      }
      throw Exception(e.message ?? 'Network error while creating product');
    }
  }

  /// 4. POST /price-compare/entries
  /// Records a new purchase quote / invoice from any vendor against an existing product.
  Future<PriceCompareEntryModel> addPurchaseEntry(
    CreatePriceCompareEntryParams params,
  ) async {
    try {
      final formMap = <String, dynamic>{
        'productId': params.productId,
        'vendorName': params.vendorName,
        'purchasePrice': params.purchasePrice,
        'purchaseDate': params.purchaseDate,
      };

      if (params.sellingPrice != null) {
        formMap['sellingPrice'] = params.sellingPrice;
      }
      if (params.quantity != null) {
        formMap['quantity'] = params.quantity;
      }
      if (params.notes != null && params.notes!.trim().isNotEmpty) {
        formMap['notes'] = params.notes!.trim();
      }
      if (params.marketShop != null && params.marketShop!.trim().isNotEmpty) {
        formMap['marketShop'] = params.marketShop!.trim();
      }
      if (params.offerPrice != null && params.offerPrice! > 0) {
        formMap['offerPrice'] = params.offerPrice;
      }

      // Attach Slip Image & PDF OR send explicit remove flags (Option A)
      if (params.removeSlipImage == true) {
        formMap['removeSlipImage'] = true;
      } else if (params.slipImagePath != null && params.slipImagePath!.trim().isNotEmpty) {
        await _attachFileOrUrl(formMap, 'slipImage', params.slipImagePath);
      }

      if (params.removeSlipPdf == true) {
        formMap['removeSlipPdf'] = true;
      } else if (params.slipPdfPath != null && params.slipPdfPath!.trim().isNotEmpty) {
        await _attachFileOrUrl(formMap, 'slipPdf', params.slipPdfPath);
      }

      final formData = FormData.fromMap(formMap);

      final response = await _apiClient.dio.post(
        ApiEndpoints.priceCompareEntries,
        data: formData,
        options: Options(
          headers: {
            'Content-Type': 'multipart/form-data; boundary=${formData.boundary}',
          },
        ),
      );

      if ((response.statusCode == 200 || response.statusCode == 201) && response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        if (body['success'] == true && body['data'] is Map) {
          return PriceCompareEntryModel.fromJson(
            Map<String, dynamic>.from(body['data'] as Map),
          );
        } else {
          throw Exception(body['message'] ?? 'Failed to add purchase entry');
        }
      } else if (response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        throw Exception(body['message'] ?? 'Server error ${response.statusCode}');
      } else {
        throw Exception('Server error ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.response?.data is Map) {
        final body = Map<String, dynamic>.from(e.response!.data as Map);
        throw Exception(body['message'] ?? 'Failed to add purchase entry (${e.response?.statusCode})');
      }
      throw Exception(e.message ?? 'Network error while adding purchase entry');
    }
  }

  /// 4b. POST /price-compare (with id) or PUT /price-compare/:id
  /// Creates or updates a product in the comparison benchmark.
  Future<PriceCompareProductModel> updateProduct(
    String id,
    CreatePriceCompareProductParams params,
  ) async {
    try {
      final formMap = <String, dynamic>{
        'id': id,
        'productId': id,
        'productName': params.productName,
        'sellingPrice': params.sellingPrice,
      };

      if (params.erpProductId != null && params.erpProductId!.trim().isNotEmpty) {
        formMap['erpProductId'] = params.erpProductId!.trim();
      }
      if (params.category != null && params.category!.trim().isNotEmpty) {
        formMap['category'] = params.category!.trim();
      }
      if (params.barcode != null && params.barcode!.trim().isNotEmpty) {
        formMap['barcode'] = params.barcode!.trim();
      }
      if (params.notes != null && params.notes!.trim().isNotEmpty) {
        formMap['notes'] = params.notes!.trim();
      }

      // Initial vendor purchase info (optional)
      if (params.vendorName != null && params.vendorName!.trim().isNotEmpty) {
        formMap['vendorName'] = params.vendorName!.trim();
      }
      if (params.purchasePrice != null && params.purchasePrice! > 0) {
        formMap['purchasePrice'] = params.purchasePrice;
      }
      if (params.purchaseDate != null && params.purchaseDate!.trim().isNotEmpty) {
        formMap['purchaseDate'] = params.purchaseDate!.trim();
      }
      if (params.quantity != null && params.quantity! > 0) {
        formMap['quantity'] = params.quantity;
      }

      // Attach Images & Documents OR send explicit remove flags (Option A)
      if (params.removeProductImage == true) {
        formMap['removeProductImage'] = true;
      } else if (params.productImagePath != null && params.productImagePath!.trim().isNotEmpty) {
        await _attachFileOrUrl(formMap, 'productImage', params.productImagePath);
      }

      if (params.removeProductPdf == true) {
        formMap['removeProductPdf'] = true;
      } else if (params.productPdfPath != null && params.productPdfPath!.trim().isNotEmpty) {
        await _attachFileOrUrl(formMap, 'productPdf', params.productPdfPath);
      }

      if (params.removeSlipImage == true) {
        formMap['removeSlipImage'] = true;
      } else if (params.slipImagePath != null && params.slipImagePath!.trim().isNotEmpty) {
        await _attachFileOrUrl(formMap, 'slipImage', params.slipImagePath);
      }

      if (params.removeSlipPdf == true) {
        formMap['removeSlipPdf'] = true;
      } else if (params.slipPdfPath != null && params.slipPdfPath!.trim().isNotEmpty) {
        await _attachFileOrUrl(formMap, 'slipPdf', params.slipPdfPath);
      }

      final formData = FormData.fromMap(formMap);

      // Specification: POST /price-compare (or fallback to PUT /price-compare/:id)
      Response response;
      try {
        response = await _apiClient.dio.post(
          ApiEndpoints.priceCompare,
          data: formData,
          options: Options(
            headers: {
              'Content-Type': 'multipart/form-data; boundary=${formData.boundary}',
            },
          ),
        );
      } on DioException catch (postErr) {
        if (postErr.response?.statusCode == 404 || postErr.response?.statusCode == 405) {
          // Fallback to PUT /price-compare/:id
          response = await _apiClient.dio.put(
            ApiEndpoints.priceCompareById(id),
            data: formData,
            options: Options(
              headers: {
                'Content-Type': 'multipart/form-data; boundary=${formData.boundary}',
              },
            ),
          );
        } else {
          rethrow;
        }
      }

      if ((response.statusCode == 200 || response.statusCode == 201) && response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        if (body['success'] == true && body['data'] is Map) {
          return PriceCompareProductModel.fromJson(
            Map<String, dynamic>.from(body['data'] as Map),
          );
        } else {
          throw Exception(body['message'] ?? 'Failed to update product');
        }
      } else if (response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        throw Exception(body['message'] ?? 'Server error ${response.statusCode}');
      } else {
        throw Exception('Server error ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.response?.data is Map) {
        final body = Map<String, dynamic>.from(e.response!.data as Map);
        throw Exception(body['message'] ?? 'Failed to update product (${e.response?.statusCode})');
      }
      throw Exception(e.message ?? 'Network error while updating product');
    }
  }

  /// 4c. PUT /price-compare/entries/:id or POST /price-compare/entries (with id)
  /// Updates an existing vendor purchase entry.
  Future<PriceCompareEntryModel> updatePurchaseEntry(
    String entryId,
    CreatePriceCompareEntryParams params,
  ) async {
    try {
      final formMap = <String, dynamic>{
        'productId': params.productId,
        'vendorName': params.vendorName,
        'purchasePrice': params.purchasePrice,
        'purchaseDate': params.purchaseDate,
      };

      if (params.sellingPrice != null) {
        formMap['sellingPrice'] = params.sellingPrice;
      }
      if (params.quantity != null) {
        formMap['quantity'] = params.quantity;
      }
      if (params.notes != null && params.notes!.trim().isNotEmpty) {
        formMap['notes'] = params.notes!.trim();
      }
      if (params.marketShop != null && params.marketShop!.trim().isNotEmpty) {
        formMap['marketShop'] = params.marketShop!.trim();
      }
      if (params.offerPrice != null && params.offerPrice! > 0) {
        formMap['offerPrice'] = params.offerPrice;
      }

      // Attach Slip Image & PDF OR send explicit remove flags (Option A)
      if (params.removeSlipImage == true) {
        formMap['removeSlipImage'] = true;
      } else if (params.slipImagePath != null && params.slipImagePath!.trim().isNotEmpty) {
        await _attachFileOrUrl(formMap, 'slipImage', params.slipImagePath);
      }

      if (params.removeSlipPdf == true) {
        formMap['removeSlipPdf'] = true;
      } else if (params.slipPdfPath != null && params.slipPdfPath!.trim().isNotEmpty) {
        await _attachFileOrUrl(formMap, 'slipPdf', params.slipPdfPath);
      }

      final formData = FormData.fromMap(formMap);

      Response response;
      try {
        response = await _apiClient.dio.put(
          ApiEndpoints.priceCompareEntryById(entryId),
          data: formData,
          options: Options(
            headers: {
              'Content-Type': 'multipart/form-data; boundary=${formData.boundary}',
            },
          ),
        );
      } on DioException catch (putErr) {
        if (putErr.response?.statusCode == 404 || putErr.response?.statusCode == 405) {
          // Fallback to POST /price-compare/entries with id in form
          formMap['id'] = entryId;
          final fallbackFormData = FormData.fromMap(formMap);
          response = await _apiClient.dio.post(
            ApiEndpoints.priceCompareEntries,
            data: fallbackFormData,
            options: Options(
              headers: {
                'Content-Type': 'multipart/form-data; boundary=${fallbackFormData.boundary}',
              },
            ),
          );
        } else {
          rethrow;
        }
      }

      if ((response.statusCode == 200 || response.statusCode == 201) && response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        if (body['success'] == true && body['data'] is Map) {
          return PriceCompareEntryModel.fromJson(
            Map<String, dynamic>.from(body['data'] as Map),
          );
        } else {
          throw Exception(body['message'] ?? 'Failed to update purchase entry');
        }
      } else if (response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        throw Exception(body['message'] ?? 'Server error ${response.statusCode}');
      } else {
        throw Exception('Server error ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.response?.data is Map) {
        final body = Map<String, dynamic>.from(e.response!.data as Map);
        throw Exception(body['message'] ?? 'Failed to update entry (${e.response?.statusCode})');
      }
      throw Exception(e.message ?? 'Network error while updating entry');
    }
  }

  /// 5. DELETE /api/v1/price-compare/:id
  /// Soft-deletes a product and its historical entries.
  Future<bool> deleteProduct(String id) async {
    try {
      final response = await _apiClient.dio.delete(
        ApiEndpoints.priceCompareById(id),
      );

      if (response.statusCode == 200 && response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        if (body['success'] == true) {
          return true;
        } else {
          throw Exception(body['message'] ?? 'Failed to delete product');
        }
      } else if (response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        throw Exception(body['message'] ?? 'Server error ${response.statusCode}');
      } else {
        return response.statusCode == 200;
      }
    } on DioException catch (e) {
      if (e.response?.data is Map) {
        final body = Map<String, dynamic>.from(e.response!.data as Map);
        throw Exception(body['message'] ?? 'Failed to delete product (${e.response?.statusCode})');
      }
      throw Exception(e.message ?? 'Network error while deleting product');
    }
  }

  /// 6. DELETE /api/v1/price-compare/entries/:id
  /// Soft-deletes a single vendor purchase entry.
  Future<bool> deletePurchaseEntry(String id) async {
    try {
      final response = await _apiClient.dio.delete(
        ApiEndpoints.priceCompareEntryById(id),
      );

      if (response.statusCode == 200 && response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        if (body['success'] == true) {
          return true;
        } else {
          throw Exception(body['message'] ?? 'Failed to delete entry');
        }
      } else if (response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        throw Exception(body['message'] ?? 'Server error ${response.statusCode}');
      } else {
        return response.statusCode == 200;
      }
    } on DioException catch (e) {
      if (e.response?.data is Map) {
        final body = Map<String, dynamic>.from(e.response!.data as Map);
        throw Exception(body['message'] ?? 'Failed to delete entry (${e.response?.statusCode})');
      }
      throw Exception(e.message ?? 'Network error while deleting entry');
    }
  }

  /// 7. GET /api/v1/price-compare/vendors
  /// Master list of all known vendors with aggregated metrics.
  Future<List<PriceCompareVendorModel>> getVendors() async {
    try {
      final response = await _apiClient.dio.get(
        ApiEndpoints.priceCompareVendors,
      );

      if (response.statusCode == 200 && response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        if (body['success'] == true && body['data'] is List) {
          final list = <PriceCompareVendorModel>[];
          for (final item in body['data'] as List) {
            if (item is Map<String, dynamic>) {
              list.add(PriceCompareVendorModel.fromJson(item));
            }
          }
          return list;
        } else {
          throw Exception(body['message'] ?? 'Failed to load vendors');
        }
      } else if (response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        throw Exception(body['message'] ?? 'Server error ${response.statusCode}');
      } else {
        throw Exception('Server error: ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.response?.data is Map) {
        final body = Map<String, dynamic>.from(e.response!.data as Map);
        throw Exception(body['message'] ?? 'Failed to fetch vendors (${e.response?.statusCode})');
      }
      throw Exception(e.message ?? 'Network error while loading vendors');
    }
  }

  /// 8. GET /api/v1/price-compare/entries
  /// Flat chronological list of entries across all products.
  Future<List<PriceCompareEntryModel>> getEntries({
    String? vendor,
    String? productId,
    String? startDate,
    String? endDate,
    String? search,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (vendor != null && vendor.trim().isNotEmpty) {
        queryParams['vendor'] = vendor.trim();
      }
      if (productId != null && productId.trim().isNotEmpty) {
        queryParams['productId'] = productId.trim();
      }
      if (startDate != null && startDate.trim().isNotEmpty) {
        queryParams['startDate'] = startDate.trim();
      }
      if (endDate != null && endDate.trim().isNotEmpty) {
        queryParams['endDate'] = endDate.trim();
      }
      if (search != null && search.trim().isNotEmpty) {
        queryParams['search'] = search.trim();
      }

      final response = await _apiClient.dio.get(
        ApiEndpoints.priceCompareEntries,
        queryParameters: queryParams.isNotEmpty ? queryParams : null,
      );

      if (response.statusCode == 200 && response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        if (body['success'] == true && body['data'] is List) {
          final list = <PriceCompareEntryModel>[];
          for (final item in body['data'] as List) {
            if (item is Map<String, dynamic>) {
              list.add(PriceCompareEntryModel.fromJson(item));
            }
          }
          return list;
        } else {
          throw Exception(body['message'] ?? 'Failed to load entries');
        }
      } else if (response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        throw Exception(body['message'] ?? 'Server error ${response.statusCode}');
      } else {
        throw Exception('Server error: ${response.statusCode}');
      }
    } on DioException catch (e) {
      if (e.response?.data is Map) {
        final body = Map<String, dynamic>.from(e.response!.data as Map);
        throw Exception(body['message'] ?? 'Failed to fetch entries (${e.response?.statusCode})');
      }
      throw Exception(e.message ?? 'Network error while loading entries');
    }
  }
}
