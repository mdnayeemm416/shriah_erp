import '../models/wholesale_models.dart';
import 'wholesale/wholesale_customer_repository.dart';
import 'wholesale/wholesale_category_repository.dart';
import 'wholesale/wholesale_sale_repository.dart';
import 'wholesale/wholesale_purchase_repository.dart';
import 'wholesale/wholesale_order_repository.dart';
import 'wholesale/wholesale_payment_repository.dart';
import 'wholesale/wholesale_sales_return_repository.dart';
import 'wholesale/wholesale_dashboard_repository.dart';

class WholesaleRepository {
  final WholesaleCustomerRepository customerRepo;
  final WholesaleCategoryRepository categoryRepo;
  final WholesaleSaleRepository saleRepo;
  final WholesalePurchaseRepository purchaseRepo;
  final WholesaleOrderRepository orderRepo;
  final WholesalePaymentRepository paymentRepo;
  final WholesaleSalesReturnRepository salesReturnRepo;
  final WholesaleDashboardRepository dashboardRepo;

  WholesaleRepository({
    WholesaleCustomerRepository? customerRepo,
    WholesaleCategoryRepository? categoryRepo,
    WholesaleSaleRepository? saleRepo,
    WholesalePurchaseRepository? purchaseRepo,
    WholesaleOrderRepository? orderRepo,
    WholesalePaymentRepository? paymentRepo,
    WholesaleSalesReturnRepository? salesReturnRepo,
    WholesaleDashboardRepository? dashboardRepo,
  })  : customerRepo = customerRepo ?? WholesaleCustomerRepository(),
        categoryRepo = categoryRepo ?? WholesaleCategoryRepository(),
        saleRepo = saleRepo ?? WholesaleSaleRepository(),
        purchaseRepo = purchaseRepo ?? WholesalePurchaseRepository(),
        orderRepo = orderRepo ?? WholesaleOrderRepository(),
        paymentRepo = paymentRepo ?? WholesalePaymentRepository(),
        salesReturnRepo = salesReturnRepo ?? WholesaleSalesReturnRepository(),
        dashboardRepo = dashboardRepo ?? WholesaleDashboardRepository();

  Future<void> initialize() async {
    await customerRepo.initialize();
    await categoryRepo.initialize();
    await saleRepo.initialize();
    await purchaseRepo.initialize();
    await orderRepo.initialize();
    await paymentRepo.initialize();
  }

  // --- Executive Dashboard Summary & Receivables ---
  Future<Map<String, dynamic>?> getDashboardSummary() => dashboardRepo.getDashboardSummary();
  Future<List<dynamic>?> getReceivablesBreakdown() => dashboardRepo.getReceivablesBreakdown();

  // --- Customers CRUD ---
  Future<List<WholesaleCustomerModel>> getCustomers() => customerRepo.getCustomers();
  Future<void> saveCustomer(WholesaleCustomerModel customer) => customerRepo.saveCustomer(customer);
  Future<void> deleteCustomer(String customerId) => customerRepo.deleteCustomer(customerId);
  Future<Map<String, dynamic>?> getCustomerStatement(String customerId) => customerRepo.getCustomerStatement(customerId);

  // --- Payments CRUD ---
  Future<List<WholesalePaymentModel>> getPayments() => paymentRepo.getPayments();
  Future<void> savePayment(WholesalePaymentModel payment) => paymentRepo.savePayment(payment);
  Future<void> deletePayment(String paymentId) => paymentRepo.deletePayment(paymentId);

  // --- Sales CRUD ---
  Future<List<WholesaleSaleModel>> getSales({DateTime? startDate, DateTime? endDate}) => saleRepo.getSales(startDate: startDate, endDate: endDate);
  Future<List<WholesaleSaleModel>> getRecycleBinSales() => saleRepo.getRecycleBinSales();
  Future<WholesaleSaleModel?> saveSale(WholesaleSaleModel sale) => saleRepo.saveSale(sale);
  Future<void> cancelSale(String saleId) => saleRepo.cancelSale(saleId);
  Future<void> deleteSale(String saleId) => saleRepo.softDeleteSale(saleId);
  Future<void> softDeleteSale(String saleId) => saleRepo.softDeleteSale(saleId);
  Future<void> restoreSale(String saleId) => saleRepo.restoreSale(saleId);
  Future<void> purgeSale(String saleId) => saleRepo.purgeSale(saleId);

  // --- Sales Returns ---
  Future<List<WholesaleSalesReturnModel>> getSalesReturns({
    String? invoiceNumber,
    String? saleId,
  }) => salesReturnRepo.getSalesReturns(
    invoiceNumber: invoiceNumber,
    saleId: saleId,
  );
  Future<Map<String, dynamic>?> createSalesReturn(WholesaleSalesReturnModel salesReturn) => salesReturnRepo.createSalesReturn(salesReturn);
  Future<WholesaleInvoiceReturns?> getSaleReturns(String invoiceIdOrNumber) => salesReturnRepo.getSaleReturns(invoiceIdOrNumber);
  Future<WholesaleSalesReturnSummary?> getSalesReturnSummary() => salesReturnRepo.getSalesReturnSummary();

  // --- Purchases CRUD ---
  Future<List<WholesalePurchaseModel>> getPurchases() => purchaseRepo.getPurchases();
  Future<void> savePurchase(WholesalePurchaseModel purchase) => purchaseRepo.savePurchase(purchase);
  Future<void> deletePurchase(String purchaseId) => purchaseRepo.deletePurchase(purchaseId);

  // --- Orders CRUD ---
  Future<List<WholesaleOrderModel>> getOrders() => orderRepo.getOrders();
  Future<void> saveOrder(WholesaleOrderModel order) => orderRepo.saveOrder(order);
  Future<void> updateOrderStatus(String orderId, String status) => orderRepo.updateOrderStatus(orderId, status);
  Future<void> deleteOrder(String orderId) => orderRepo.deleteOrder(orderId);

  // --- Categories CRUD ---
  Future<List<WholesaleCategoryModel>> getCategories() => categoryRepo.getCategories();
  Future<void> saveCategory(WholesaleCategoryModel category) => categoryRepo.saveCategory(category);
  Future<void> deleteCategory(String categoryId) => categoryRepo.deleteCategory(categoryId);
}
