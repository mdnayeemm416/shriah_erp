import 'package:hive_flutter/hive_flutter.dart';
import '../core/api/api_client.dart';
import '../models/wholesale_models.dart';

class WholesaleRepository {
  static const String _customersBoxName = 'wholesale_customers';
  static const String _paymentsBoxName = 'wholesale_payments';
  static const String _salesBoxName = 'wholesale_sales';
  static const String _purchasesBoxName = 'wholesale_purchases';
  static const String _ordersBoxName = 'wholesale_orders';
  static const String _categoriesBoxName = 'wholesale_categories';
  final ApiClient _apiClient = ApiClient();

  Future<void> initialize() async {
    // Register adapters
    if (!Hive.isAdapterRegistered(14)) Hive.registerAdapter(WholesaleCustomerModelAdapter());
    if (!Hive.isAdapterRegistered(15)) Hive.registerAdapter(WholesalePaymentModelAdapter());
    if (!Hive.isAdapterRegistered(17)) Hive.registerAdapter(WholesaleSaleItemModelAdapter());
    if (!Hive.isAdapterRegistered(16)) Hive.registerAdapter(WholesaleSaleModelAdapter());
    if (!Hive.isAdapterRegistered(18)) Hive.registerAdapter(WholesalePurchaseModelAdapter());
    if (!Hive.isAdapterRegistered(19)) Hive.registerAdapter(WholesaleOrderModelAdapter());
    if (!Hive.isAdapterRegistered(20)) Hive.registerAdapter(WholesaleCategoryModelAdapter());

    // Open boxes
    await Hive.openBox<WholesaleCustomerModel>(_customersBoxName);
    await Hive.openBox<WholesalePaymentModel>(_paymentsBoxName);
    await Hive.openBox<WholesaleSaleModel>(_salesBoxName);
    await Hive.openBox<WholesalePurchaseModel>(_purchasesBoxName);
    await Hive.openBox<WholesaleOrderModel>(_ordersBoxName);
    await Hive.openBox<WholesaleCategoryModel>(_categoriesBoxName);
  }

  // --- Executive Dashboard Summary & Receivables ---
  Future<Map<String, dynamic>?> getDashboardSummary() async {
    return await _apiClient.getWholesaleDashboardSummary();
  }

  Future<List<dynamic>?> getReceivablesBreakdown() async {
    return await _apiClient.getWholesaleReceivablesBreakdown();
  }

  // --- Customers CRUD ---
  Future<List<WholesaleCustomerModel>> getCustomers() async {
    final box = Hive.box<WholesaleCustomerModel>(_customersBoxName);
    try {
      final remoteList = await _apiClient.getWholesaleCustomers();
      if (remoteList != null) {
        await box.clear();
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final c = WholesaleCustomerModel.fromJson(item);
            if (c.id.isNotEmpty) {
              await box.put(c.id, c);
            }
          }
        }
      }
    } catch (_) {}
    return box.values.where((c) => !c.isDeleted).toList();
  }

  Future<void> saveCustomer(WholesaleCustomerModel customer) async {
    final box = Hive.box<WholesaleCustomerModel>(_customersBoxName);
    await box.put(customer.id, customer);
    try {
      await _apiClient.createWholesaleCustomer(customer.toJson());
    } catch (_) {}
  }

  Future<void> deleteCustomer(String customerId) async {
    final box = Hive.box<WholesaleCustomerModel>(_customersBoxName);
    final customer = box.get(customerId);
    if (customer != null) {
      await box.put(customerId, customer.copyWith(isDeleted: true));
    }
    try {
      await _apiClient.deleteWholesaleCustomer(customerId);
    } catch (_) {}
  }

  Future<Map<String, dynamic>?> getCustomerStatement(String customerId) async {
    return await _apiClient.getWholesaleCustomerStatement(customerId);
  }

  // --- Payments CRUD ---
  Future<List<WholesalePaymentModel>> getPayments() async {
    final box = Hive.box<WholesalePaymentModel>(_paymentsBoxName);
    try {
      final remoteList = await _apiClient.getWholesalePayments();
      if (remoteList != null) {
        await box.clear();
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final p = WholesalePaymentModel.fromJson(item);
            if (p.id.isNotEmpty) {
              await box.put(p.id, p);
            }
          }
        }
      }
    } catch (_) {}
    return box.values.where((p) => !p.isDeleted).toList();
  }

  Future<void> savePayment(WholesalePaymentModel payment) async {
    final box = Hive.box<WholesalePaymentModel>(_paymentsBoxName);
    await box.put(payment.id, payment);
    try {
      await _apiClient.createWholesalePayment(payment.toJson());
    } catch (_) {}
  }

  Future<void> deletePayment(String paymentId) async {
    final box = Hive.box<WholesalePaymentModel>(_paymentsBoxName);
    final payment = box.get(paymentId);
    if (payment != null) {
      await box.put(paymentId, payment.copyWith(isDeleted: true));
    }
    try {
      await _apiClient.deleteWholesalePayment(paymentId);
    } catch (_) {}
  }

  // --- Sales CRUD ---
  Future<List<WholesaleSaleModel>> getSales() async {
    final box = Hive.box<WholesaleSaleModel>(_salesBoxName);
    try {
      final remoteList = await _apiClient.getWholesaleSales();
      if (remoteList != null) {
        await box.clear();
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final s = WholesaleSaleModel.fromJson(item);
            if (s.id.isNotEmpty) {
              await box.put(s.id, s);
            }
          }
        }
      }
    } catch (_) {}
    return box.values.where((s) => !s.isDeleted).toList();
  }

  Future<void> saveSale(WholesaleSaleModel sale) async {
    final box = Hive.box<WholesaleSaleModel>(_salesBoxName);
    await box.put(sale.id, sale);
    try {
      await _apiClient.createWholesaleSale(sale.toJson());
    } catch (_) {}
  }

  Future<void> cancelSale(String saleId) async {
    final box = Hive.box<WholesaleSaleModel>(_salesBoxName);
    final sale = box.get(saleId);
    if (sale != null) {
      await box.put(saleId, sale.copyWith(status: 'cancelled'));
    }
    try {
      await _apiClient.cancelWholesaleSale(saleId);
    } catch (_) {}
  }

  Future<void> deleteSale(String saleId) async {
    final box = Hive.box<WholesaleSaleModel>(_salesBoxName);
    final sale = box.get(saleId);
    if (sale != null) {
      await box.put(saleId, sale.copyWith(isDeleted: true));
    }
    try {
      await _apiClient.deleteWholesaleSale(saleId);
    } catch (_) {}
  }

  // --- Sales Returns API Integration ---
  Future<List<WholesaleSalesReturnModel>> getSalesReturns() async {
    final list = <WholesaleSalesReturnModel>[];
    try {
      final remoteList = await _apiClient.getSalesReturns();
      if (remoteList != null) {
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            list.add(WholesaleSalesReturnModel.fromJson(item));
          }
        }
      }
    } catch (_) {}
    return list;
  }

  Future<Map<String, dynamic>?> createSalesReturn(WholesaleSalesReturnModel salesReturn) async {
    try {
      return await _apiClient.createSalesReturn(salesReturn.toJson());
    } catch (_) {
      return null;
    }
  }

  // --- Purchases CRUD ---
  Future<List<WholesalePurchaseModel>> getPurchases() async {
    final box = Hive.box<WholesalePurchaseModel>(_purchasesBoxName);
    try {
      final remoteList = await _apiClient.getWholesalePurchases();
      if (remoteList != null) {
        await box.clear();
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final p = WholesalePurchaseModel.fromJson(item);
            if (p.id.isNotEmpty) {
              await box.put(p.id, p);
            }
          }
        }
      }
    } catch (_) {}
    return box.values.where((p) => !p.isDeleted).toList();
  }

  Future<void> savePurchase(WholesalePurchaseModel purchase) async {
    final box = Hive.box<WholesalePurchaseModel>(_purchasesBoxName);
    await box.put(purchase.id, purchase);
    try {
      await _apiClient.createWholesalePurchase(purchase.toJson());
    } catch (_) {}
  }

  Future<void> deletePurchase(String purchaseId) async {
    final box = Hive.box<WholesalePurchaseModel>(_purchasesBoxName);
    final purchase = box.get(purchaseId);
    if (purchase != null) {
      await box.put(purchaseId, purchase.copyWith(isDeleted: true));
    }
    try {
      await _apiClient.deleteWholesalePurchase(purchaseId);
    } catch (_) {}
  }

  // --- Orders CRUD ---
  Future<List<WholesaleOrderModel>> getOrders() async {
    final box = Hive.box<WholesaleOrderModel>(_ordersBoxName);
    try {
      final remoteList = await _apiClient.getWholesaleOrders();
      if (remoteList != null) {
        await box.clear();
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final o = WholesaleOrderModel.fromJson(item);
            if (o.id.isNotEmpty) {
              await box.put(o.id, o);
            }
          }
        }
      }
    } catch (_) {}
    return box.values.where((o) => !o.isDeleted).toList();
  }

  Future<void> saveOrder(WholesaleOrderModel order) async {
    final box = Hive.box<WholesaleOrderModel>(_ordersBoxName);
    await box.put(order.id, order);
    try {
      await _apiClient.createWholesaleOrder(order.toJson());
    } catch (_) {}
  }

  Future<void> updateOrderStatus(String orderId, String status) async {
    final box = Hive.box<WholesaleOrderModel>(_ordersBoxName);
    final order = box.get(orderId);
    if (order != null) {
      await box.put(orderId, order.copyWith(status: status));
    }
    try {
      await _apiClient.updateWholesaleOrderStatus(orderId, status);
    } catch (_) {}
  }

  Future<void> deleteOrder(String orderId) async {
    final box = Hive.box<WholesaleOrderModel>(_ordersBoxName);
    final order = box.get(orderId);
    if (order != null) {
      await box.put(orderId, order.copyWith(isDeleted: true));
    }
    try {
      await _apiClient.deleteWholesaleOrder(orderId);
    } catch (_) {}
  }

  // --- Categories CRUD ---
  Future<List<WholesaleCategoryModel>> getCategories() async {
    final box = Hive.box<WholesaleCategoryModel>(_categoriesBoxName);
    try {
      final remoteList = await _apiClient.getWholesaleCategories();
      if (remoteList != null) {
        await box.clear();
        for (final item in remoteList) {
          if (item is Map<String, dynamic>) {
            final cat = WholesaleCategoryModel.fromJson(item);
            if (cat.id.isNotEmpty) {
              await box.put(cat.id, cat);
            }
          }
        }
      }
    } catch (_) {}
    return box.values.toList()..sort((a, b) => a.sortOrder.compareTo(b.sortOrder));
  }

  Future<void> saveCategory(WholesaleCategoryModel category) async {
    final box = Hive.box<WholesaleCategoryModel>(_categoriesBoxName);
    await box.put(category.id, category);
    try {
      await _apiClient.createWholesaleCategory(category.toJson());
    } catch (_) {}
  }
}

