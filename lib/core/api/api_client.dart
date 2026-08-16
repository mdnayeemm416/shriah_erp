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
        responseHeader: true,
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

  // --- Pure Generic HTTP Verbs ---

  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) {
    return dio.get<T>(path, queryParameters: queryParameters, options: options);
  }

  Future<Response<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) {
    return dio.post<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
    );
  }

  Future<Response<T>> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) {
    return dio.put<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
    );
  }

  Future<Response<T>> delete<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) {
    return dio.delete<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
    );
  }

  // --- Generic Typed Helper Methods for Repositories ---

  Future<List<dynamic>?> getList(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final response = await get(path, queryParameters: queryParameters);
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true) {
          if (body['data'] is List) {
            return body['data'] as List<dynamic>;
          }
        } else {
          throw Exception(body['message'] ?? 'API request failed');
        }
      } else if (response.data is Map) {
        final body = response.data as Map;
        throw Exception(
          body['message'] ?? 'Server error ${response.statusCode}',
        );
      }
    } on DioException catch (e) {
      if (e.response?.data is Map) {
        final body = Map<String, dynamic>.from(e.response!.data as Map);
        throw Exception(
          body['message'] ?? 'Server error ${e.response?.statusCode}',
        );
      }
      rethrow;
    }
    return null;
  }

  Future<Map<String, dynamic>?> getMap(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final response = await get(path, queryParameters: queryParameters);
      if (response.statusCode == 200 && response.data is Map) {
        final body = response.data as Map;
        if (body['success'] == true) {
          if (body['data'] is Map) {
            return Map<String, dynamic>.from(body['data'] as Map);
          }
        } else {
          throw Exception(body['message'] ?? 'API request failed');
        }
      } else if (response.data is Map) {
        final body = response.data as Map;
        throw Exception(
          body['message'] ?? 'Server error ${response.statusCode}',
        );
      }
    } on DioException catch (e) {
      if (e.response?.data is Map) {
        final body = Map<String, dynamic>.from(e.response!.data as Map);
        throw Exception(
          body['message'] ?? 'Server error ${e.response?.statusCode}',
        );
      }
      rethrow;
    }
    return null;
  }

  Future<Map<String, dynamic>?> postMap(
    String path,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await post(path, data: data);
      if ((response.statusCode == 200 || response.statusCode == 201) &&
          response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        if (body['success'] == false) {
          throw Exception(body['message'] ?? 'API request failed');
        }
        return body;
      } else if (response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        throw Exception(
          body['message'] ?? 'Server error ${response.statusCode}',
        );
      }
    } on DioException catch (e) {
      if (e.response?.data is Map) {
        final body = Map<String, dynamic>.from(e.response!.data as Map);
        throw Exception(
          body['message'] ?? 'Server error ${e.response?.statusCode}',
        );
      }
      rethrow;
    }
    return null;
  }

  Future<Map<String, dynamic>?> putMap(
    String path,
    Map<String, dynamic> data,
  ) async {
    try {
      final response = await put(path, data: data);
      if ((response.statusCode == 200 || response.statusCode == 201) &&
          response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        if (body['success'] == false) {
          throw Exception(body['message'] ?? 'API request failed');
        }
        return body;
      } else if (response.data is Map) {
        final body = Map<String, dynamic>.from(response.data as Map);
        throw Exception(
          body['message'] ?? 'Server error ${response.statusCode}',
        );
      }
    } on DioException catch (e) {
      if (e.response?.data is Map) {
        final body = Map<String, dynamic>.from(e.response!.data as Map);
        throw Exception(
          body['message'] ?? 'Server error ${e.response?.statusCode}',
        );
      }
      rethrow;
    }
    return null;
  }

  Future<bool> deleteBool(String path) async {
    try {
      final response = await delete(path);
      if (response.statusCode == 200) {
        if (response.data is Map) {
          final body = response.data as Map;
          if (body['success'] == false) {
            throw Exception(body['message'] ?? 'Delete request failed');
          }
        }
        return true;
      } else if (response.data is Map) {
        final body = response.data as Map;
        throw Exception(
          body['message'] ?? 'Server error ${response.statusCode}',
        );
      }
    } on DioException catch (e) {
      if (e.response?.data is Map) {
        final body = Map<String, dynamic>.from(e.response!.data as Map);
        throw Exception(
          body['message'] ?? 'Server error ${e.response?.statusCode}',
        );
      }
      rethrow;
    }
    return false;
  }
}
