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
    on<LoadShopSummary>(_onLoadShopSummary);
    on<AddEntry>(_onAddEntry);
    on<UpdateEntry>(_onUpdateEntry);
    on<DeleteEntry>(_onDeleteEntry);
  }

  Future<void> _onLoadShops(LoadShops event, Emitter<ShopState> emit) async {
    emit(ShopLoading());
    try {
      final shops = await shopRepository.getShops(
        period: event.period,
        startDate: event.startDate,
        endDate: event.endDate,
        date: event.date,
      );
      final cashiers = await shopRepository.getAllCashiers();
      final entries = await shopRepository.getEntries(
        period: event.period,
        startDate: event.startDate,
        endDate: event.endDate,
        date: event.date,
      );
      
      final selectedShop = shops.isNotEmpty ? shops.first : null;
      final summary = await shopRepository.getShopSummary(
        shopId: selectedShop?.id,
        period: event.period,
        startDate: event.startDate,
        endDate: event.endDate,
        date: event.date,
      );

      if (shops.isNotEmpty) {
        emit(ShopLoaded(
          shops: shops,
          selectedShop: selectedShop,
          cashiers: cashiers,
          entries: entries,
          shopSummary: summary,
          period: event.period,
          startDate: event.startDate,
          endDate: event.endDate,
          date: event.date,
        ));
      } else {
        emit(ShopLoaded(
          shops: const [],
          cashiers: cashiers,
          entries: entries,
          shopSummary: summary,
          period: event.period,
          startDate: event.startDate,
          endDate: event.endDate,
          date: event.date,
        ));
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
        final entries = await shopRepository.getEntries(
          shopId: event.shopId,
          period: event.period,
          startDate: event.startDate,
          endDate: event.endDate,
          date: event.date,
        );
        emit(currentState.copyWith(
          entries: entries,
          isLoadingEntries: false,
          period: event.period,
          startDate: event.startDate,
          endDate: event.endDate,
          date: event.date,
        ));
      } catch (e) {
        emit(currentState.copyWith(isLoadingEntries: false, error: e.toString()));
      }
    }
  }

  Future<void> _onLoadShopSummary(LoadShopSummary event, Emitter<ShopState> emit) async {
    final currentState = state;
    if (currentState is ShopLoaded) {
      try {
        final summary = await shopRepository.getShopSummary(
          shopId: event.shopId,
          period: event.period,
          startDate: event.startDate,
          endDate: event.endDate,
          date: event.date,
        );
        emit(currentState.copyWith(
          shopSummary: summary,
          period: event.period,
          startDate: event.startDate,
          endDate: event.endDate,
          date: event.date,
        ));
      } catch (e) {
        emit(currentState.copyWith(error: 'Failed to load shop summary: ${e.toString()}'));
      }
    }
  }

  Future<void> _onAddEntry(AddEntry event, Emitter<ShopState> emit) async {
    final currentState = state;
    if (currentState is ShopLoaded) {
      try {
        await shopRepository.saveEntry(event.entry, isUpdate: false);
        final entries = await shopRepository.getEntries(
          period: currentState.period,
          startDate: currentState.startDate,
          endDate: currentState.endDate,
          date: currentState.date,
        );
        final summary = await shopRepository.getShopSummary(
          shopId: currentState.selectedShop?.id,
          period: currentState.period,
          startDate: currentState.startDate,
          endDate: currentState.endDate,
          date: currentState.date,
        );
        emit(currentState.copyWith(entries: entries, shopSummary: summary));
      } catch (e) {
        emit(currentState.copyWith(error: 'Failed to add entry: ${e.toString()}'));
      }
    }
  }

  Future<void> _onUpdateEntry(UpdateEntry event, Emitter<ShopState> emit) async {
    final currentState = state;
    if (currentState is ShopLoaded) {
      try {
        await shopRepository.saveEntry(event.entry, isUpdate: true);
        final entries = await shopRepository.getEntries(
          period: currentState.period,
          startDate: currentState.startDate,
          endDate: currentState.endDate,
          date: currentState.date,
        );
        final summary = await shopRepository.getShopSummary(
          shopId: currentState.selectedShop?.id,
          period: currentState.period,
          startDate: currentState.startDate,
          endDate: currentState.endDate,
          date: currentState.date,
        );
        emit(currentState.copyWith(entries: entries, shopSummary: summary));
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
        final entries = await shopRepository.getEntries(
          period: currentState.period,
          startDate: currentState.startDate,
          endDate: currentState.endDate,
          date: currentState.date,
        );
        final summary = await shopRepository.getShopSummary(
          shopId: currentState.selectedShop?.id,
          period: currentState.period,
          startDate: currentState.startDate,
          endDate: currentState.endDate,
          date: currentState.date,
        );
        emit(currentState.copyWith(entries: entries, shopSummary: summary));
      } catch (e) {
        emit(currentState.copyWith(error: 'Failed to delete entry: ${e.toString()}'));
      }
    }
  }
}
