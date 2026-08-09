class StaticCustomer {
  final String name;
  final String? shopName;
  final String mobile;
  final String? address;
  final String? shopLocation;
  final String? notes;

  const StaticCustomer({
    required this.name,
    this.shopName,
    required this.mobile,
    this.address,
    this.shopLocation,
    this.notes,
  });
}

class VisitRecord {
  final String id;
  final String customerName;
  final String shopName;
  final double amount;
  final String paymentType;
  final double cashAmount;
  final double bankAmount;
  final double creditAmount;
  final String notes;
  final String photoPath;
  final DateTime dateTime;
  final String shopLocation;
  final String salesmanName;

  const VisitRecord({
    required this.id,
    required this.customerName,
    required this.shopName,
    required this.amount,
    required this.paymentType,
    required this.cashAmount,
    required this.bankAmount,
    required this.creditAmount,
    required this.notes,
    required this.photoPath,
    required this.dateTime,
    required this.shopLocation,
    this.salesmanName = 'Mohammed',
  });
}

class SalesManagementState {
  final List<StaticCustomer> customers;
  final List<StaticCustomer> filteredCustomers;
  final String searchQuery;
  final List<VisitRecord> visitRecords;
  final DateTime selectedDate;

  const SalesManagementState({
    required this.customers,
    required this.filteredCustomers,
    required this.searchQuery,
    required this.visitRecords,
    required this.selectedDate,
  });

  factory SalesManagementState.initial() {
    const initialCustomersList = [
      StaticCustomer(name: 'Azzouz Al-Ghamdi', shopName: 'Azzouz Supermarket', mobile: '0553687388', address: 'Riyadh'),
      StaticCustomer(name: 'Aklas Khan', shopName: 'Aklas Grocery', mobile: '0553687389', address: 'Jeddah'),
      StaticCustomer(name: 'Mohammed Ali', shopName: 'Al-Noor Store', mobile: '0501234567', address: 'Dammam'),
      StaticCustomer(name: 'Khalid Al-Harbi', shopName: 'Harbi Minimarket', mobile: '0547654321', address: 'Makkah'),
      StaticCustomer(name: 'Ahmed Al-Saeed', shopName: 'Al-Saeed Wholesale', mobile: '0569876543', address: 'Medina'),
      StaticCustomer(name: 'Yusuf Hassan', shopName: 'Hassan & Sons', mobile: '0532109876', address: 'Khobar'),
    ];

    // Seed data matching the mockup screenshot for July 31, 2026
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
      ),
    ];

    return SalesManagementState(
      customers: initialCustomersList,
      filteredCustomers: [],
      searchQuery: '',
      visitRecords: initialVisitRecords,
      selectedDate: targetDate,
    );
  }

  SalesManagementState copyWith({
    List<StaticCustomer>? customers,
    List<StaticCustomer>? filteredCustomers,
    String? searchQuery,
    List<VisitRecord>? visitRecords,
    DateTime? selectedDate,
  }) {
    return SalesManagementState(
      customers: customers ?? this.customers,
      filteredCustomers: filteredCustomers ?? this.filteredCustomers,
      searchQuery: searchQuery ?? this.searchQuery,
      visitRecords: visitRecords ?? this.visitRecords,
      selectedDate: selectedDate ?? this.selectedDate,
    );
  }
}
