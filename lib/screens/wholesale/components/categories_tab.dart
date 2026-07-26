import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../blocs/wholesale/wholesale_state.dart';
import '../../../models/wholesale_models.dart';
import 'add_category_bottom_sheet.dart';

class CategoriesTab extends StatelessWidget {
  const CategoriesTab({super.key});

  void _showAddCategoryDialog(BuildContext context, [WholesaleCategoryModel? categoryToEdit]) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Colors.transparent,
      builder: (context) => AddCategoryBottomSheet(categoryToEdit: categoryToEdit),
    );
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<WholesaleCubit, WholesaleState>(
      builder: (context, state) {
        return Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Product Categories',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  ElevatedButton.icon(
                    onPressed: () => _showAddCategoryDialog(context),
                    icon: const Icon(LucideIcons.plus, size: 16),
                    label: const Text('Add Category'),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Expanded(
                child: state.categories.isEmpty
                    ? const Center(child: Text('No categories added yet.'))
                    : ListView.separated(
                        itemCount: state.categories.length,
                        separatorBuilder: (_, __) =>
                            const SizedBox(height: 12),
                        itemBuilder: (context, index) {
                          final cat = state.categories[index];
                          return Card(
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                              side: BorderSide(
                                color: Colors.grey.withValues(alpha: 0.2),
                              ),
                            ),
                            child: ListTile(
                              leading: CircleAvatar(
                                backgroundColor:
                                    Colors.teal.withValues(alpha: 0.1),
                                child: const Icon(
                                  LucideIcons.tag,
                                  color: Colors.teal,
                                ),
                              ),
                              title: Text(
                                cat.name,
                                style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              subtitle: Text(
                                'AR: ${cat.nameAr ?? 'N/A'} • BN: ${cat.nameBn ?? 'N/A'}',
                              ),
                              trailing: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 10,
                                      vertical: 4,
                                    ),
                                    decoration: BoxDecoration(
                                      color: Colors.grey[200],
                                      borderRadius: BorderRadius.circular(20),
                                    ),
                                    child: Text(
                                      'Sort: ${cat.sortOrder}',
                                      style: const TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.black54,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 4),
                                  IconButton(
                                    icon: const Icon(LucideIcons.edit2, size: 16, color: Colors.blue),
                                    onPressed: () => _showAddCategoryDialog(context, cat),
                                  ),
                                  IconButton(
                                    icon: const Icon(LucideIcons.trash2, size: 16, color: Colors.red),
                                    onPressed: () {
                                      context.read<WholesaleCubit>().deleteCategory(cat.id);
                                    },
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
              ),
            ],
          ),
        );
      },
    );
  }
}
