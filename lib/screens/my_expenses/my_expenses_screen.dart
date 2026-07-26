import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';

import '../../blocs/my_expenses/my_expenses_cubit.dart';
import '../../blocs/auth/auth_cubit.dart';
import '../../blocs/auth/auth_state.dart';
import '../../models/employee_expense_model.dart';
import '../../core/theme/app_colors.dart';

class MyExpensesScreen extends StatefulWidget {
  const MyExpensesScreen({super.key});

  @override
  State<MyExpensesScreen> createState() => _MyExpensesScreenState();
}

class _MyExpensesScreenState extends State<MyExpensesScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _amountController = TextEditingController();
  final TextEditingController _noteController = TextEditingController();
  String _selectedCategory = 'Food';
  String _selectedKind = 'expense'; // 'expense' | 'deposit'
  DateTime _selectedDate = DateTime.now();

  final List<String> _categories = [
    'Food',
    'Fuel',
    'Transport',
    'Maintenance',
    'Office Supplies',
    'Rent',
    'Utility',
    'Others',
  ];

  @override
  void initState() {
    super.initState();
    final authState = context.read<AuthCubit>().state;
    if (authState is AuthAuthenticated) {
      context.read<MyExpensesCubit>().loadForUser(authState.user.id);
    }
  }

  @override
  void dispose() {
    _amountController.dispose();
    _noteController.dispose();
    super.dispose();
  }

  void _showAddDialog(BuildContext context, String initialKind) {
    setState(() {
      _selectedKind = initialKind;
      _amountController.clear();
      _noteController.clear();
      _selectedCategory = 'Food';
      _selectedDate = DateTime.now();
    });

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
                top: 24,
                left: 24,
                right: 24,
              ),
              child: Form(
                key: _formKey,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          _selectedKind == 'expense' ? 'Log New Expense' : 'Log New Deposit',
                          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                        Row(
                          children: [
                            ChoiceChip(
                              label: const Text('Expense'),
                              selected: _selectedKind == 'expense',
                              onSelected: (selected) {
                                if (selected) {
                                  setModalState(() => _selectedKind = 'expense');
                                }
                              },
                            ),
                            const SizedBox(width: 8),
                            ChoiceChip(
                              label: const Text('Deposit'),
                              selected: _selectedKind == 'deposit',
                              onSelected: (selected) {
                                if (selected) {
                                  setModalState(() => _selectedKind = 'deposit');
                                }
                              },
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    TextFormField(
                      controller: _amountController,
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                      decoration: const InputDecoration(
                        labelText: 'Amount',
                        prefixText: 'SAR ',
                      ),
                      validator: (val) {
                        if (val == null || val.isEmpty) return 'Enter an amount';
                        if (double.tryParse(val) == null) return 'Enter a valid number';
                        return null;
                      },
                    ),
                    const SizedBox(height: 12),
                    if (_selectedKind == 'expense') ...[
                      DropdownButtonFormField<String>(
                        initialValue: _selectedCategory,
                        decoration: const InputDecoration(labelText: 'Category'),
                        items: _categories.map((c) {
                          return DropdownMenuItem(value: c, child: Text(c));
                        }).toList(),
                        onChanged: (val) {
                          if (val != null) {
                            setModalState(() => _selectedCategory = val);
                          }
                        },
                      ),
                      const SizedBox(height: 12),
                    ],
                    TextFormField(
                      controller: _noteController,
                      decoration: const InputDecoration(
                        labelText: 'Description / Notes',
                      ),
                      validator: (val) {
                        if (val == null || val.isEmpty) return 'Enter notes';
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        const Icon(LucideIcons.calendar, size: 18),
                        const SizedBox(width: 8),
                        Text(DateFormat('yyyy-MM-dd').format(_selectedDate)),
                        const Spacer(),
                        TextButton(
                          onPressed: () async {
                            final picked = await showDatePicker(
                              context: context,
                              initialDate: _selectedDate,
                              firstDate: DateTime(2020),
                              lastDate: DateTime(2030),
                            );
                            if (picked != null) {
                              setModalState(() => _selectedDate = picked);
                            }
                          },
                          child: const Text('Pick Date'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: () async {
                        if (_formKey.currentState!.validate()) {
                          final authState = context.read<AuthCubit>().state;
                          String userId = 'system';
                          if (authState is AuthAuthenticated) {
                            userId = authState.user.id;
                          }
                          await context.read<MyExpensesCubit>().submitExpense(
                                kind: _selectedKind,
                                amount: double.parse(_amountController.text),
                                category: _selectedKind == 'deposit' ? 'Deposit' : _selectedCategory,
                                note: _noteController.text,
                                date: _selectedDate,
                                userId: userId,
                              );
                          if (ctx.mounted) {
                            Navigator.pop(ctx);
                          }
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        minimumSize: const Size.fromHeight(50),
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                      ),
                      child: const Text('Submit Ledger Entry', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final authState = context.read<AuthCubit>().state;
    String currentUserId = '';
    if (authState is AuthAuthenticated) {
      currentUserId = authState.user.id;
    }

    return BlocBuilder<MyExpensesCubit, MyExpensesState>(
      builder: (context, state) {
        if (state.loading) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        if (!state.linked) {
          return Scaffold(
            body: Center(
              child: Card(
                margin: const EdgeInsets.all(24),
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(LucideIcons.wallet, size: 64, color: Colors.grey),
                      const SizedBox(height: 16),
                      const Text(
                        'Not linked to an employee profile',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Ask an admin to link your login credential to your employee record to start using the wallet.',
                        style: TextStyle(color: isDark ? Colors.grey[400] : Colors.grey[600]),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
        }

        final formatter = NumberFormat.currency(symbol: 'SAR');

        return Scaffold(
          body: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'My Wallet',
                          style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, letterSpacing: -0.5),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${state.employee?.name} ${state.employee?.shopId != null ? '· ${state.employee?.shopId}' : ''}',
                          style: TextStyle(fontSize: 14, color: isDark ? Colors.grey[400] : Colors.grey[600]),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(LucideIcons.arrowUpCircle, color: Colors.red),
                          onPressed: () => _showAddDialog(context, 'expense'),
                          tooltip: 'Log Expense',
                        ),
                        IconButton(
                          icon: const Icon(LucideIcons.arrowDownCircle, color: Colors.green),
                          onPressed: () => _showAddDialog(context, 'deposit'),
                          tooltip: 'Log Deposit',
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                // Balance Hero
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: state.balance >= 0 
                        ? Colors.green.withOpacity(isDark ? 0.15 : 0.08) 
                        : Colors.red.withOpacity(isDark ? 0.15 : 0.08),
                    border: Border.all(
                      color: state.balance >= 0 ? Colors.green.withOpacity(0.3) : Colors.red.withOpacity(0.3),
                      width: 1.5,
                    ),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'WALLET BALANCE',
                        style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1.5),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        formatter.format(state.balance),
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          color: state.balance >= 0 ? Colors.green : Colors.red,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        state.balance >= 0
                            ? 'You are currently holding this much company cash.'
                            : 'The company owes you this advance reimbursement amount.',
                        style: TextStyle(fontSize: 12, color: isDark ? Colors.grey[400] : Colors.grey[600]),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // Summary Stats Grid
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 2.5,
                  children: [
                    _buildSummaryTile('Total Deposit', state.deposit, Colors.green, isDark),
                    _buildSummaryTile('Total Expense', state.expense, Colors.red, isDark),
                    _buildSummaryTile('This Month Deposit', state.depositMonth, Colors.green, isDark),
                    _buildSummaryTile('This Month Expense', state.expenseMonth, Colors.red, isDark),
                  ],
                ),
                const SizedBox(height: 24),

                // Filter tabs
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: ['today', 'week', 'month', 'all'].map((f) {
                      final isSelected = state.filter == f;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8.0),
                        child: ChoiceChip(
                          label: Text(
                            f == 'all' ? 'All' : (f == 'today' ? 'Today' : (f == 'week' ? 'This Week' : 'This Month')),
                          ),
                          selected: isSelected,
                          onSelected: (selected) {
                            if (selected) {
                              context.read<MyExpensesCubit>().changeFilter(f);
                            }
                          },
                        ),
                      );
                    }).toList(),
                  ),
                ),
                const SizedBox(height: 16),

                // History List
                Expanded(
                  child: state.expensesList.isEmpty
                      ? const Center(
                          child: Text('No transactions logs found for this range.', style: TextStyle(color: Colors.grey)),
                        )
                      : ListView.separated(
                          itemCount: state.expensesList.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 10),
                          itemBuilder: (context, index) {
                            final e = state.expensesList[index];
                            final isDeposit = e.kind == 'deposit';
                            
                            // Check 24 hour edit window & ownership
                            final age = DateTime.now().difference(e.createdAt);
                            final canEdit = age.inHours < 24 && e.createdBy == currentUserId;

                            return Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: isDark ? AppColors.cardDark : Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: isDark ? Colors.grey[850]! : Colors.grey[200]!,
                                ),
                              ),
                              child: Row(
                                children: [
                                  CircleAvatar(
                                    backgroundColor: isDeposit ? Colors.green.withOpacity(0.1) : Colors.red.withOpacity(0.1),
                                    child: Icon(
                                      isDeposit ? LucideIcons.arrowDownCircle : LucideIcons.arrowUpCircle,
                                      color: isDeposit ? Colors.green : Colors.red,
                                    ),
                                  ),
                                  const SizedBox(width: 16),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          children: [
                                            Text(
                                              isDeposit ? 'Deposit' : e.category,
                                              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                                            ),
                                            const SizedBox(width: 8),
                                            if (isDeposit)
                                              Container(
                                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                                decoration: BoxDecoration(
                                                  color: e.status == 'verified' 
                                                      ? Colors.green.withOpacity(0.1) 
                                                      : Colors.amber.withOpacity(0.1),
                                                  borderRadius: BorderRadius.circular(4),
                                                ),
                                                child: Text(
                                                  e.status.toUpperCase(),
                                                  style: TextStyle(
                                                    fontSize: 9, 
                                                    fontWeight: FontWeight.bold,
                                                    color: e.status == 'verified' ? Colors.green : Colors.amber,
                                                  ),
                                                ),
                                              ),
                                          ],
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          '${DateFormat('yyyy-MM-dd').format(e.txnDate)} · ${e.note}',
                                          style: TextStyle(fontSize: 12, color: Colors.grey[500]),
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ],
                                    ),
                                  ),
                                  Text(
                                    formatter.format(e.amount),
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: isDeposit ? Colors.green : Colors.red,
                                    ),
                                  ),
                                  if (canEdit) ...[
                                    const SizedBox(width: 8),
                                    IconButton(
                                      icon: const Icon(LucideIcons.trash2, color: Colors.red, size: 18),
                                      onPressed: () {
                                        showDialog(
                                          context: context,
                                          builder: (ctx) => AlertDialog(
                                            title: const Text('Delete Entry?'),
                                            content: const Text('Are you sure you want to delete this ledger entry?'),
                                            actions: [
                                              TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
                                              TextButton(
                                                onPressed: () {
                                                  context.read<MyExpensesCubit>().deleteExpense(e.id);
                                                  Navigator.pop(ctx);
                                                },
                                                child: const Text('Delete', style: TextStyle(color: Colors.red)),
                                              ),
                                            ],
                                          ),
                                        );
                                      },
                                    ),
                                  ],
                                ],
                              ),
                            );
                          },
                        ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildSummaryTile(String label, double val, Color color, bool isDark) {
    final formatter = NumberFormat.currency(symbol: 'SAR');
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: isDark ? AppColors.cardDark : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: isDark ? Colors.grey[850]! : Colors.grey[200]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(label, style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.w500)),
          const SizedBox(height: 4),
          Text(
            formatter.format(val),
            style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: color),
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
