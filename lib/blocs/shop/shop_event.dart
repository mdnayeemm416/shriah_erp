import '../../models/shop_entry_model.dart';
import '../../models/shop_model.dart';

abstract class ShopEvent {}

class LoadShops extends ShopEvent {
  final String? period;
  final String? startDate;
  final String? endDate;
  final String? date;

  LoadShops({
    this.period,
    this.startDate,
    this.endDate,
    this.date,
  });
}

class SelectShop extends ShopEvent {
  final ShopModel shop;
  SelectShop(this.shop);
}

class LoadShopEntries extends ShopEvent {
  final String? shopId;
  final String? period;
  final String? startDate;
  final String? endDate;
  final String? date;

  LoadShopEntries({
    this.shopId,
    this.period,
    this.startDate,
    this.endDate,
    this.date,
  });
}

class LoadShopSummary extends ShopEvent {
  final String? shopId;
  final String? period;
  final String? startDate;
  final String? endDate;
  final String? date;

  LoadShopSummary({
    this.shopId,
    this.period,
    this.startDate,
    this.endDate,
    this.date,
  });
}

class AddEntry extends ShopEvent {
  final ShopEntryModel entry;
  AddEntry(this.entry);
}

class UpdateEntry extends ShopEvent {
  final ShopEntryModel entry;
  UpdateEntry(this.entry);
}

class DeleteEntry extends ShopEvent {
  final String id;
  DeleteEntry(this.id);
}
