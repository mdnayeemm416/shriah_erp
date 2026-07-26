import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:hive/hive.dart';
import 'package:shriah_erp/core/api/api_client.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  HttpOverrides.global = null;

  setUpAll(() async {
    final tempDir = Directory.systemTemp.createTempSync('hive_test');
    Hive.init(tempDir.path);
    await ApiClient().init();
  });

  group('ApiClient Integration Tests', () {
    final client = ApiClient();

    test('checkHealth returns online status from live server', () async {
      final res = await client.checkHealth();
      expect(res, isNotNull);
      expect(res!['success'], equals(true));
      expect(res['message'], contains('Shriah ERP'));
    });

    test('login handles response safely without throwing exception', () async {
      final res = await client.login(identifier: 'admin', password: 'admin123');
      expect(res, isA<Map<String, dynamic>>());
      expect(res.containsKey('success'), isTrue);
    });

    test('getProducts returns list from live server', () async {
      final products = await client.getProducts();
      expect(products, isNotNull);
      expect(products, isA<List>());
    });

    test('getWholesaleCustomers returns list from live server', () async {
      final customers = await client.getWholesaleCustomers();
      expect(customers, isNotNull);
      expect(customers, isA<List>());
    });

    test('getWholesaleSales returns list from live server', () async {
      final sales = await client.getWholesaleSales();
      expect(sales, isNotNull);
      expect(sales, isA<List>());
    });

    test('getEmployees returns list from live server', () async {
      final employees = await client.getEmployees();
      expect(employees, isNotNull);
      expect(employees, isA<List>());
    });

    test('getSalesReturns returns list from live server', () async {
      final returns = await client.getSalesReturns();
      expect(returns, isNotNull);
      expect(returns, isA<List>());
    });

    test('getPriceCompares returns list from live server', () async {
      final compares = await client.getPriceCompares();
      expect(compares, isNotNull);
      expect(compares, isA<List>());
    });
  });
}
