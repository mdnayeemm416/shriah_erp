import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../blocs/wholesale/wholesale_state.dart';
import '../../../models/wholesale_models.dart';
import 'add_party_bottom_sheet.dart';

class PartiesDialog extends StatefulWidget {
  final String initialFilter;

  const PartiesDialog({
    super.key,
    this.initialFilter = 'Supplier',
  });

  @override
  State<PartiesDialog> createState() => _PartiesDialogState();
}

class _PartiesDialogState extends State<PartiesDialog> {
  final _searchController = TextEditingController();
  late String _selectedFilter;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _selectedFilter = widget.initialFilter;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _showAddPartySheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Colors.transparent,
      builder: (context) => AddPartyBottomSheet(
        initialType: _selectedFilter == 'All' ? 'Supplier' : _selectedFilter,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBgColor = isDark ? const Color(0xFF1E293B) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF1E293B);
    final labelColor = isDark ? const Color(0xFF94A3B8) : const Color(0xFF64748B);
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0);
    const primaryGreen = Color(0xFF10B981);

    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 480, maxHeight: 680),
        decoration: BoxDecoration(
          color: cardBgColor,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: borderColor),
        ),
        padding: const EdgeInsets.all(20),
        child: BlocBuilder<WholesaleCubit, WholesaleState>(
          builder: (context, state) {
            // Filter parties
            final filteredParties = state.customers.where((p) {
              if (p.isDeleted) return false;
              final isSupplierNote = p.notes?.contains('Type: Supplier') == true;
              final isCustomerNote = p.notes?.contains('Type: Customer') == true;

              if (_selectedFilter == 'Supplier' && isCustomerNote) return false;
              if (_selectedFilter == 'Customer' && isSupplierNote) return false;

              if (_searchQuery.isNotEmpty) {
                final q = _searchQuery.toLowerCase();
                final nameMatch = p.name.toLowerCase().contains(q);
                final phoneMatch = p.mobile.toLowerCase().contains(q);
                return nameMatch || phoneMatch;
              }
              return true;
            }).toList();

            return Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Bar: Parties Title & + Add Party Button
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: primaryGreen.withValues(alpha: 0.12),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            LucideIcons.users,
                            color: primaryGreen,
                            size: 20,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Text(
                          'Parties',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: textColor,
                          ),
                        ),
                      ],
                    ),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: primaryGreen,
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 10,
                        ),
                      ),
                      onPressed: _showAddPartySheet,
                      icon: const Icon(LucideIcons.plus, size: 16),
                      label: const Text(
                        'Add party',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Search by name or phone...
                TextField(
                  controller: _searchController,
                  onChanged: (val) {
                    setState(() {
                      _searchQuery = val.trim();
                    });
                  },
                  style: TextStyle(fontSize: 14, color: textColor),
                  decoration: InputDecoration(
                    hintText: 'Search by name or phone...',
                    hintStyle: TextStyle(fontSize: 13, color: labelColor),
                    prefixIcon: Icon(LucideIcons.search, size: 18, color: labelColor),
                    filled: true,
                    fillColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(24),
                      borderSide: BorderSide(color: borderColor),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(24),
                      borderSide: BorderSide(color: borderColor),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(24),
                      borderSide: const BorderSide(color: primaryGreen, width: 1.5),
                    ),
                  ),
                ),
                const SizedBox(height: 12),

                // Type Filter Dropdown (Supplier, Customer, All)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: borderColor),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: _selectedFilter,
                      isExpanded: true,
                      dropdownColor: cardBgColor,
                      style: TextStyle(color: textColor, fontSize: 14, fontWeight: FontWeight.w500),
                      icon: Icon(LucideIcons.chevronDown, size: 16, color: labelColor),
                      items: const [
                        DropdownMenuItem(value: 'Supplier', child: Text('Supplier')),
                        DropdownMenuItem(value: 'Customer', child: Text('Customer')),
                        DropdownMenuItem(value: 'All', child: Text('All Parties')),
                      ],
                      onChanged: (val) {
                        if (val != null) {
                          setState(() {
                            _selectedFilter = val;
                          });
                        }
                      },
                    ),
                  ),
                ),
                const SizedBox(height: 24),

                // Main Content (Empty state or Party List)
                Expanded(
                  child: filteredParties.isEmpty
                      ? Center(
                          child: Text(
                            'No parties yet.',
                            style: TextStyle(
                              fontSize: 14,
                              color: labelColor,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        )
                      : ListView.separated(
                          itemCount: filteredParties.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 10),
                          itemBuilder: (context, index) {
                            final party = filteredParties[index];
                            final isSupplier = party.notes?.contains('Type: Supplier') == true;

                            return Container(
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: borderColor),
                              ),
                              child: Row(
                                children: [
                                  CircleAvatar(
                                    backgroundColor: (isSupplier ? Colors.orange : primaryGreen)
                                        .withValues(alpha: 0.15),
                                    child: Icon(
                                      isSupplier ? LucideIcons.truck : LucideIcons.user,
                                      color: isSupplier ? Colors.orange : primaryGreen,
                                      size: 18,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          party.name,
                                          style: TextStyle(
                                            fontSize: 14,
                                            fontWeight: FontWeight.bold,
                                            color: textColor,
                                          ),
                                        ),
                                        const SizedBox(height: 2),
                                        Text(
                                          party.mobile.isEmpty ? 'No phone' : party.mobile,
                                          style: TextStyle(
                                            fontSize: 12,
                                            color: labelColor,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: [
                                      Text(
                                        'SAR ${party.openingDue.toStringAsFixed(0)}',
                                        style: TextStyle(
                                          fontSize: 13,
                                          fontWeight: FontWeight.bold,
                                          color: party.openingDue > 0 ? Colors.red : primaryGreen,
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: (isSupplier ? Colors.orange : primaryGreen)
                                              .withValues(alpha: 0.12),
                                          borderRadius: BorderRadius.circular(10),
                                        ),
                                        child: Text(
                                          isSupplier ? 'Supplier' : 'Customer',
                                          style: TextStyle(
                                            fontSize: 10,
                                            fontWeight: FontWeight.bold,
                                            color: isSupplier ? Colors.orange : primaryGreen,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
