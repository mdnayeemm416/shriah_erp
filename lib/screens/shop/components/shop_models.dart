import '../../../models/shop_model.dart';
import '../../../models/shop_entry_model.dart';

class DateRangeBounds {
  final DateTime from;
  final DateTime to;
  DateRangeBounds({required this.from, required this.to});
}

class ShopCardSummary {
  final ShopModel shop;
  final double cashPosition;
  final double expectedBank;
  final DateTime? lastDate;

  ShopCardSummary({
    required this.shop,
    required this.cashPosition,
    required this.expectedBank,
    this.lastDate,
  });
}

class DuplicateEntry {
  final bool isHard;
  final String label;
  final String message;
  final double amount;
  final ShopEntryModel existingEntry;

  DuplicateEntry({
    required this.isHard,
    required this.label,
    required this.message,
    required this.amount,
    required this.existingEntry,
  });
}

class ParsedRowMock {
  final int idx;
  final String date;
  final String shopName;
  final String cashierName;
  final double pos;
  final double cash;
  final double bank;
  final double credit;
  final double total;
  final double diff;
  final String status;
  final String tooltip;

  ParsedRowMock({
    required this.idx,
    required this.date,
    required this.shopName,
    required this.cashierName,
    required this.pos,
    required this.cash,
    required this.bank,
    required this.credit,
    required this.total,
    required this.diff,
    required this.status,
    required this.tooltip,
  });
}

class ShopStats {
  final double pos;
  final double cash;
  final double bank;
  final double credit;
  final double totalSale;
  final double purchase;
  final double expense;
  final double withdraw;
  final double diff;

  ShopStats({
    required this.pos,
    required this.cash,
    required this.bank,
    required this.credit,
    required this.totalSale,
    required this.purchase,
    required this.expense,
    required this.withdraw,
    required this.diff,
  });
}

class ReportRow {
  final String name;
  final double pos;
  final double cash;
  final double bank;
  final double credit;
  final double total;
  final double purchase;
  final double expense;
  final double withdraw;
  final double diff;

  ReportRow({
    required this.name,
    required this.pos,
    required this.cash,
    required this.bank,
    required this.credit,
    required this.total,
    required this.purchase,
    required this.expense,
    required this.withdraw,
    required this.diff,
  });
}
