import 'package:dio/dio.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';

class ApiClient {
  static const String baseUrl = 'https://api.shriah.com/api/v1';
  static const String _authBoxName = 'auth';
  static const String _tokenKey = 'auth_token';

  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;

  late final Dio dio;
  String? _token;

  String? get token => _token;

  ApiClient._internal() {
    dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        validateStatus: (status) => status != null && status < 600,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      ),
    );

    // Dynamic Authorization header interceptor
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          if (_token != null && _token!.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $_token';
          }
          return handler.next(options);
        },
      ),
    );

    // Pretty Dio Logger for console logging
    dio.interceptors.add(
      PrettyDioLogger(
        requestHeader: true,
        requestBody: true,
        responseBody: true,
        responseHeader: false,
        error: true,
        compact: true,
        maxWidth: 90,
      ),
    );
  }

  Future<void> init() async {
    final box = await Hive.openBox(_authBoxName);
    _token = box.get(_tokenKey) as String?;
  }

  Future<void> setToken(String? token) async {
    _token = token;
    final box = await Hive.openBox(_authBoxName);
    if (token != null) {
      await box.put(_tokenKey, token);
    } else {
      await box.delete(_tokenKey);
    }
  }

  // 1. Health Check: GET /health
  Future<Map<String, dynamic>?> checkHealth() async {
    try {
      final response = await dio.get('/health');
      if (response.statusCode == 200 && response.data is Map) {
        return Map<String, dynamic>.from(response.data as Map);
      }
    } catch (_) {}
    return null;
  }

  // 2. Authentication: POST /auth/login
  Future<Map<String, dynamic>> login({
    required String identifier,
    required String password,
  }) async {
    try {
      final response = await dio.post(
        '/auth/login',
        data: {
          'identifier': identifier,
          'password': password,
        },
      );
      
      final data = response.data is Map
          ? Map<String, dynamic>.from(response.data as Map)
          : <String, dynamic>{};

      if (response.statusCode == 200 && data['success'] == true && data['data'] != null) {
        final token = data['data']['token'] as String?;
        if (token != null) {
          await setToken(token);
        }
        return data;
      } else {
        return {
          'success': false,
          'message': data['message'] ?? 'Login failed (${response.statusCode})',
        };
      }
    } on DioException catch (e) {
      if (e.response != null && e.response?.data is Map) {
        final errData = Map<String, dynamic>.from(e.response!.data as Map);
        return {
          'success': false,
          'message': errData['message'] ?? 'Server error (${e.response?.statusCode})',
        };
      }
      return {'success': false, 'message': e.message ?? 'Network connection error'};
    } catch (e) {
      return {'success': false, 'message': e.toString()};
    }
  }

  // 3. Products: GET /products
  Future<List<dynamic>?> getProducts() async {
    try {
      final response = await dio.get('/products');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is List) {
          return body['data'] as List<dynamic>;
        }
      }
    } catch (_) {}
    return null;
  }

  // 4. Products: POST /products
  Future<Map<String, dynamic>?> createProduct(Map<String, dynamic> productData) async {
    try {
      final response = await dio.post('/products', data: productData);
      if ((response.statusCode == 200 || response.statusCode == 201) && response.data is Map) {
        return Map<String, dynamic>.from(response.data as Map);
      }
    } catch (_) {}
    return null;
  }

  // 5. Wholesale Customers: GET /wholesale/customers
  Future<List<dynamic>?> getWholesaleCustomers() async {
    try {
      final response = await dio.get('/wholesale/customers');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is List) {
          return body['data'] as List<dynamic>;
        }
      }
    } catch (_) {}
    return null;
  }

  // 6. Wholesale Sales: GET /wholesale/sales
  Future<List<dynamic>?> getWholesaleSales() async {
    try {
      final response = await dio.get('/wholesale/sales');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is List) {
          return body['data'] as List<dynamic>;
        }
      }
    } catch (_) {}
    return null;
  }

  // 7. Wholesale Employees: GET /wholesale/employees
  Future<List<dynamic>?> getEmployees() async {
    try {
      final response = await dio.get('/wholesale/employees');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is List) {
          return body['data'] as List<dynamic>;
        }
      }
    } catch (_) {}
    return null;
  }

  // 8. Wholesale Employees: POST /wholesale/employees
  Future<Map<String, dynamic>?> createEmployee(Map<String, dynamic> employeeData) async {
    try {
      final response = await dio.post('/wholesale/employees', data: employeeData);
      if ((response.statusCode == 200 || response.statusCode == 201) && response.data is Map) {
        return Map<String, dynamic>.from(response.data as Map);
      }
    } catch (_) {}
    return null;
  }

  // 9. Wholesale Sales Returns: GET /wholesale/sales-returns
  Future<List<dynamic>?> getSalesReturns() async {
    try {
      final response = await dio.get('/wholesale/sales-returns');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is List) {
          return body['data'] as List<dynamic>;
        }
      }
    } catch (_) {}
    return null;
  }

  // 10. Wholesale Sales Returns: POST /wholesale/sales-returns
  Future<Map<String, dynamic>?> createSalesReturn(Map<String, dynamic> returnData) async {
    try {
      final response = await dio.post('/wholesale/sales-returns', data: returnData);
      if ((response.statusCode == 200 || response.statusCode == 201) && response.data is Map) {
        return Map<String, dynamic>.from(response.data as Map);
      }
    } catch (_) {}
    return null;
  }

  // 11. Supplier Price Benchmarking: GET /wholesale/price-compares
  Future<List<dynamic>?> getPriceCompares() async {
    try {
      final response = await dio.get('/wholesale/price-compares');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is List) {
          return body['data'] as List<dynamic>;
        }
      }
    } catch (_) {}
    return null;
  }

  // --- Executive Dashboard & Financial Analytics ---
  Future<Map<String, dynamic>?> getWholesaleDashboardSummary() async {
    try {
      final response = await dio.get('/wholesale/dashboard/summary');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is Map) {
          return Map<String, dynamic>.from(body['data'] as Map);
        }
      }
    } catch (_) {}
    return null;
  }

  Future<List<dynamic>?> getWholesaleReceivablesBreakdown() async {
    try {
      final response = await dio.get('/wholesale/receivables/breakdown');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is List) {
          return body['data'] as List<dynamic>;
        }
      }
    } catch (_) {}
    return null;
  }

  // --- Wholesale Customers & Statement ---
  Future<Map<String, dynamic>?> createWholesaleCustomer(Map<String, dynamic> customerData) async {
    try {
      final response = await dio.post('/wholesale/customers', data: customerData);
      if ((response.statusCode == 200 || response.statusCode == 201) && response.data is Map) {
        return Map<String, dynamic>.from(response.data as Map);
      }
    } catch (_) {}
    return null;
  }

  Future<Map<String, dynamic>?> getWholesaleCustomerStatement(String customerId) async {
    try {
      final response = await dio.get('/wholesale/customers/$customerId/statement');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is Map) {
          return Map<String, dynamic>.from(body['data'] as Map);
        }
      }
    } catch (_) {}
    return null;
  }

  Future<bool> deleteWholesaleCustomer(String customerId) async {
    try {
      final response = await dio.delete('/wholesale/customers/$customerId');
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  // --- Wholesale Sales & Invoices ---
  Future<Map<String, dynamic>?> createWholesaleSale(Map<String, dynamic> saleData) async {
    try {
      final response = await dio.post('/wholesale/sales', data: saleData);
      if ((response.statusCode == 200 || response.statusCode == 201) && response.data is Map) {
        return Map<String, dynamic>.from(response.data as Map);
      }
    } catch (_) {}
    return null;
  }

  Future<bool> cancelWholesaleSale(String saleId) async {
    try {
      final response = await dio.post('/wholesale/sales/$saleId/cancel');
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  Future<bool> deleteWholesaleSale(String saleId) async {
    try {
      final response = await dio.delete('/wholesale/sales/$saleId');
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  // --- Supplier Purchases ---
  Future<List<dynamic>?> getWholesalePurchases() async {
    try {
      final response = await dio.get('/wholesale/purchases');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is List) {
          return body['data'] as List<dynamic>;
        }
      }
    } catch (_) {}
    return null;
  }

  Future<Map<String, dynamic>?> createWholesalePurchase(Map<String, dynamic> purchaseData) async {
    try {
      final response = await dio.post('/wholesale/purchases', data: purchaseData);
      if ((response.statusCode == 200 || response.statusCode == 201) && response.data is Map) {
        return Map<String, dynamic>.from(response.data as Map);
      }
    } catch (_) {}
    return null;
  }

  Future<bool> deleteWholesalePurchase(String purchaseId) async {
    try {
      final response = await dio.delete('/wholesale/purchases/$purchaseId');
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  // --- Wholesale Orders ---
  Future<List<dynamic>?> getWholesaleOrders() async {
    try {
      final response = await dio.get('/wholesale/orders');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is List) {
          return body['data'] as List<dynamic>;
        }
      }
    } catch (_) {}
    return null;
  }

  Future<Map<String, dynamic>?> createWholesaleOrder(Map<String, dynamic> orderData) async {
    try {
      final response = await dio.post('/wholesale/orders', data: orderData);
      if ((response.statusCode == 200 || response.statusCode == 201) && response.data is Map) {
        return Map<String, dynamic>.from(response.data as Map);
      }
    } catch (_) {}
    return null;
  }

  Future<bool> updateWholesaleOrderStatus(String orderId, String status) async {
    try {
      final response = await dio.post('/wholesale/orders/$orderId/status', data: {'status': status});
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  Future<bool> deleteWholesaleOrder(String orderId) async {
    try {
      final response = await dio.delete('/wholesale/orders/$orderId');
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  // --- Wholesale Payments ---
  Future<List<dynamic>?> getWholesalePayments() async {
    try {
      final response = await dio.get('/wholesale/payments');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is List) {
          return body['data'] as List<dynamic>;
        }
      }
    } catch (_) {}
    return null;
  }

  Future<Map<String, dynamic>?> createWholesalePayment(Map<String, dynamic> paymentData) async {
    try {
      final response = await dio.post('/wholesale/payments', data: paymentData);
      if ((response.statusCode == 200 || response.statusCode == 201) && response.data is Map) {
        return Map<String, dynamic>.from(response.data as Map);
      }
    } catch (_) {}
    return null;
  }

  Future<bool> deleteWholesalePayment(String paymentId) async {
    try {
      final response = await dio.delete('/wholesale/payments/$paymentId');
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  // --- Wholesale Categories ---
  Future<List<dynamic>?> getWholesaleCategories() async {
    try {
      final response = await dio.get('/wholesale/categories');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is List) {
          return body['data'] as List<dynamic>;
        }
      }
    } catch (_) {}
    return null;
  }

  Future<Map<String, dynamic>?> createWholesaleCategory(Map<String, dynamic> categoryData) async {
    try {
      final response = await dio.post('/wholesale/categories', data: categoryData);
      if ((response.statusCode == 200 || response.statusCode == 201) && response.data is Map) {
        return Map<String, dynamic>.from(response.data as Map);
      }
    } catch (_) {}
    return null;
  }

  // --- Staff HR & Payroll ---
  Future<Map<String, dynamic>?> getEmployeeSummary() async {
    try {
      final response = await dio.get('/wholesale/employees/summary');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is Map) {
          return Map<String, dynamic>.from(body['data'] as Map);
        }
      }
    } catch (_) {}
    return null;
  }

  Future<List<dynamic>?> getEmployeeEntries() async {
    try {
      final response = await dio.get('/wholesale/employees/entries');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is List) {
          return body['data'] as List<dynamic>;
        }
      }
    } catch (_) {}
    return null;
  }

  Future<Map<String, dynamic>?> createEmployeeEntry(Map<String, dynamic> entryData) async {
    try {
      final response = await dio.post('/wholesale/employees/entries', data: entryData);
      if ((response.statusCode == 200 || response.statusCode == 201) && response.data is Map) {
        return Map<String, dynamic>.from(response.data as Map);
      }
    } catch (_) {}
    return null;
  }

  // --- Product Stock Adjustments & Barcode ---
  Future<Map<String, dynamic>?> getProductByBarcode(String barcode) async {
    try {
      final response = await dio.get('/products/barcode/$barcode');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is Map) {
          return Map<String, dynamic>.from(body['data'] as Map);
        }
      }
    } catch (_) {}
    return null;
  }

  Future<bool> adjustStock(String productId, double adjustment) async {
    try {
      final response = await dio.post('/products/adjust-stock', data: {
        'productId': productId,
        'adjustment': adjustment,
      });
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  Future<bool> bulkAdjustStock(List<Map<String, dynamic>> items) async {
    try {
      final response = await dio.post('/products/bulk-adjust-stock', data: {'items': items});
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  // --- Corporate Capital & Expenses ---
  Future<List<dynamic>?> getCompanyTransactions() async {
    try {
      final response = await dio.get('/company-transactions');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is List) {
          return body['data'] as List<dynamic>;
        }
      }
    } catch (_) {}
    return null;
  }

  Future<Map<String, dynamic>?> createCompanyTransaction(Map<String, dynamic> transactionData) async {
    try {
      final response = await dio.post('/company-transactions', data: transactionData);
      if ((response.statusCode == 200 || response.statusCode == 201) && response.data is Map) {
        return Map<String, dynamic>.from(response.data as Map);
      }
    } catch (_) {}
    return null;
  }

  Future<bool> deleteCompanyTransaction(String id) async {
    try {
      final response = await dio.delete('/company-transactions/$id');
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  // --- Physical Cash Snapshots & Cash Holders ---
  Future<List<dynamic>?> getCashSnapshots() async {
    try {
      final response = await dio.get('/cash-snapshots');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is List) {
          return body['data'] as List<dynamic>;
        }
      }
    } catch (_) {}
    return null;
  }

  Future<Map<String, dynamic>?> createCashSnapshot(Map<String, dynamic> snapshotData) async {
    try {
      final response = await dio.post('/cash-snapshots', data: snapshotData);
      if ((response.statusCode == 200 || response.statusCode == 201) && response.data is Map) {
        return Map<String, dynamic>.from(response.data as Map);
      }
    } catch (_) {}
    return null;
  }

  Future<bool> deleteCashSnapshot(String id) async {
    try {
      final response = await dio.delete('/cash-snapshots/$id');
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  Future<List<dynamic>?> getCashHolders() async {
    try {
      final response = await dio.get('/cash-holders');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is List) {
          return body['data'] as List<dynamic>;
        }
      }
    } catch (_) {}
    return null;
  }

  Future<bool> updateCashHolders(List<Map<String, dynamic>> holders) async {
    try {
      final response = await dio.post('/cash-holders', data: holders);
      return response.statusCode == 200;
    } catch (_) {
      return false;
    }
  }

  // --- Store Operations & POS Shifts ---
  Future<List<dynamic>?> getShops() async {
    try {
      final response = await dio.get('/shops');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is List) {
          return body['data'] as List<dynamic>;
        }
      }
    } catch (_) {}
    return null;
  }

  Future<Map<String, dynamic>?> createShop(Map<String, dynamic> shopData) async {
    try {
      final response = await dio.post('/shops', data: shopData);
      if ((response.statusCode == 200 || response.statusCode == 201) && response.data is Map) {
        return Map<String, dynamic>.from(response.data as Map);
      }
    } catch (_) {}
    return null;
  }

  Future<List<dynamic>?> getShopsCashiers() async {
    try {
      final response = await dio.get('/shops/cashiers');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is List) {
          return body['data'] as List<dynamic>;
        }
      }
    } catch (_) {}
    return null;
  }

  Future<Map<String, dynamic>?> createShopCashier(Map<String, dynamic> cashierData) async {
    try {
      final response = await dio.post('/shops/cashiers', data: cashierData);
      if ((response.statusCode == 200 || response.statusCode == 201) && response.data is Map) {
        return Map<String, dynamic>.from(response.data as Map);
      }
    } catch (_) {}
    return null;
  }

  Future<List<dynamic>?> getShopEntries() async {
    try {
      final response = await dio.get('/shops/entries');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is List) {
          return body['data'] as List<dynamic>;
        }
      }
    } catch (_) {}
    return null;
  }

  Future<Map<String, dynamic>?> createShopEntry(Map<String, dynamic> entryData) async {
    try {
      final response = await dio.post('/shops/entries', data: entryData);
      if ((response.statusCode == 200 || response.statusCode == 201) && response.data is Map) {
        return Map<String, dynamic>.from(response.data as Map);
      }
    } catch (_) {}
    return null;
  }

  Future<List<dynamic>?> getDailyClosings() async {
    try {
      final response = await dio.get('/daily-closings');
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true && body['data'] is List) {
          return body['data'] as List<dynamic>;
        }
      }
    } catch (_) {}
    return null;
  }

  Future<Map<String, dynamic>?> createDailyClosing(Map<String, dynamic> closingData) async {
    try {
      final response = await dio.post('/daily-closings', data: closingData);
      if ((response.statusCode == 200 || response.statusCode == 201) && response.data is Map) {
        return Map<String, dynamic>.from(response.data as Map);
      }
    } catch (_) {}
    return null;
  }
}

