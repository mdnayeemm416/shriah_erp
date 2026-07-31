class OpeningBalanceModel {
  final double amount;
  final double? systemOpeningBalance;
  final double? todayOpeningBalance;
  final String date;
  final String? notes;

  OpeningBalanceModel({
    required this.amount,
    this.systemOpeningBalance,
    this.todayOpeningBalance,
    required this.date,
    this.notes,
  });

  factory OpeningBalanceModel.fromJson(Map<String, dynamic> json) {
    final amountVal = (json['amount'] ??
            json['todayOpeningBalance'] ??
            json['systemOpeningBalance'] ??
            0.0) as num;
    return OpeningBalanceModel(
      amount: amountVal.toDouble(),
      systemOpeningBalance: (json['systemOpeningBalance'] as num?)?.toDouble(),
      todayOpeningBalance: (json['todayOpeningBalance'] as num?)?.toDouble(),
      date: (json['date'] as String?) ??
          DateTime.now().toIso8601String().split('T')[0],
      notes: json['notes'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'amount': amount,
      'date': date,
      if (notes != null && notes!.isNotEmpty) 'notes': notes,
    };
  }
}
