import 'package:hive_flutter/hive_flutter.dart';
import 'package:uuid/uuid.dart';
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
    Hive.registerAdapter(WholesaleCustomerModelAdapter());
    Hive.registerAdapter(WholesalePaymentModelAdapter());
    Hive.registerAdapter(WholesaleSaleItemModelAdapter());
    Hive.registerAdapter(WholesaleSaleModelAdapter());
    Hive.registerAdapter(WholesalePurchaseModelAdapter());
    Hive.registerAdapter(WholesaleOrderModelAdapter());
    Hive.registerAdapter(WholesaleCategoryModelAdapter());

    // Open boxes
    final customersBox = await Hive.openBox<WholesaleCustomerModel>(_customersBoxName);
    final paymentsBox = await Hive.openBox<WholesalePaymentModel>(_paymentsBoxName);
    final salesBox = await Hive.openBox<WholesaleSaleModel>(_salesBoxName);
    final purchasesBox = await Hive.openBox<WholesalePurchaseModel>(_purchasesBoxName);
    final ordersBox = await Hive.openBox<WholesaleOrderModel>(_ordersBoxName);
    final categoriesBox = await Hive.openBox<WholesaleCategoryModel>(_categoriesBoxName);

    // Seed mock data if empty
    if (customersBox.isEmpty && ordersBox.isEmpty && categoriesBox.isEmpty) {
      await _seedData(customersBox, paymentsBox, salesBox, purchasesBox, ordersBox, categoriesBox);
    }
  }

  Future<void> _seedData(
    Box<WholesaleCustomerModel> customersBox,
    Box<WholesalePaymentModel> paymentsBox,
    Box<WholesaleSaleModel> salesBox,
    Box<WholesalePurchaseModel> purchasesBox,
    Box<WholesaleOrderModel> ordersBox,
    Box<WholesaleCategoryModel> categoriesBox,
  ) async {
    final uuid = const Uuid();
    final now = DateTime.now();

    final cat1 = WholesaleCategoryModel(id: 'cat-1', name: 'Dairy & Milk', nameAr: 'الألبان والحليب', nameBn: 'দুগ্ধ ও দুধ', sortOrder: 1);
    final cat2 = WholesaleCategoryModel(id: 'cat-2', name: 'Beverages', nameAr: 'المشروبات', nameBn: 'পানীয়', sortOrder: 2);
    final cat3 = WholesaleCategoryModel(id: 'cat-3', name: 'Dry Groceries', nameAr: 'البقالة الجافة', nameBn: 'শুকনো মুদি', sortOrder: 3);
    await categoriesBox.putAll({
      cat1.id: cat1,
      cat2.id: cat2,
      cat3.id: cat3,
    });

    final cust1 = WholesaleCustomerModel(id: 'cust-1', name: 'Azzouz Supermarket', mobile: '966551234567', openingDue: 1500.0, createdAt: now);
    final cust2 = WholesaleCustomerModel(id: 'cust-2', name: 'Riyadh Retail Corp', mobile: '966552345678', openingDue: 0.0, createdAt: now);
    final cust3 = WholesaleCustomerModel(id: 'cust-3', name: 'Nujum Al-Madinah', mobile: '966553456789', openingDue: 800.0, createdAt: now);
    await customersBox.putAll({
      cust1.id: cust1,
      cust2.id: cust2,
      cust3.id: cust3,
    });

    final pay1 = WholesalePaymentModel(id: uuid.v4(), customerId: 'cust-1', amount: 500.0, kind: 'payment_in', notes: 'Cash deposit on account', createdAt: now.subtract(const Duration(days: 2)));
    await paymentsBox.put(pay1.id, pay1);

    final saleItem1 = WholesaleSaleItemModel(productId: 'prod-1', name: 'Almarai Fresh Milk 1L', qty: 10, price: 6.50, purchasePrice: 5.20);
    final saleItem2 = WholesaleSaleItemModel(productId: 'prod-2', name: 'Lipton Yellow Label Tea 100 Bags', qty: 5, price: 15.00, purchasePrice: 12.00);
    
    final sale1 = WholesaleSaleModel(
      id: uuid.v4(),
      invoiceNumber: 1001,
      customerId: 'cust-1',
      customerName: 'Azzouz Supermarket',
      customerMobile: '966551234567',
      items: [saleItem1, saleItem2],
      total: 140.0,
      discount: 10.0,
      dueAmount: 130.0,
      paymentMethod: 'due',
      createdAt: now.subtract(const Duration(days: 1)),
    );
    await salesBox.put(sale1.id, sale1);

    final orderItem1 = WholesaleSaleItemModel(productId: 'prod-1', name: 'Almarai Fresh Milk 1L', qty: 20, price: 6.50, purchasePrice: 5.20);
    final orderItem2 = WholesaleSaleItemModel(productId: 'prod-3', name: 'Sadia Chicken Breast 1kg', qty: 10, price: 26.95, purchasePrice: 22.10);
    
    final order1 = WholesaleOrderModel(
      id: uuid.v4(),
      orderNumber: 5001,
      customerName: 'Khaled Bin Waleed Store',
      customerMobile: '966559988776',
      customerAddress: 'Olaya District, Riyadh',
      items: [orderItem1, orderItem2],
      total: 399.50,
      notes: 'Please pack carefully and deliver by afternoon',
      status: 'pending',
      createdAt: now,
    );
    await ordersBox.put(order1.id, order1);
  }

  // --- Customers CRUD ---
  Future<List<WholesaleCustomerModel>> getCustomers() async {
    final box = Hive.box<WholesaleCustomerModel>(_customersBoxName);
    try {
      final remoteList = await _apiClient.getWholesaleCustomers();
      if (remoteList != null && remoteList.isNotEmpty) {
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
  }

  // --- Payments CRUD ---
  Future<List<WholesalePaymentModel>> getPayments() async {
    final box = Hive.box<WholesalePaymentModel>(_paymentsBoxName);
    return box.values.where((p) => !p.isDeleted).toList();
  }

  Future<void> savePayment(WholesalePaymentModel payment) async {
    final box = Hive.box<WholesalePaymentModel>(_paymentsBoxName);
    await box.put(payment.id, payment);
  }

  // --- Sales CRUD ---
  Future<List<WholesaleSaleModel>> getSales() async {
    final box = Hive.box<WholesaleSaleModel>(_salesBoxName);
    try {
      final remoteList = await _apiClient.getWholesaleSales();
      if (remoteList != null && remoteList.isNotEmpty) {
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
    return box.values.where((p) => !p.isDeleted).toList();
  }

  Future<void> savePurchase(WholesalePurchaseModel purchase) async {
    final box = Hive.box<WholesalePurchaseModel>(_purchasesBoxName);
    await box.put(purchase.id, purchase);
  }

  // --- Orders CRUD ---
  Future<List<WholesaleOrderModel>> getOrders() async {
    final box = Hive.box<WholesaleOrderModel>(_ordersBoxName);
    return box.values.where((o) => !o.isDeleted).toList();
  }

  Future<void> saveOrder(WholesaleOrderModel order) async {
    final box = Hive.box<WholesaleOrderModel>(_ordersBoxName);
    await box.put(order.id, order);
  }

  // --- Categories CRUD ---
  Future<List<WholesaleCategoryModel>> getCategories() async {
    final box = Hive.box<WholesaleCategoryModel>(_categoriesBoxName);
    return box.values.toList()..sort((a, b) => a.sortOrder.compareTo(b.sortOrder));
  }

  Future<void> saveCategory(WholesaleCategoryModel category) async {
    final box = Hive.box<WholesaleCategoryModel>(_categoriesBoxName);
    await box.put(category.id, category);
  }
}
