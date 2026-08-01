import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:hive/hive.dart';
import 'package:shriah_erp/core/api/api_client.dart';
import 'package:shriah_erp/core/api/endpoints/api_endpoints.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  HttpOverrides.global = null;

  setUpAll(() async {
    final tempDir = Directory.systemTemp.createTempSync('hive_test');
    Hive.init(tempDir.path);
    await ApiClient().init();
  });

  group('ApiClient Generic Integration Tests', () {
    final client = ApiClient();

    test('checkHealth returns online status from live server', () async {
      final res = await client.getMap(ApiEndpoints.health);
      expect(res, isNotNull);
    });

    test('getProducts endpoint returns list from live server', () async {
      final products = await client.getList(ApiEndpoints.products);
      expect(products, isNotNull);
      expect(products, isA<List>());
    });

    test('getWholesaleCustomers endpoint returns list from live server', () async {
      final customers = await client.getList(ApiEndpoints.wholesaleCustomers);
      expect(customers, isNotNull);
      expect(customers, isA<List>());
    });

    test('getWholesaleSales endpoint returns list from live server', () async {
      final sales = await client.getList(ApiEndpoints.wholesaleSales);
      expect(sales, isNotNull);
      expect(sales, isA<List>());
    });

    test('getEmployees endpoint returns list from live server', () async {
      final employees = await client.getList(ApiEndpoints.employees);
      expect(employees, isNotNull);
      expect(employees, isA<List>());
    });

    test('getSalesReturns endpoint returns list from live server', () async {
      final returns = await client.getList(ApiEndpoints.wholesaleSalesReturns);
      expect(returns, isNotNull);
      expect(returns, isA<List>());
    });

    test('getPriceCompares endpoint returns list from live server', () async {
      final compares = await client.getList(ApiEndpoints.wholesalePriceCompares);
      expect(compares, isNotNull);
      expect(compares, isA<List>());
    });

    test('getSalesReturnSummary endpoint returns summary object from live server', () async {
      try {
        final summary = await client.getMap('${ApiEndpoints.wholesaleSalesReturns}/summary');
        expect(summary, isNotNull);
        expect(summary!['today'], isNotNull);
        expect(summary['this_month'], isNotNull);
        expect(summary['total'], isNotNull);
      } catch (e) {
        expect(e.toString(), contains('Server Error'));
      }
    });
  });
}
