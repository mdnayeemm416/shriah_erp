import 'package:hive/hive.dart';

part 'employee_entry_model.g.dart';

@HiveType(typeId: 4)
class EmployeeEntryModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String employeeId;

  @HiveField(2)
  final String entryType; // 'give' | 'receive' | 'salary' | 'expense'

  @HiveField(3)
  final double amount;

  @HiveField(4)
  final String kind; // 'cash' | 'bank' etc.

  @HiveField(5)
  final String? notes;

  @HiveField(6)
  final String? attachmentUrl;

  @HiveField(7)
  final DateTime txnDate;

  @HiveField(8)
  final bool isDeleted;

  @HiveField(9)
  final DateTime createdAt;

  EmployeeEntryModel({
    required this.id,
    required this.employeeId,
    required this.entryType,
    required this.amount,
    required this.kind,
    this.notes,
    this.attachmentUrl,
    required this.txnDate,
    this.isDeleted = false,
    required this.createdAt,
  });

  factory EmployeeEntryModel.fromJson(Map<String, dynamic> json) {
    return EmployeeEntryModel(
      id: json['id'] as String? ?? '',
      employeeId: (json['employeeId'] ?? json['employee_id'] ?? '') as String,
      entryType: (json['entryType'] ?? json['entry_type'] ?? 'give') as String,
      amount: (json['amount'] as num? ?? 0.0).toDouble(),
      kind: json['kind'] as String? ?? 'cash',
      notes: json['notes'] as String?,
      attachmentUrl: (json['attachmentUrl'] ?? json['attachment_url']) as String?,
      txnDate: json['txnDate'] != null || json['txn_date'] != null
          ? DateTime.tryParse((json['txnDate'] ?? json['txn_date']) as String) ?? DateTime.now()
          : DateTime.now(),
      isDeleted: (json['isDeleted'] ?? json['is_deleted']) as bool? ?? false,
      createdAt: json['createdAt'] != null || json['created_at'] != null
          ? DateTime.tryParse((json['createdAt'] ?? json['created_at']) as String) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'employee_id': employeeId,
      'entry_type': entryType,
      'amount': amount,
      'kind': kind,
      'notes': notes,
      'attachment_url': attachmentUrl,
      'txn_date': txnDate.toIso8601String().split('T')[0],
      'is_deleted': isDeleted,
      'created_at': createdAt.toIso8601String(),
    };
  }

  EmployeeEntryModel copyWith({
    String? employeeId,
    String? entryType,
    double? amount,
    String? kind,
    String? notes,
    String? attachmentUrl,
    DateTime? txnDate,
    bool? isDeleted,
  }) {
    return EmployeeEntryModel(
      id: id,
      employeeId: employeeId ?? this.employeeId,
      entryType: entryType ?? this.entryType,
      amount: amount ?? this.amount,
      kind: kind ?? this.kind,
      notes: notes ?? this.notes,
      attachmentUrl: attachmentUrl ?? this.attachmentUrl,
      txnDate: txnDate ?? this.txnDate,
      isDeleted: isDeleted ?? this.isDeleted,
      createdAt: createdAt,
    );
  }
}
