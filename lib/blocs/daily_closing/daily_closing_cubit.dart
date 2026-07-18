import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:uuid/uuid.dart';
import '../../models/daily_closing_model.dart';
import '../../models/cash_holder_model.dart';
import '../../repositories/daily_closing_repository.dart';
import '../../repositories/shop_repository.dart';
import '../../repositories/employee_repository.dart';
import '../../repositories/company_transaction_repository.dart';

class DailyClosingState {
  final DateTime date;
  final double openingCash;
  final bool openingLocked;
  final List<CashHolderModel> holders;
  final Map<String, double> distribution;
  final String notes;
  final bool loading;
  final bool saving;
  final DailyClosingModel? existingClosing;
  final DailyClosingModel? prevClosing;
  
  // Computed fields
  final double expectedClosing;
  final double countedCash;
  final double difference;
  final String statusTone; // 'matched' | 'shortage' | 'extra'
  
  // Breakdown fields
  final double cashSale;
  final double withdraw;
  final double purchase;
  final double expense;
  final double otherCashIn;
  final double employeeReceived;
  final double employeeGiven;
  final double distributionTotal;
  final bool lockWarning;

  DailyClosingState({
    required this.date,
    this.openingCash = 0.0,
    this.openingLocked = true,
    required this.holders,
    required this.distribution,
    this.notes = '',
    this.loading = false,
    this.saving = false,
    this.existingClosing,
    this.prevClosing,
    this.expectedClosing = 0.0,
    this.countedCash = 0.0,
    this.difference = 0.0,
    this.statusTone = 'matched',
    this.cashSale = 0.0,
    this.withdraw = 0.0,
    this.purchase = 0.0,
    this.expense = 0.0,
    this.otherCashIn = 0.0,
    this.employeeReceived = 0.0,
    this.employeeGiven = 0.0,
    this.distributionTotal = 0.0,
    this.lockWarning = false,
  });

  DailyClosingState copyWith({
    DateTime? date,
    double? openingCash,
    bool? openingLocked,
    List<CashHolderModel>? holders,
    Map<String, double>? distribution,
    String? notes,
    bool? loading,
    bool? saving,
    DailyClosingModel? existingClosing,
    DailyClosingModel? prevClosing,
    double? expectedClosing,
    double? countedCash,
    double? difference,
    String? statusTone,
    double? cashSale,
    double? withdraw,
    double? purchase,
    double? expense,
    double? otherCashIn,
    double? employeeReceived,
    double? employeeGiven,
    double? distributionTotal,
    bool? lockWarning,
  }) {
    return DailyClosingState(
      date: date ?? this.date,
      openingCash: openingCash ?? this.openingCash,
      openingLocked: openingLocked ?? this.openingLocked,
      holders: holders ?? this.holders,
      distribution: distribution ?? this.distribution,
      notes: notes ?? this.notes,
      loading: loading ?? this.loading,
      saving: saving ?? this.saving,
      existingClosing: existingClosing ?? this.existingClosing,
      prevClosing: prevClosing ?? this.prevClosing,
      expectedClosing: expectedClosing ?? this.expectedClosing,
      countedCash: countedCash ?? this.countedCash,
      difference: difference ?? this.difference,
      statusTone: statusTone ?? this.statusTone,
      cashSale: cashSale ?? this.cashSale,
      withdraw: withdraw ?? this.withdraw,
      purchase: purchase ?? this.purchase,
      expense: expense ?? this.expense,
      otherCashIn: otherCashIn ?? this.otherCashIn,
      employeeReceived: employeeReceived ?? this.employeeReceived,
      employeeGiven: employeeGiven ?? this.employeeGiven,
      distributionTotal: distributionTotal ?? this.distributionTotal,
      lockWarning: lockWarning ?? this.lockWarning,
    );
  }
}

class DailyClosingCubit extends Cubit<DailyClosingState> {
  final DailyClosingRepository _dailyClosingRepo;
  final ShopRepository _shopRepo;
  final EmployeeRepository _employeeRepo;
  final CompanyTransactionRepository _companyRepo;

  DailyClosingCubit({
    required DailyClosingRepository dailyClosingRepo,
    required ShopRepository shopRepo,
    required EmployeeRepository employeeRepo,
    required CompanyTransactionRepository companyRepo,
  })  : _dailyClosingRepo = dailyClosingRepo,
        _shopRepo = shopRepo,
        _employeeRepo = employeeRepo,
        _companyRepo = companyRepo,
        super(DailyClosingState(
          date: DateTime.now(),
          holders: [CashHolderModel(name: 'Main Drawer', amount: 0.0)],
          distribution: {
            'Azzouz': 0.0,
            'Nujum': 0.0,
            'Aklas': 0.0,
            'Khaled': 0.0,
            'Warehouse': 0.0,
          },
        ));

  Future<void> loadDate(DateTime date) async {
    emit(state.copyWith(loading: true, date: date));

    try {
      final existing = await _dailyClosingRepo.getClosingForDate(date);
      final prev = await _dailyClosingRepo.getPrecedingClosing(date);
      final suggestedOpening = prev?.countedCash ?? 0.0;

      // Fetch today's activities from database to aggregate
      final dateStr = date.toIso8601String().split('T')[0];
      final shopEntries = await _shopRepo.getEntries();
      final dayShopEntries = shopEntries.where((e) {
        final entryDate = e.txnDate.toIso8601String().split('T')[0];
        return entryDate == dateStr;
      }).toList();

      final empEntries = await _employeeRepo.getEntries();
      final dayEmpEntries = empEntries.where((e) {
        final entryDate = e.txnDate.toIso8601String().split('T')[0];
        return entryDate == dateStr;
      }).toList();

      final companyTxns = await _companyRepo.getTransactions();
      final dayCompanyTxns = companyTxns.where((t) {
        final entryDate = t.txnDate.toIso8601String().split('T')[0];
        return entryDate == dateStr;
      }).toList();

      // Computations
      final cashSale = dayShopEntries
          .where((e) => e.entryType == 'sale')
          .fold(0.0, (s, e) => s + e.cashSale);

      final withdraw = dayShopEntries
          .where((e) => e.entryType == 'withdraw')
          .fold(0.0, (s, e) => s + e.withdrawAmount);

      final purchase = dayShopEntries
          .where((e) => e.entryType == 'purchase')
          .fold(0.0, (s, e) => s + e.purchaseAmount);

      final expense = dayShopEntries
          .where((e) => e.entryType == 'expense')
          .fold(0.0, (s, e) => s + e.expenseAmount);

      final otherCashIn = dayCompanyTxns
          .where((t) => t.txnType == 'in')
          .fold(0.0, (s, t) => s + t.amount);

      final otherCashOut = dayCompanyTxns
          .where((t) => t.txnType == 'out')
          .fold(0.0, (s, t) => s + t.amount);

      final employeeReceived = dayEmpEntries
          .where((e) => e.entryType == 'receive')
          .fold(0.0, (s, e) => s + e.amount);

      final employeeGiven = dayEmpEntries
          .where((e) => e.entryType == 'give')
          .fold(0.0, (s, e) => s + e.amount);

      // Hydrate inputs
      double openingCash = suggestedOpening;
      bool openingLocked = true;
      List<CashHolderModel> holders = [CashHolderModel(name: 'Main Drawer', amount: 0.0)];
      Map<String, double> distribution = {
        'Azzouz': 0.0,
        'Nujum': 0.0,
        'Aklas': 0.0,
        'Khaled': 0.0,
        'Warehouse': 0.0,
      };
      String notes = '';

      if (existing != null) {
        openingCash = existing.openingCash;
        openingLocked = true;
        holders = existing.holders.isNotEmpty
            ? List.from(existing.holders)
            : [CashHolderModel(name: 'Main Drawer', amount: existing.countedCash)];
        notes = existing.notes ?? '';
        
        distribution = {
          'Azzouz': existing.distribution['Azzouz'] ?? 0.0,
          'Nujum': existing.distribution['Nujum'] ?? 0.0,
          'Aklas': existing.distribution['Aklas'] ?? 0.0,
          'Khaled': existing.distribution['Khaled'] ?? 0.0,
          'Warehouse': existing.distribution['Warehouse'] ?? 0.0,
        };
      }

      // Check lock warning (tamper detection)
      bool lockWarning = false;
      if (existing != null) {
        final closedAt = existing.updatedAt ?? existing.createdAt;
        final changesAfterClosing = [
          ...dayShopEntries.map((e) => e.createdAt),
          ...dayCompanyTxns.map((t) => t.createdAt),
        ].any((ts) => ts != null && ts.isAfter(closedAt));
        lockWarning = changesAfterClosing;
      }

      emit(state.copyWith(
        loading: false,
        existingClosing: existing,
        prevClosing: prev,
        openingCash: openingCash,
        openingLocked: openingLocked,
        holders: holders,
        distribution: distribution,
        notes: notes,
        cashSale: cashSale,
        withdraw: withdraw,
        purchase: purchase,
        expense: expense + otherCashOut,
        otherCashIn: otherCashIn,
        employeeReceived: employeeReceived,
        employeeGiven: employeeGiven,
        lockWarning: lockWarning,
      ));

      _recompute();
    } catch (_) {
      emit(state.copyWith(loading: false));
    }
  }

  void updateOpeningCash(double val) {
    emit(state.copyWith(openingCash: val, openingLocked: false));
    _recompute();
  }

  void lockOpeningCash() {
    final suggested = state.prevClosing?.countedCash ?? 0.0;
    emit(state.copyWith(openingCash: suggested, openingLocked: true));
    _recompute();
  }

  void updateHolders(List<CashHolderModel> holders) {
    emit(state.copyWith(holders: holders));
    _recompute();
  }

  void updateDistribution(String shop, double amount) {
    final dist = Map<String, double>.from(state.distribution);
    dist[shop] = amount;
    emit(state.copyWith(distribution: dist));
    _recompute();
  }

  void updateNotes(String notes) {
    emit(state.copyWith(notes: notes));
  }

  void _recompute() {
    final opening = state.openingCash;
    final inflow = state.withdraw + state.otherCashIn + state.employeeReceived;
    
    final distTotal = state.distribution.values.fold(0.0, (s, a) => s + a);
    final outflow = distTotal + state.expense + state.employeeGiven;

    final expected = (opening + inflow) - outflow;
    final counted = state.holders.fold(0.0, (s, h) => s + h.amount);
    final diff = counted - expected;

    String tone = 'matched';
    if (diff < -0.01) {
      tone = 'shortage';
    } else if (diff > 0.01) {
      tone = 'extra';
    }

    emit(state.copyWith(
      expectedClosing: expected,
      countedCash: counted,
      difference: diff,
      statusTone: tone,
      distributionTotal: distTotal,
    ));
  }

  Future<bool> saveClosing(String userId) async {
    emit(state.copyWith(saving: true));
    try {
      final id = state.existingClosing?.id ?? const Uuid().v4();
      final holdersPayload = state.holders
          .where((h) => h.amount > 0 || h.name.trim().isNotEmpty)
          .toList();
      
      final closing = DailyClosingModel(
        id: id,
        closingDate: state.date,
        openingCash: state.openingCash,
        cashSale: state.cashSale + state.otherCashIn + state.employeeReceived,
        withdraw: state.withdraw,
        purchase: state.purchase,
        expense: state.expense + state.employeeGiven,
        expectedCash: state.expectedClosing,
        countedCash: state.countedCash,
        difference: state.difference,
        status: state.statusTone,
        notes: state.notes.isEmpty ? null : state.notes,
        holders: holdersPayload,
        distribution: state.distribution,
        distributionTotal: state.distributionTotal,
        createdBy: userId,
        createdAt: state.existingClosing?.createdAt ?? DateTime.now(),
        updatedAt: DateTime.now(),
      );

      await _dailyClosingRepo.saveClosing(closing);
      emit(state.copyWith(saving: false, existingClosing: closing, lockWarning: false));
      return true;
    } catch (_) {
      emit(state.copyWith(saving: false));
      return false;
    }
  }

  Future<void> deleteClosing() async {
    if (state.existingClosing == null) return;
    emit(state.copyWith(saving: true));
    try {
      await _dailyClosingRepo.deleteClosing(state.existingClosing!.id);
      emit(state.copyWith(
        saving: false,
        existingClosing: null,
        holders: [CashHolderModel(name: 'Main Drawer', amount: 0.0)],
        notes: '',
      ));
      loadDate(state.date);
    } catch (_) {
      emit(state.copyWith(saving: false));
    }
  }
}
