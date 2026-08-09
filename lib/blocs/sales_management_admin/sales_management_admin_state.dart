import '../sales_management/sales_management_state.dart';

class SalesManagementAdminState {
  final List<VisitRecord> visitRecords;
  final DateTime selectedDate;
  final String searchQuery;
  final String paymentTypeFilter;
  final String customerFilter;
  final String salesmanFilter;

  const SalesManagementAdminState({
    required this.visitRecords,
    required this.selectedDate,
    required this.searchQuery,
    required this.paymentTypeFilter,
    required this.customerFilter,
    required this.salesmanFilter,
  });

  factory SalesManagementAdminState.initial() {
    final targetDate = DateTime(2026, 7, 31);
    final initialVisitRecords = [
      VisitRecord(
        id: 'visit-1',
        customerName: 'Azzouz Al-Ghamdi',
        shopName: 'Azzouz Supermarket',
        amount: 500.0,
        paymentType: 'Cash',
        cashAmount: 500.0,
        bankAmount: 0.0,
        creditAmount: 0.0,
        notes: 'Standard cash delivery',
        photoPath: '',
        dateTime: DateTime(2026, 7, 31, 5, 22),
        shopLocation: '24.7136° N, 46.6753° E',
        salesmanName: 'Mohammed',
      ),
      VisitRecord(
        id: 'visit-2',
        customerName: 'Aklas Khan',
        shopName: 'Aklas Grocery',
        amount: 300.0,
        paymentType: 'Cash',
        cashAmount: 300.0,
        bankAmount: 0.0,
        creditAmount: 0.0,
        notes: 'Delivered goods',
        photoPath: '',
        dateTime: DateTime(2026, 7, 31, 8, 15),
        shopLocation: '24.7136° N, 46.6753° E',
        salesmanName: 'Ahmad',
      ),
      VisitRecord(
        id: 'visit-3',
        customerName: 'Mohammed Ali',
        shopName: 'Al-Noor Store',
        amount: 200.0,
        paymentType: 'Cash',
        cashAmount: 200.0,
        bankAmount: 0.0,
        creditAmount: 0.0,
        notes: 'Delivered extra inventory',
        photoPath: '',
        dateTime: DateTime(2026, 7, 31, 10, 45),
        shopLocation: '24.7136° N, 46.6753° E',
        salesmanName: 'Ali',
      ),
      VisitRecord(
        id: 'visit-4',
        customerName: 'Aklas Khan',
        shopName: 'Aklas Grocery',
        amount: 700.0,
        paymentType: 'Bank',
        cashAmount: 0.0,
        bankAmount: 700.0,
        creditAmount: 0.0,
        notes: 'Payment via bank transfer',
        photoPath: '',
        dateTime: DateTime(2026, 7, 31, 13, 30),
        shopLocation: '24.7136° N, 46.6753° E',
        salesmanName: 'Zuhair',
      ),
      VisitRecord(
        id: 'visit-5',
        customerName: 'Azzouz Al-Ghamdi',
        shopName: 'Azzouz Supermarket',
        amount: 0.0,
        paymentType: 'Cash',
        cashAmount: 0.0,
        bankAmount: 0.0,
        creditAmount: 0.0,
        notes: 'Closed today',
        photoPath: '',
        dateTime: DateTime(2026, 7, 31, 16, 13),
        shopLocation: '24.7136° N, 46.6753° E',
        salesmanName: 'Mohammed',
      ),
    ];

    return SalesManagementAdminState(
      visitRecords: initialVisitRecords,
      selectedDate: targetDate,
      searchQuery: '',
      paymentTypeFilter: 'All payment types',
      customerFilter: 'All customers',
      salesmanFilter: 'All Salesmen',
    );
  }

  SalesManagementAdminState copyWith({
    List<VisitRecord>? visitRecords,
    DateTime? selectedDate,
    String? searchQuery,
    String? paymentTypeFilter,
    String? customerFilter,
    String? salesmanFilter,
  }) {
    return SalesManagementAdminState(
      visitRecords: visitRecords ?? this.visitRecords,
      selectedDate: selectedDate ?? this.selectedDate,
      searchQuery: searchQuery ?? this.searchQuery,
      paymentTypeFilter: paymentTypeFilter ?? this.paymentTypeFilter,
      customerFilter: customerFilter ?? this.customerFilter,
      salesmanFilter: salesmanFilter ?? this.salesmanFilter,
    );
  }
}
