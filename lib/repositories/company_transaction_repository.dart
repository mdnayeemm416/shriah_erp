import 'package:hive_flutter/hive_flutter.dart';
import 'package:uuid/uuid.dart';
import '../models/company_transaction_model.dart';

class CompanyTransactionRepository {
  static const String _boxName = 'company_transactions';

  Future<void> initialize() async {
    Hive.registerAdapter(CompanyTransactionModelAdapter());
    final box = await Hive.openBox<CompanyTransactionModel>(_boxName);

    if (box.isEmpty) {
      await _seedData(box);
    }
  }

  Future<void> _seedData(Box<CompanyTransactionModel> box) async {
    const uuid = Uuid();
    final now = DateTime.now();

    final txns = [
      CompanyTransactionModel(
        id: uuid.v4(),
        amount: 50000.0,
        category: 'Capital Deposit',
        notes: 'Initial business capital injection from partners',
        txnDate: now.subtract(const Duration(days: 28)),
        txnType: 'in',
        createdAt: now.subtract(const Duration(days: 28)),
      ),
      CompanyTransactionModel(
        id: uuid.v4(),
        amount: 12000.0,
        category: 'Office Rent',
        notes: 'Warehouse annual leasing first installment payment',
        txnDate: now.subtract(const Duration(days: 25)),
        txnType: 'out',
        createdAt: now.subtract(const Duration(days: 25)),
      ),
      CompanyTransactionModel(
        id: uuid.v4(),
        amount: 2400.0,
        category: 'Government Fees',
        notes: 'Commercial registration (CR) renewal cost',
        txnDate: now.subtract(const Duration(days: 15)),
        txnType: 'out',
        createdAt: now.subtract(const Duration(days: 15)),
      ),
      CompanyTransactionModel(
        id: uuid.v4(),
        amount: 850.0,
        category: 'Office Utility',
        notes: 'Electricity bills and high-speed fiber internet package',
        txnDate: now.subtract(const Duration(days: 10)),
        txnType: 'out',
        createdAt: now.subtract(const Duration(days: 10)),
      ),
    ];

    for (final t in txns) {
      await box.put(t.id, t);
    }
  }

  Future<List<CompanyTransactionModel>> getTransactions() async {
    final box = Hive.box<CompanyTransactionModel>(_boxName);
    return box.values.where((t) => !t.isDeleted).toList()
      ..sort((a, b) => b.txnDate.compareTo(a.txnDate));
  }

  Future<void> saveTransaction(CompanyTransactionModel transaction) async {
    final box = Hive.box<CompanyTransactionModel>(_boxName);
    await box.put(transaction.id, transaction);
  }

  Future<void> deleteTransaction(String id) async {
    final box = Hive.box<CompanyTransactionModel>(_boxName);
    final txn = box.get(id);
    if (txn != null) {
      await box.put(id, txn.copyWith(isDeleted: true));
    }
  }
}
