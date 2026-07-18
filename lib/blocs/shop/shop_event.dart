import '../../models/shop_entry_model.dart';
import '../../models/shop_model.dart';

abstract class ShopEvent {}

class LoadShops extends ShopEvent {}

class SelectShop extends ShopEvent {
  final ShopModel shop;
  SelectShop(this.shop);
}

class LoadShopEntries extends ShopEvent {
  final String shopId;
  final DateTime date;
  LoadShopEntries(this.shopId, this.date);
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
