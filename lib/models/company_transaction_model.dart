import 'package:hive/hive.dart';

part 'company_transaction_model.g.dart';

@HiveType(typeId: 5)
class CompanyTransactionModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final double amount;

  @HiveField(2)
  final String? attachmentUrl;

  @HiveField(3)
  final String category;

  @HiveField(4)
  final String? notes;

  @HiveField(5)
  final DateTime txnDate;

  @HiveField(6)
  final String txnType; // 'in' | 'out'

  @HiveField(7)
  final bool isDeleted;

  @HiveField(8)
  final DateTime createdAt;

  CompanyTransactionModel({
    required this.id,
    required this.amount,
    this.attachmentUrl,
    required this.category,
    this.notes,
    required this.txnDate,
    required this.txnType,
    this.isDeleted = false,
    required this.createdAt,
  });

  factory CompanyTransactionModel.fromJson(Map<String, dynamic> json) {
    return CompanyTransactionModel(
      id: json['id'] as String? ?? '',
      amount: (json['amount'] as num? ?? 0.0).toDouble(),
      attachmentUrl: json['attachment_url'] as String?,
      category: json['category'] as String? ?? 'General',
      notes: json['notes'] as String?,
      txnDate: json['txn_date'] != null 
          ? DateTime.tryParse(json['txn_date'] as String) ?? DateTime.now()
          : DateTime.now(),
      txnType: json['txn_type'] as String? ?? 'out',
      isDeleted: json['is_deleted'] as bool? ?? false,
      createdAt: json['created_at'] != null 
          ? DateTime.tryParse(json['created_at'] as String) ?? DateTime.now()
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'amount': amount,
      'attachment_url': attachmentUrl,
      'category': category,
      'notes': notes,
      'txn_date': txnDate.toIso8601String().split('T')[0],
      'txn_type': txnType,
      'is_deleted': isDeleted,
      'created_at': createdAt.toIso8601String(),
    };
  }

  CompanyTransactionModel copyWith({
    double? amount,
    String? attachmentUrl,
    String? category,
    String? notes,
    DateTime? txnDate,
    String? txnType,
    bool? isDeleted,
  }) {
    return CompanyTransactionModel(
      id: id,
      amount: amount ?? this.amount,
      attachmentUrl: attachmentUrl ?? this.attachmentUrl,
      category: category ?? this.category,
      notes: notes ?? this.notes,
      txnDate: txnDate ?? this.txnDate,
      txnType: txnType ?? this.txnType,
      isDeleted: isDeleted ?? this.isDeleted,
      createdAt: createdAt,
    );
  }
}
