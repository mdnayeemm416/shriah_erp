import 'package:flutter_bloc/flutter_bloc.dart';
import 'shop_event.dart';
import 'shop_state.dart';
import '../../repositories/shop_repository.dart';

class ShopBloc extends Bloc<ShopEvent, ShopState> {
  final ShopRepository shopRepository;

  ShopBloc(this.shopRepository) : super(ShopInitial()) {
    on<LoadShops>(_onLoadShops);
    on<SelectShop>(_onSelectShop);
    on<LoadShopEntries>(_onLoadShopEntries);
    on<AddEntry>(_onAddEntry);
    on<UpdateEntry>(_onUpdateEntry);
    on<DeleteEntry>(_onDeleteEntry);
  }

  Future<void> _onLoadShops(LoadShops event, Emitter<ShopState> emit) async {
    emit(ShopLoading());
    try {
      final shops = await shopRepository.getShops();
      final cashiers = await shopRepository.getAllCashiers();
      final entries = await shopRepository.getEntries();
      
      if (shops.isNotEmpty) {
        emit(ShopLoaded(
          shops: shops,
          selectedShop: shops.first,
          cashiers: cashiers,
          entries: entries,
        ));
      } else {
        emit(ShopLoaded(shops: const [], cashiers: cashiers, entries: entries));
      }
    } catch (e) {
      emit(ShopErrorState('Failed to load shops: ${e.toString()}'));
    }
  }

  Future<void> _onSelectShop(SelectShop event, Emitter<ShopState> emit) async {
    final currentState = state;
    if (currentState is ShopLoaded) {
      emit(currentState.copyWith(selectedShop: event.shop));
    }
  }

  Future<void> _onLoadShopEntries(LoadShopEntries event, Emitter<ShopState> emit) async {
    final currentState = state;
    if (currentState is ShopLoaded) {
      emit(currentState.copyWith(isLoadingEntries: true));
      try {
        final entries = await shopRepository.getEntries();
        emit(currentState.copyWith(
          entries: entries,
          isLoadingEntries: false,
        ));
      } catch (e) {
        emit(currentState.copyWith(isLoadingEntries: false, error: e.toString()));
      }
    }
  }

  Future<void> _onAddEntry(AddEntry event, Emitter<ShopState> emit) async {
    final currentState = state;
    if (currentState is ShopLoaded) {
      try {
        await shopRepository.saveEntry(event.entry);
        final entries = await shopRepository.getEntries();
        emit(currentState.copyWith(entries: entries));
      } catch (e) {
        emit(currentState.copyWith(error: 'Failed to add entry: ${e.toString()}'));
      }
    }
  }

  Future<void> _onUpdateEntry(UpdateEntry event, Emitter<ShopState> emit) async {
    final currentState = state;
    if (currentState is ShopLoaded) {
      try {
        await shopRepository.saveEntry(event.entry);
        final entries = await shopRepository.getEntries();
        emit(currentState.copyWith(entries: entries));
      } catch (e) {
        emit(currentState.copyWith(error: 'Failed to update entry: ${e.toString()}'));
      }
    }
  }

  Future<void> _onDeleteEntry(DeleteEntry event, Emitter<ShopState> emit) async {
    final currentState = state;
    if (currentState is ShopLoaded) {
      try {
        await shopRepository.deleteEntry(event.id);
        final entries = await shopRepository.getEntries();
        emit(currentState.copyWith(entries: entries));
      } catch (e) {
        emit(currentState.copyWith(error: 'Failed to delete entry: ${e.toString()}'));
      }
    }
  }
}
