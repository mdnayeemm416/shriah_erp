import 'package:hive/hive.dart';

part 'employee_expense_model.g.dart';

@HiveType(typeId: 11)
class EmployeeExpenseModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String employeeId;

  @HiveField(2)
  final String kind; // 'deposit' | 'expense'

  @HiveField(3)
  final String status; // 'pending' | 'verified'

  @HiveField(4)
  final double amount;

  @HiveField(5)
  final String category;

  @HiveField(6)
  final String note;

  @HiveField(7)
  final DateTime txnDate;

  @HiveField(8)
  final String? attachmentUrl;

  @HiveField(9)
  final DateTime createdAt;

  @HiveField(10)
  final String createdBy;

  @HiveField(11)
  final bool isDeleted;

  EmployeeExpenseModel({
    required this.id,
    required this.employeeId,
    required this.kind,
    required this.status,
    required this.amount,
    required this.category,
    required this.note,
    required this.txnDate,
    this.attachmentUrl,
    required this.createdAt,
    required this.createdBy,
    this.isDeleted = false,
  });

  factory EmployeeExpenseModel.fromJson(Map<String, dynamic> json) {
    return EmployeeExpenseModel(
      id: json['id'] as String,
      employeeId: json['employee_id'] as String,
      kind: json['kind'] as String,
      status: json['status'] as String? ?? 'pending',
      amount: (json['amount'] as num? ?? 0.0).toDouble(),
      category: json['category'] as String? ?? 'Other',
      note: json['note'] as String? ?? '',
      txnDate: DateTime.parse(json['txn_date'] as String),
      attachmentUrl: json['attachment_url'] as String?,
      createdAt: json['created_at'] != null 
          ? DateTime.parse(json['created_at'] as String) 
          : DateTime.now(),
      createdBy: json['created_by'] as String? ?? '',
      isDeleted: json['is_deleted'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'employee_id': employeeId,
      'kind': kind,
      'status': status,
      'amount': amount,
      'category': category,
      'note': note,
      'txn_date': txnDate.toIso8601String().split('T')[0],
      'attachment_url': attachmentUrl,
      'created_at': createdAt.toIso8601String(),
      'created_by': createdBy,
      'is_deleted': isDeleted,
    };
  }

  EmployeeExpenseModel copyWith({
    String? employeeId,
    String? kind,
    String? status,
    double? amount,
    String? category,
    String? note,
    DateTime? txnDate,
    String? attachmentUrl,
    DateTime? createdAt,
    String? createdBy,
    bool? isDeleted,
  }) {
    return EmployeeExpenseModel(
      id: id,
      employeeId: employeeId ?? this.employeeId,
      kind: kind ?? this.kind,
      status: status ?? this.status,
      amount: amount ?? this.amount,
      category: category ?? this.category,
      note: note ?? this.note,
      txnDate: txnDate ?? this.txnDate,
      attachmentUrl: attachmentUrl ?? this.attachmentUrl,
      createdAt: createdAt ?? this.createdAt,
      createdBy: createdBy ?? this.createdBy,
      isDeleted: isDeleted ?? this.isDeleted,
    );
  }
}
