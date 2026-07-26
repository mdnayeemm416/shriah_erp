import 'package:hive_flutter/hive_flutter.dart';
import 'package:uuid/uuid.dart';
import '../models/shop_model.dart';
import '../models/cashier_model.dart';
import '../models/shop_entry_model.dart';

class ShopRepository {
  static const String _shopsBoxName = 'shops';
  static const String _cashiersBoxName = 'cashiers';
  static const String _entriesBoxName = 'shop_entries';

  Future<void> initialize() async {
    Hive.registerAdapter(ShopModelAdapter());
    Hive.registerAdapter(CashierModelAdapter());
    Hive.registerAdapter(ShopEntryModelAdapter());

    final shopsBox = await Hive.openBox<ShopModel>(_shopsBoxName);
    final cashiersBox = await Hive.openBox<CashierModel>(_cashiersBoxName);
    final entriesBox = await Hive.openBox<ShopEntryModel>(_entriesBoxName);

    if (shopsBox.isEmpty) {
      await _seedData(shopsBox, cashiersBox, entriesBox);
    }
  }

  Future<void> _seedData(
    Box<ShopModel> shopsBox,
    Box<CashierModel> cashiersBox,
    Box<ShopEntryModel> entriesBox,
  ) async {
    const uuid = Uuid();

    // 1. Seed Shops
    final shop1 = ShopModel(id: 'shop-1', name: 'Main Shop Riyadh', shopType: 'full_erp', createdAt: DateTime.now().subtract(const Duration(days: 30)));
    final shop2 = ShopModel(id: 'shop-2', name: 'Al-Khobar Retail', shopType: 'simple_cash', createdAt: DateTime.now().subtract(const Duration(days: 20)));
    final shop3 = ShopModel(id: 'shop-3', name: 'Jeddah Warehouse', shopType: 'full_erp', createdAt: DateTime.now().subtract(const Duration(days: 15)));

    await shopsBox.putAll({
      shop1.id: shop1,
      shop2.id: shop2,
      shop3.id: shop3,
    });

    // 2. Seed Cashiers
    final cashier1 = CashierModel(id: 'cashier-1', name: 'Ahsan Khan', shopId: 'shop-1');
    final cashier2 = CashierModel(id: 'cashier-2', name: 'Sayeed Ahmed', shopId: 'shop-1');
    final cashier3 = CashierModel(id: 'cashier-3', name: 'Zubair Al-Harbi', shopId: 'shop-2');

    await cashiersBox.putAll({
      cashier1.id: cashier1,
      cashier2.id: cashier2,
      cashier3.id: cashier3,
    });

    // 3. Seed Shop Entries (Daily records for the past 5 days)
    final now = DateTime.now();
    final entries = <ShopEntryModel>[];

    for (int i = 5; i >= 0; i--) {
      final date = now.subtract(Duration(days: i));
      
      // Shop 1 Entries
      entries.add(ShopEntryModel(
        id: uuid.v4(),
        shopId: 'shop-1',
        cashierId: 'cashier-1',
        entryType: 'sale',
        posSale: 1200.0 + (i * 150),
        cashSale: 800.0 + (i * 100),
        bankSale: 950.0 + (i * 200),
        creditSale: 300.0,
        notes: 'End of day POS sync for cashier 1',
        txnDate: date,
        createdAt: date,
      ));

      entries.add(ShopEntryModel(
        id: uuid.v4(),
        shopId: 'shop-1',
        cashierId: 'cashier-1',
        entryType: 'purchase',
        purchaseAmount: 500.0 + (i * 50),
        notes: 'Cardboard cartons and packaging tapes',
        txnDate: date,
        createdAt: date,
      ));

      entries.add(ShopEntryModel(
        id: uuid.v4(),
        shopId: 'shop-1',
        cashierId: 'cashier-2',
        entryType: 'expense',
        expenseAmount: 120.0,
        notes: 'Teatime snacks and coffee',
        txnDate: date,
        createdAt: date,
      ));

      entries.add(ShopEntryModel(
        id: uuid.v4(),
        shopId: 'shop-1',
        cashierId: 'cashier-2',
        entryType: 'withdraw',
        withdrawAmount: 1000.0,
        notes: 'Cash deposit to Riyadh Bank account',
        txnDate: date,
        createdAt: date,
      ));

      // Shop 2 Entries
      entries.add(ShopEntryModel(
        id: uuid.v4(),
        shopId: 'shop-2',
        cashierId: 'cashier-3',
        entryType: 'sale',
        posSale: 400.0 + (i * 80),
        cashSale: 600.0 + (i * 110),
        bankSale: 300.0 + (i * 40),
        txnDate: date,
        createdAt: date,
      ));

      entries.add(ShopEntryModel(
        id: uuid.v4(),
        shopId: 'shop-2',
        cashierId: 'cashier-3',
        entryType: 'expense',
        expenseAmount: 80.0,
        notes: 'Cleaning supplies',
        txnDate: date,
        createdAt: date,
      ));
    }

    for (final e in entries) {
      await entriesBox.put(e.id, e);
    }
  }

  // --- CRUD for Shops ---
  Future<List<ShopModel>> getShops() async {
    final box = Hive.box<ShopModel>(_shopsBoxName);
    return box.values.where((s) => !s.isDeleted).toList();
  }

  Future<void> saveShop(ShopModel shop) async {
    final box = Hive.box<ShopModel>(_shopsBoxName);
    await box.put(shop.id, shop);
  }

  // --- CRUD for Cashiers ---
  Future<List<CashierModel>> getCashiers(String shopId) async {
    final box = Hive.box<CashierModel>(_cashiersBoxName);
    return box.values.where((c) => c.shopId == shopId && !c.isDeleted).toList();
  }

  Future<List<CashierModel>> getAllCashiers() async {
    final box = Hive.box<CashierModel>(_cashiersBoxName);
    return box.values.where((c) => !c.isDeleted).toList();
  }

  Future<void> saveCashier(CashierModel cashier) async {
    final box = Hive.box<CashierModel>(_cashiersBoxName);
    await box.put(cashier.id, cashier);
  }

  // --- CRUD for Entries ---
  Future<List<ShopEntryModel>> getEntries({String? shopId, DateTime? date}) async {
    final box = Hive.box<ShopEntryModel>(_entriesBoxName);
    var query = box.values.where((e) => !e.isDeleted);
    
    if (shopId != null) {
      query = query.where((e) => e.shopId == shopId);
    }
    
    if (date != null) {
      final dateStr = date.toIso8601String().split('T')[0];
      query = query.where((e) => e.txnDate.toIso8601String().split('T')[0] == dateStr);
    }
    
    return query.toList()..sort((a, b) => b.txnDate.compareTo(a.txnDate));
  }

  Future<void> saveEntry(ShopEntryModel entry) async {
    final box = Hive.box<ShopEntryModel>(_entriesBoxName);
    await box.put(entry.id, entry);
  }

  Future<void> deleteEntry(String id) async {
    final box = Hive.box<ShopEntryModel>(_entriesBoxName);
    final entry = box.get(id);
    if (entry != null) {
      await box.put(id, entry.copyWith(isDeleted: true));
    }
  }
}
