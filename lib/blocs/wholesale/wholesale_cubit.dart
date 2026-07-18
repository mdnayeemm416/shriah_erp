import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:uuid/uuid.dart';
import 'wholesale_state.dart';
import '../../models/wholesale_models.dart';
import '../../models/product_model.dart';
import '../../repositories/wholesale_repository.dart';
import '../../repositories/product_repository.dart';

class WholesaleCubit extends Cubit<WholesaleState> {
  final WholesaleRepository wholesaleRepo;
  final ProductRepository productRepo;

  WholesaleCubit({
    required this.wholesaleRepo,
    required this.productRepo,
  }) : super(WholesaleState());

  Future<void> loadAllData() async {
    emit(state.copyWith(loading: true));
    try {
      final customers = await wholesaleRepo.getCustomers();
      final payments = await wholesaleRepo.getPayments();
      final sales = await wholesaleRepo.getSales();
      final purchases = await wholesaleRepo.getPurchases();
      final orders = await wholesaleRepo.getOrders();
      final categories = await wholesaleRepo.getCategories();
      final products = await productRepo.getProducts();

      emit(state.copyWith(
        customers: customers,
        payments: payments,
        sales: sales,
        purchases: purchases,
        orders: orders,
        categories: categories,
        products: products,
        loading: false,
      ));
    } catch (e) {
      emit(state.copyWith(loading: false, error: e.toString()));
    }
  }

  void changeTab(int tab) {
    emit(state.copyWith(activeTab: tab));
  }

  void setSearchQuery(String query) {
    emit(state.copyWith(searchQuery: query));
  }

  // --- Transactions ---

  Future<void> createCustomer({
    required String name,
    required String mobile,
    required double openingDue,
  }) async {
    try {
      final customer = WholesaleCustomerModel(
        id: const Uuid().v4(),
        name: name,
        mobile: mobile,
        openingDue: openingDue,
        createdAt: DateTime.now(),
      );
      await wholesaleRepo.saveCustomer(customer);
      await loadAllData();
    } catch (e) {
      emit(state.copyWith(error: e.toString()));
    }
  }

  Future<void> recordPayment({
    required String customerId,
    required double amount,
    required String kind,
    String? notes,
  }) async {
    try {
      final payment = WholesalePaymentModel(
        id: const Uuid().v4(),
        customerId: customerId,
        amount: amount,
        kind: kind,
        notes: notes,
        createdAt: DateTime.now(),
      );
      await wholesaleRepo.savePayment(payment);
      await loadAllData();
    } catch (e) {
      emit(state.copyWith(error: e.toString()));
    }
  }

  Future<void> createSale({
    required String customerName,
    required String customerMobile,
    required List<WholesaleSaleItemModel> items,
    required double total,
    required double discount,
    required double dueAmount,
    required String paymentMethod,
    String? customerId,
  }) async {
    try {
      final sale = WholesaleSaleModel(
        id: const Uuid().v4(),
        invoiceNumber: state.sales.isEmpty ? 1001 : state.sales.map((s) => s.invoiceNumber).reduce((a, b) => a > b ? a : b) + 1,
        customerId: customerId,
        customerName: customerName,
        customerMobile: customerMobile,
        items: items,
        total: total,
        discount: discount,
        dueAmount: dueAmount,
        paymentMethod: paymentMethod,
        createdAt: DateTime.now(),
      );

      // Save Sale
      await wholesaleRepo.saveSale(sale);

      // Decrement product stock levels
      for (final item in items) {
        final product = state.products.cast<ProductModel?>().firstWhere(
              (p) => p != null && p.id == item.productId,
              orElse: () => null,
            );
        if (product != null) {
          await productRepo.updateStock(product.id, product.stock - item.qty);
        }
      }

      // If it's a credit sale (due / partial due) and we have customerId,
      // and we paid something (paymentMethod != 'due' but with remaining due), 
      // or if paymentMethod == 'due', we check if we need to log a payment record
      final paidAmount = total - discount - dueAmount;
      if (customerId != null && paidAmount > 0) {
        final payment = WholesalePaymentModel(
          id: const Uuid().v4(),
          customerId: customerId,
          amount: paidAmount,
          kind: 'payment_in',
          notes: 'Partial payment on invoice #${sale.invoiceNumber}',
          createdAt: DateTime.now(),
        );
        await wholesaleRepo.savePayment(payment);
      }

      await loadAllData();
    } catch (e) {
      emit(state.copyWith(error: e.toString()));
    }
  }

  Future<void> cancelSale(String saleId) async {
    try {
      final sale = state.sales.firstWhere((s) => s.id == saleId);
      final updated = sale.copyWith(status: 'cancelled');
      await wholesaleRepo.saveSale(updated);

      // Restore product stock levels
      for (final item in sale.items) {
        final product = state.products.cast<ProductModel?>().firstWhere(
              (p) => p != null && p.id == item.productId,
              orElse: () => null,
            );
        if (product != null) {
          await productRepo.updateStock(product.id, product.stock + item.qty);
        }
      }

      await loadAllData();
    } catch (e) {
      emit(state.copyWith(error: e.toString()));
    }
  }

  Future<void> createPurchase({
    required String supplierName,
    required List<WholesaleSaleItemModel> items,
    required double total,
    String? notes,
  }) async {
    try {
      final purchase = WholesalePurchaseModel(
        id: const Uuid().v4(),
        invoiceNumber: 'PUR-${DateTime.now().millisecondsSinceEpoch.toString().substring(7)}',
        supplierName: supplierName,
        items: items,
        total: total,
        notes: notes,
        createdAt: DateTime.now(),
      );

      // Save Purchase
      await wholesaleRepo.savePurchase(purchase);

      // Increment product stock levels
      for (final item in items) {
        final product = state.products.cast<ProductModel?>().firstWhere(
              (p) => p != null && p.id == item.productId,
              orElse: () => null,
            );
        if (product != null) {
          await productRepo.updateStock(product.id, product.stock + item.qty);
        }
      }

      await loadAllData();
    } catch (e) {
      emit(state.copyWith(error: e.toString()));
    }
  }

  Future<void> convertOrderToSale({
    required WholesaleOrderModel order,
    required String paymentMethod,
    required double discount,
    required double dueAmount,
  }) async {
    try {
      // 1. Mark order as confirmed / delivered
      final updatedOrder = order.copyWith(status: 'confirmed');
      await wholesaleRepo.saveOrder(updatedOrder);

      // 2. Find or create a client matching name / mobile if they exist
      String? customerId;
      final existingCustomer = state.customers.cast<WholesaleCustomerModel?>().firstWhere(
            (c) => c != null && (c.mobile == order.customerMobile || c.name.toLowerCase() == order.customerName.toLowerCase()),
            orElse: () => null,
          );

      if (existingCustomer != null) {
        customerId = existingCustomer.id;
      } else {
        // Create new customer
        final newCust = WholesaleCustomerModel(
          id: const Uuid().v4(),
          name: order.customerName,
          mobile: order.customerMobile,
          openingDue: 0.0,
          createdAt: DateTime.now(),
        );
        await wholesaleRepo.saveCustomer(newCust);
        customerId = newCust.id;
      }

      // 3. Create a Wholesale Sale
      await createSale(
        customerName: order.customerName,
        customerMobile: order.customerMobile,
        items: order.items,
        total: order.total,
        discount: discount,
        dueAmount: dueAmount,
        paymentMethod: paymentMethod,
        customerId: customerId,
      );
    } catch (e) {
      emit(state.copyWith(error: e.toString()));
    }
  }

  Future<void> cancelOrder(String orderId) async {
    try {
      final order = state.orders.firstWhere((o) => o.id == orderId);
      final updated = order.copyWith(status: 'cancelled');
      await wholesaleRepo.saveOrder(updated);
      await loadAllData();
    } catch (e) {
      emit(state.copyWith(error: e.toString()));
    }
  }

  // --- Category Actions ---
  Future<void> createCategory({
    required String name,
    String? nameAr,
    String? nameBn,
    int sortOrder = 0,
  }) async {
    try {
      final cat = WholesaleCategoryModel(
        id: const Uuid().v4(),
        name: name,
        nameAr: nameAr,
        nameBn: nameBn,
        sortOrder: sortOrder,
      );
      await wholesaleRepo.saveCategory(cat);
      await loadAllData();
    } catch (e) {
      emit(state.copyWith(error: e.toString()));
    }
  }

  // --- Inventory Adjust ---
  Future<void> adjustStock(String productId, double adjustment) async {
    try {
      final product = state.products.firstWhere((p) => p.id == productId);
      await productRepo.updateStock(productId, product.stock + adjustment);
      await loadAllData();
    } catch (e) {
      emit(state.copyWith(error: e.toString()));
    }
  }
}
