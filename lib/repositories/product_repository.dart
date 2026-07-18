import 'package:hive_flutter/hive_flutter.dart';
import 'package:uuid/uuid.dart';
import '../models/product_model.dart';

class ProductRepository {
  static const String _boxName = 'products';

  Future<void> initialize() async {
    Hive.registerAdapter(ProductModelAdapter());
    final box = await Hive.openBox<ProductModel>(_boxName);

    if (box.isEmpty) {
      await _seedData(box);
    }
  }

  Future<void> _seedData(Box<ProductModel> box) async {
    final uuid = const Uuid();
    final now = DateTime.now();

    final items = [
      ProductModel(
        id: uuid.v4(),
        name: 'Almarai Fresh Milk 1L',
        nameAr: 'المراعي حليب طازج ١ لتر',
        nameBn: 'আলমারাই ফ্রেশ মিল্ক ১ লিটার',
        barcode: '6281007011234',
        itemCode: 'MILK-1L',
        price: 6.50,
        purchasePrice: 5.20,
        stock: 24.0,
        minStock: 5.0,
        createdAt: now,
      ),
      ProductModel(
        id: uuid.v4(),
        name: 'Lipton Yellow Label Tea 100 Bags',
        nameAr: 'ليبتون شاي العلامة الصفراء ١٠٠ كيس',
        nameBn: 'লিপটন চা ১০০ ব্যাগ',
        barcode: '6281013025432',
        itemCode: 'LIPT-100',
        price: 15.00,
        purchasePrice: 12.00,
        stock: 15.0,
        minStock: 4.0,
        createdAt: now,
      ),
      ProductModel(
        id: uuid.v4(),
        name: 'Sadia Chicken Breast 1kg',
        nameAr: 'ساديا صدور دجاج ١ كجم',
        nameBn: 'সাদিয়া মুরগির বুকের মাংস ১ কেজি',
        barcode: '7891515432109',
        itemCode: 'SAD-1KG',
        price: 26.95,
        purchasePrice: 22.10,
        stock: 3.0, // Low stock!
        minStock: 6.0,
        createdAt: now,
      ),
      ProductModel(
        id: uuid.v4(),
        name: 'Indomie Chicken Noodles 5-Pack',
        nameAr: 'إندومي نودلز الدجاج ٥ حبات',
        nameBn: 'ইনডমি নুডলস চিকেন ৫ প্যাকেট',
        barcode: '6281101230198',
        itemCode: 'IND-5P',
        price: 7.50,
        purchasePrice: 6.00,
        stock: 8.0, // Low stock!
        minStock: 10.0,
        createdAt: now,
      ),
    ];

    for (final p in items) {
      await box.put(p.id, p);
    }
  }

  Future<List<ProductModel>> getProducts() async {
    final box = Hive.box<ProductModel>(_boxName);
    return box.values.where((p) => !p.isDeleted).toList();
  }

  Future<List<ProductModel>> getLowStockProducts() async {
    final box = Hive.box<ProductModel>(_boxName);
    return box.values
        .where((p) => !p.isDeleted && p.stock <= p.minStock)
        .toList();
  }

  Future<ProductModel?> getProductByBarcode(String barcode) async {
    final box = Hive.box<ProductModel>(_boxName);
    try {
      return box.values.firstWhere((p) => !p.isDeleted && p.barcode == barcode);
    } catch (_) {
      return null;
    }
  }

  Future<void> saveProduct(ProductModel product) async {
    final box = Hive.box<ProductModel>(_boxName);
    await box.put(product.id, product);
  }

  Future<void> updateStock(String id, double newStock) async {
    final box = Hive.box<ProductModel>(_boxName);
    final p = box.get(id);
    if (p != null) {
      await box.put(id, p.copyWith(stock: newStock));
    }
  }

  Future<void> deleteProduct(String id) async {
    final box = Hive.box<ProductModel>(_boxName);
    final p = box.get(id);
    if (p != null) {
      await box.put(id, p.copyWith(isDeleted: true));
    }
  }
}
