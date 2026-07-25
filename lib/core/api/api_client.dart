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
}
