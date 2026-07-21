import 'package:flutter/material.dart';
import '../../../blocs/wholesale/wholesale_state.dart';
import '../../../models/wholesale_models.dart';

class ReceivableBreakdownDialog extends StatefulWidget {
  final WholesaleState state;
  final Function(WholesaleCustomerModel) onOpenCustomer;

  const ReceivableBreakdownDialog({
    super.key,
    required this.state,
    required this.onOpenCustomer,
  });

  @override
  State<ReceivableBreakdownDialog> createState() => _ReceivableBreakdownDialogState();
}

class _ReceivableBreakdownDialogState extends State<ReceivableBreakdownDialog> {
  final _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    // 1. Calculate dues
    final Map<String, double> duesMap = {};
    for (final c in widget.state.customers) {
      duesMap[c.id] = c.openingDue;
    }
    for (final s in widget.state.sales) {
      if (s.status == 'cancelled' || s.customerId == null) continue;
      duesMap[s.customerId!] = (duesMap[s.customerId!] ?? 0.0) + s.dueAmount;
    }
    for (final p in widget.state.payments) {
      if (p.kind != 'payment_in') continue;
      duesMap[p.customerId] = (duesMap[p.customerId] ?? 0.0) - p.amount;
    }

    // 2. Build list of customers with dues > 0.5
    final customerDues = <Map<String, dynamic>>[];
    double totalDues = 0.0;
    for (final c in widget.state.customers) {
      final due = duesMap[c.id] ?? 0.0;
      if (due > 0.5) {
        customerDues.add({
          'customer': c,
          'due': due,
        });
        totalDues += due;
      }
    }
    
    // Sort by due descending
    customerDues.sort((a, b) => (b['due'] as double).compareTo(a['due'] as double));

    // Filter by query
    final query = _searchQuery.trim().toLowerCase();
    final filteredDues = customerDues.where((item) {
      final customer = item['customer'] as WholesaleCustomerModel;
      if (query.isEmpty) return true;
      return customer.name.toLowerCase().contains(query) ||
             customer.mobile.toLowerCase().contains(query);
    }).toList();

    // Helper for formatting
    String _fmt(double val) => val.toStringAsFixed(1).replaceAll(RegExp(r'\.0$'), '');

    return AlertDialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
      ),
      contentPadding: EdgeInsets.zero,
      titlePadding: const EdgeInsets.fromLTRB(20, 16, 12, 10),
      title: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text(
            'Receivable breakdown',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
          ),
          IconButton(
            onPressed: () => Navigator.pop(context),
            icon: const Icon(Icons.close, size: 20),
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(),
            splashRadius: 20,
          ),
        ],
      ),
      content: SizedBox(
        width: 500,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Divider(height: 1),
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 14, 16, 12),
              child: Column(
                children: [
                  // Total Card
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF2C1B20) : const Color(0xFFFFF1F2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Column(
                      children: [
                        Text(
                          'TOTAL CUSTOMER DUES',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: isDark ? const Color(0xFFF43F5E) : const Color(0xFFE11D48),
                            letterSpacing: 0.5,
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'SAR ${_fmt(totalDues)}',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                            color: isDark ? const Color(0xFFF43F5E) : const Color(0xFFE11D48),
                          ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          '${customerDues.length} customers • sorted by highest due',
                          style: TextStyle(
                            fontSize: 11,
                            color: isDark ? Colors.grey[400] : const Color(0xFF64748B),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Search Field
                  Container(
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: TextField(
                      controller: _searchController,
                      onChanged: (val) {
                        setState(() {
                          _searchQuery = val;
                        });
                      },
                      decoration: InputDecoration(
                        hintText: 'Search customer...',
                        hintStyle: TextStyle(
                          fontSize: 13,
                          color: isDark ? Colors.grey[400] : const Color(0xFF64748B),
                        ),
                        prefixIcon: Icon(
                          Icons.search,
                          size: 18,
                          color: isDark ? Colors.grey[400] : const Color(0xFF64748B),
                        ),
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.symmetric(vertical: 10),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            // Customers List
            Flexible(
              child: Container(
                constraints: const BoxConstraints(maxHeight: 480),
                child: filteredDues.isEmpty
                    ? Padding(
                        padding: const EdgeInsets.symmetric(vertical: 32.0),
                        child: Center(
                          child: Text(
                            'No outstanding dues.',
                            style: TextStyle(
                              fontSize: 13,
                              color: isDark ? Colors.grey[400] : const Color(0xFF64748B),
                            ),
                          ),
                        ),
                      )
                    : ListView.builder(
                        shrinkWrap: true,
                        itemCount: filteredDues.length,
                        padding: const EdgeInsets.only(left: 10, right: 10, bottom: 10),
                        itemBuilder: (context, index) {
                          final item = filteredDues[index];
                          final customer = item['customer'] as WholesaleCustomerModel;
                          final due = item['due'] as double;

                          return Padding(
                            padding: const EdgeInsets.symmetric(vertical: 2.0),
                            child: InkWell(
                              onTap: () {
                                Navigator.pop(context);
                                widget.onOpenCustomer(customer);
                              },
                              borderRadius: BorderRadius.circular(16),
                              child: Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 8.0),
                                child: Row(
                                  children: [
                                    CircleAvatar(
                                      radius: 18,
                                      backgroundColor: (isDark ? Colors.redAccent : const Color(0xFFE11D48)).withValues(alpha: 0.1),
                                      child: Icon(
                                        Icons.account_balance_wallet_outlined,
                                        size: 16,
                                        color: isDark ? Colors.redAccent : const Color(0xFFE11D48),
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            customer.name,
                                            style: const TextStyle(
                                              fontSize: 13,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          if (customer.mobile.isNotEmpty) ...[
                                            const SizedBox(height: 2),
                                            Text(
                                              customer.mobile,
                                              style: TextStyle(
                                                fontSize: 10,
                                                color: isDark ? Colors.grey[400] : const Color(0xFF64748B),
                                              ),
                                            ),
                                          ],
                                        ],
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      'SAR ${_fmt(due)}',
                                      style: TextStyle(
                                        fontSize: 13,
                                        fontWeight: FontWeight.bold,
                                        color: isDark ? const Color(0xFFF43F5E) : const Color(0xFFE11D48),
                                      ),
                                    ),
                                    const SizedBox(width: 4),
                                    Icon(
                                      Icons.chevron_right,
                                      size: 16,
                                      color: isDark ? Colors.grey[500] : const Color(0xFF94A3B8),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
