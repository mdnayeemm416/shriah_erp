import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../repositories/product_repository.dart';

class BulkAdjustStockDialog extends StatefulWidget {
  final Set<String> selectedProductIds;
  final VoidCallback onSuccess;

  const BulkAdjustStockDialog({
    super.key,
    required this.selectedProductIds,
    required this.onSuccess,
  });

  @override
  State<BulkAdjustStockDialog> createState() => _BulkAdjustStockDialogState();
}

class _BulkAdjustStockDialogState extends State<BulkAdjustStockDialog> {
  final formKey = GlobalKey<FormState>();
  final valueController = TextEditingController();
  String adjustType = 'add';

  @override
  void dispose() {
    valueController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
      ),
      title: Text('Bulk Adjust Stock (${widget.selectedProductIds.length} items)'),
      content: Form(
        key: formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Adjustment Type', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            const SizedBox(height: 8),
            DropdownButtonFormField<String>(
              initialValue: adjustType,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              ),
              onChanged: (val) {
                if (val != null) {
                  setState(() {
                    adjustType = val;
                  });
                }
              },
              items: const [
                DropdownMenuItem(value: 'add', child: Text('Add to current stock (+)')),
                DropdownMenuItem(value: 'sub', child: Text('Subtract from current stock (-)')),
                DropdownMenuItem(value: 'set', child: Text('Set as new fixed stock (=)')),
              ],
            ),
            const SizedBox(height: 16),
            const Text('Stock Quantity', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
            const SizedBox(height: 8),
            TextFormField(
              controller: valueController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(
                hintText: 'e.g. 10',
                border: OutlineInputBorder(),
              ),
              validator: (val) {
                if (val == null || double.tryParse(val) == null) {
                  return 'Enter valid numeric value';
                }
                return null;
              },
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Cancel'),
        ),
        ElevatedButton(
          onPressed: () async {
            if (formKey.currentState!.validate()) {
              final adjustVal = double.parse(valueController.text);
              final state = context.read<WholesaleCubit>().state;
              
              for (final id in widget.selectedProductIds) {
                final product = state.products.firstWhere((p) => p.id == id);
                double newStock = product.stock;
                if (adjustType == 'add') {
                  newStock = product.stock + adjustVal;
                } else if (adjustType == 'sub') {
                  newStock = product.stock - adjustVal;
                } else if (adjustType == 'set') {
                  newStock = adjustVal;
                }
                await context.read<ProductRepository>().updateStock(id, newStock);
              }
              
              if (mounted) {
                context.read<WholesaleCubit>().loadAllData();
                widget.onSuccess();
                Navigator.pop(context);
              }
            }
          },
          child: const Text('Save'),
        ),
      ],
    );
  }
}
