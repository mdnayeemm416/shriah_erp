class EmployeeItem {
  final String id;
  final String name;
  final String? shopId;
  final String? shopName;
  final String mobile;
  final String iqama;
  final double monthlySalary;
  final String? linkedUserId;
  final String? linkedUserName;
  final String notes;
  final String? attachmentName;
  final double totalGiven;
  final double totalReceived;
  final DateTime createdAt;

  EmployeeItem({
    required this.id,
    required this.name,
    this.shopId,
    this.shopName,
    required this.mobile,
    required this.iqama,
    required this.monthlySalary,
    this.linkedUserId,
    this.linkedUserName,
    this.notes = '',
    this.attachmentName,
    this.totalGiven = 0.0,
    this.totalReceived = 0.0,
    required this.createdAt,
  });

  double get outstanding => totalGiven - totalReceived;

  EmployeeItem copyWith({
    String? name,
    String? shopId,
    String? shopName,
    String? mobile,
    String? iqama,
    double? monthlySalary,
    String? linkedUserId,
    String? linkedUserName,
    String? notes,
    String? attachmentName,
    double? totalGiven,
    double? totalReceived,
  }) {
    return EmployeeItem(
      id: id,
      name: name ?? this.name,
      shopId: shopId ?? this.shopId,
      shopName: shopName ?? this.shopName,
      mobile: mobile ?? this.mobile,
      iqama: iqama ?? this.iqama,
      monthlySalary: monthlySalary ?? this.monthlySalary,
      linkedUserId: linkedUserId ?? this.linkedUserId,
      linkedUserName: linkedUserName ?? this.linkedUserName,
      notes: notes ?? this.notes,
      attachmentName: attachmentName ?? this.attachmentName,
      totalGiven: totalGiven ?? this.totalGiven,
      totalReceived: totalReceived ?? this.totalReceived,
      createdAt: createdAt,
    );
  }
}

class WalletTransactionItem {
  final String id;
  final String employeeId;
  final String employeeName;
  final String type; // 'deposit' | 'expense'
  final double amount;
  final DateTime date;
  final String category;
  final String notes;
  final String paymentMode;

  WalletTransactionItem({
    required this.id,
    required this.employeeId,
    required this.employeeName,
    required this.type,
    required this.amount,
    required this.date,
    this.category = 'General',
    this.notes = '',
    this.paymentMode = 'Cash',
  });
}

class EmployeeDummyData {
  static List<String> shops = [
    'Main Store - Riyadh',
    'Branch 1 - Jeddah',
    'Branch 2 - Dammam',
    'Warehouse - Olaya',
  ];

  static List<Map<String, String>> loginUsers = [
    {'id': 'u1', 'name': 'Morshed Alam (Sales)'},
    {'id': 'u2', 'name': 'Tariq Al-Mansoor (Cashier)'},
    {'id': 'u3', 'name': 'Rashid Khan (Driver)'},
    {'id': 'u4', 'name': 'Farhan Qureshi (Accountant)'},
  ];

  static List<EmployeeItem> getInitialEmployees() {
    return [
      EmployeeItem(
        id: 'emp_1',
        name: 'Morshed Alam',
        shopId: 'shop_1',
        shopName: 'Main Store - Riyadh',
        mobile: '0551234567',
        iqama: '2456789123',
        monthlySalary: 2500.0,
        linkedUserId: 'u1',
        linkedUserName: 'Morshed Alam (Sales)',
        notes: 'Senior branch salesman',
        totalGiven: 1200.0,
        totalReceived: 450.0,
        createdAt: DateTime.now().subtract(const Duration(days: 45)),
      ),
      EmployeeItem(
        id: 'emp_2',
        name: 'Tariq Al-Mansoor',
        shopId: 'shop_2',
        shopName: 'Branch 1 - Jeddah',
        mobile: '0569876543',
        iqama: '2345678910',
        monthlySalary: 3000.0,
        linkedUserId: 'u2',
        linkedUserName: 'Tariq Al-Mansoor (Cashier)',
        notes: 'Head cashier Jeddah',
        totalGiven: 800.0,
        totalReceived: 800.0,
        createdAt: DateTime.now().subtract(const Duration(days: 60)),
      ),
      EmployeeItem(
        id: 'emp_3',
        name: 'Rashid Khan',
        shopId: 'shop_1',
        shopName: 'Main Store - Riyadh',
        mobile: '0501122334',
        iqama: '2567891234',
        monthlySalary: 1800.0,
        linkedUserId: 'u3',
        linkedUserName: 'Rashid Khan (Driver)',
        notes: 'Delivery logistics',
        totalGiven: 650.0,
        totalReceived: 150.0,
        createdAt: DateTime.now().subtract(const Duration(days: 20)),
      ),
    ];
  }

  static List<WalletTransactionItem> getInitialWalletTransactions() {
    return [
      WalletTransactionItem(
        id: 'wt_1',
        employeeId: 'emp_1',
        employeeName: 'Morshed Alam',
        type: 'deposit',
        amount: 500.0,
        date: DateTime.now().subtract(const Duration(days: 2)),
        category: 'Cash Advance',
        notes: 'Delivery cash float',
        paymentMode: 'Cash',
      ),
      WalletTransactionItem(
        id: 'wt_2',
        employeeId: 'emp_1',
        employeeName: 'Morshed Alam',
        type: 'expense',
        amount: 150.0,
        date: DateTime.now().subtract(const Duration(days: 1)),
        category: 'Fuel',
        notes: 'Vehicle refueling receipt #492',
        paymentMode: 'Cash',
      ),
      WalletTransactionItem(
        id: 'wt_3',
        employeeId: 'emp_3',
        employeeName: 'Rashid Khan',
        type: 'deposit',
        amount: 300.0,
        date: DateTime.now().subtract(const Duration(hours: 12)),
        category: 'Daily Float',
        notes: 'Van supply advance',
        paymentMode: 'Bank Transfer',
      ),
      WalletTransactionItem(
        id: 'wt_4',
        employeeId: 'emp_3',
        employeeName: 'Rashid Khan',
        type: 'expense',
        amount: 75.0,
        date: DateTime.now().subtract(const Duration(hours: 4)),
        category: 'Maintenance',
        notes: 'Tire puncture repair',
        paymentMode: 'Cash',
      ),
    ];
  }
}
