import 'dart:io';
import 'package:dio/dio.dart';
import '../core/api/api_client.dart';
import '../core/api/endpoints/api_endpoints.dart';
import '../models/sales_visit_model.dart';

class SalesVisitRepository {
  final ApiClient _apiClient = ApiClient();

  Future<List<VisitRecord>> getSalesVisits({
    String? date,
    String? salesmanName,
    String? paymentType,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (date != null && date.isNotEmpty) {
        queryParams['date'] = date;
      }
      if (salesmanName != null && salesmanName.isNotEmpty && salesmanName != 'All Salesmen') {
        queryParams['salesman_name'] = salesmanName;
      }
      if (paymentType != null && paymentType.isNotEmpty && paymentType != 'All payment types') {
        queryParams['payment_type'] = paymentType;
      }

      final remoteList = await _apiClient.getList(
        ApiEndpoints.wholesaleSalesVisits,
        queryParameters: queryParams.isNotEmpty ? queryParams : null,
      );

      if (remoteList != null) {
        return remoteList
            .map((item) => VisitRecord.fromJson(Map<String, dynamic>.from(item as Map)))
            .toList();
      }
    } catch (e) {
      print('SalesVisitRepository.getSalesVisits error: $e');
      rethrow;
    }
    return [];
  }

  Future<VisitRecord?> saveSalesVisit(VisitRecord record) async {
    try {
      final formMap = <String, dynamic>{
        'customerName': record.customerName,
        'shopName': record.shopName,
        'amount': record.amount,
        'paymentType': record.paymentType == 'Partial' ? 'Split' : record.paymentType,
        'cashAmount': record.cashAmount,
        'bankAmount': record.bankAmount,
        'creditAmount': record.creditAmount,
        'notes': record.notes,
        'shopLocation': record.shopLocation,
        'salesmanName': record.salesmanName,
      };

      if (record.photoPath.isNotEmpty &&
          !record.photoPath.startsWith('http') &&
          !record.photoPath.startsWith('/uploads')) {
        final file = File(record.photoPath);
        if (await file.exists()) {
          final fileName = record.photoPath.split(Platform.pathSeparator).last;
          formMap['photo'] = await MultipartFile.fromFile(
            record.photoPath,
            filename: fileName,
          );
        }
      }

      final formData = FormData.fromMap(formMap);

      final response = await _apiClient.dio.post(
        ApiEndpoints.wholesaleSalesVisits,
        data: formData,
        options: Options(
          headers: {
            'Content-Type': 'multipart/form-data; boundary=${formData.boundary}',
          },
        ),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final body = response.data is Map ? Map<String, dynamic>.from(response.data as Map) : <String, dynamic>{};
        if (body['success'] == true && body['data'] != null) {
          final data = Map<String, dynamic>.from(body['data'] as Map);
          final serverId = data['id']?.toString() ?? record.id;
          final serverPhotoUrl = data['photoUrl']?.toString() ?? record.photoPath;
          
          return record.copyWith(
            id: serverId,
            photoPath: serverPhotoUrl,
          );
        }
      }
    } catch (e) {
      print('SalesVisitRepository.saveSalesVisit error: $e');
      rethrow;
    }
    return null;
  }


  Future<List<SalesCustomerModel>> getSalesCustomers() async {
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.salesCustomers);
      if (remoteList != null) {
        return remoteList
            .map((item) => SalesCustomerModel.fromJson(Map<String, dynamic>.from(item as Map)))
            .toList();
      }
    } catch (e) {
      print('SalesVisitRepository.getSalesCustomers error: $e');
      rethrow;
    }
    return [];
  }

  Future<SalesCustomerModel?> saveSalesCustomer(SalesCustomerModel customer) async {
    try {
      final payload = customer.toJson();
      final res = await _apiClient.postMap(ApiEndpoints.salesCustomers, payload);
      if (res != null) {
        return SalesCustomerModel.fromJson(res);
      }
    } catch (e) {
      print('SalesVisitRepository.saveSalesCustomer error: $e');
      rethrow;
    }
    return null;
  }

  Future<DailyVisitSummaryMetrics?> getDailyVisitSummary({String? date}) async {
    try {
      final queryParams = <String, dynamic>{};
      if (date != null && date.isNotEmpty) {
        queryParams['date'] = date;
      }
      final data = await _apiClient.getMap(
        ApiEndpoints.wholesaleSalesVisitsSummary,
        queryParameters: queryParams.isNotEmpty ? queryParams : null,
      );
      if (data != null) {
        return DailyVisitSummaryMetrics.fromJson(data);
      }
    } catch (e) {
      print('SalesVisitRepository.getDailyVisitSummary error: $e');
      rethrow;
    }
    return null;
  }

  Future<List<SalesmanPerformanceBreakdown>> getSalesmenBreakdown({String? date}) async {
    try {
      final queryParams = <String, dynamic>{};
      if (date != null && date.isNotEmpty) {
        queryParams['date'] = date;
      }
      final remoteList = await _apiClient.getList(
        ApiEndpoints.wholesaleSalesVisitsSalesmenBreakdown,
        queryParameters: queryParams.isNotEmpty ? queryParams : null,
      );
      if (remoteList != null) {
        return remoteList
            .map((item) => SalesmanPerformanceBreakdown.fromJson(Map<String, dynamic>.from(item as Map)))
            .toList();
      }
    } catch (e) {
      print('SalesVisitRepository.getSalesmenBreakdown error: $e');
      rethrow;
    }
    return [];
  }

  Future<List<String>> getSalesmen() async {
    try {
      final remoteList = await _apiClient.getList(ApiEndpoints.wholesaleSalesmen);
      if (remoteList != null) {
        return remoteList.map((item) {
          if (item is Map) {
            return (item['fullName'] ?? item['full_name'] ?? '').toString();
          }
          return item.toString();
        }).where((name) => name.isNotEmpty).toList();
      }
    } catch (e) {
      print('SalesVisitRepository.getSalesmen error: $e');
      rethrow;
    }
    return [];
  }

  Future<bool> deleteSalesVisit(String id) async {
    try {
      return await _apiClient.deleteBool(ApiEndpoints.wholesaleSalesVisitById(id));
    } catch (e) {
      print('SalesVisitRepository.deleteSalesVisit error: $e');
    }
    return false;
  }
}
