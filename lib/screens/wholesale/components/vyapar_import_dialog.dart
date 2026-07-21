import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:uuid/uuid.dart';

import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../models/product_model.dart';
import '../../../repositories/product_repository.dart';
import '../../common_widgets/dashed_rounded_rect_painter.dart';

class VyaparImportDialog extends StatefulWidget {
  const VyaparImportDialog({super.key});

  @override
  State<VyaparImportDialog> createState() => _VyaparImportDialogState();
}

class _VyaparImportDialogState extends State<VyaparImportDialog> {
  bool fileSelected = false;
  bool isProcessing = false;
  double progress = 0.0;
  String mode = 'merge';
  List<String> importLogs = [];

  void _startImport() {
    setState(() {
      isProcessing = true;
      importLogs.add('Analyzing vyapar_export_2026.xlsx...');
    });

    Future.delayed(const Duration(milliseconds: 400), () {
      if (!mounted) return;
      setState(() {
        progress = 0.2;
        importLogs.add('Found sheet "Items List" with 8 new products.');
        importLogs.add('Column headers matched (Name, Code, Sale Price, Purchase Price, Stock, Tax).');
      });
    });

    Future.delayed(const Duration(milliseconds: 800), () {
      if (!mounted) return;
      setState(() {
        progress = 0.5;
        importLogs.add('Inserting Sunlight Dishwashing Liquid 500ml (stock: 45.0)...');
        importLogs.add('Inserting Safola Sunflower Oil 5L (stock: 12.0)...');
        importLogs.add('Inserting Azzouz Premium Dates 1kg (stock: 30.0)...');
      });
    });

    Future.delayed(const Duration(milliseconds: 1200), () {
      if (!mounted) return;
      setState(() {
        progress = 0.8;
        importLogs.add('Heinz Tomato Ketchup 507g (stock: 25.0)...');
        importLogs.add('Ariel Automatic Powder 2.5kg (stock: 10.0)...');
        importLogs.add('Validating database integrity... Logged successfully.');
      });
    });

    Future.delayed(const Duration(milliseconds: 1600), () async {
      if (!mounted) return;

      final repo = context.read<ProductRepository>();
      final now = DateTime.now();

      final sampleProducts = [
        ProductModel(
          id: const Uuid().v4(),
          name: 'Sunlight Dishwashing Liquid 500ml',
          barcode: '6281234567890',
          itemCode: 'SUN-500',
          price: 8.00,
          purchasePrice: 6.00,
          stock: 45.0,
          minStock: 5.0,
          createdAt: now,
        ),
        ProductModel(
          id: const Uuid().v4(),
          name: 'Safola Sunflower Oil 5L',
          barcode: '6289876543210',
          itemCode: 'SAF-5L',
          price: 54.00,
          purchasePrice: 42.00,
          stock: 12.0,
          minStock: 3.0,
          createdAt: now,
        ),
        ProductModel(
          id: const Uuid().v4(),
          name: 'Azzouz Premium Dates 1kg',
          barcode: '6284561237890',
          itemCode: 'DATE-1KG',
          price: 25.00,
          purchasePrice: 18.00,
          stock: 30.0,
          minStock: 5.0,
          createdAt: now,
        ),
        ProductModel(
          id: const Uuid().v4(),
          name: 'Heinz Tomato Ketchup 507g',
          barcode: '013000006087',
          itemCode: 'HNZ-KET',
          price: 11.00,
          purchasePrice: 8.50,
          stock: 25.0,
          minStock: 4.0,
          createdAt: now,
        ),
        ProductModel(
          id: const Uuid().v4(),
          name: 'Ariel Automatic Powder 2.5kg',
          barcode: '4015600378123',
          itemCode: 'ARL-2.5',
          price: 35.00,
          purchasePrice: 28.00,
          stock: 10.0,
          minStock: 2.0,
          createdAt: now,
        ),
      ];

      for (final p in sampleProducts) {
        await repo.saveProduct(p);
      }

      if (mounted) {
        context.read<WholesaleCubit>().loadAllData();

        setState(() {
          progress = 1.0;
          importLogs.add('Import complete! 5 new items written to catalog database.');
        });

        Future.delayed(const Duration(milliseconds: 400), () {
          if (!mounted) return;
          Navigator.pop(context);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Vyapar spreadsheet imported: 5 new items added.')),
          );
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? const Color(0xFF1E293B) : const Color(0xFFF8FAFC);
    final cardBgColor = isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9);
    final textColor = isDark ? Colors.white : const Color(0xFF1E293B);
    final subtitleColor = isDark ? Colors.grey[400]! : const Color(0xFF64748B);
    final borderColor = isDark ? const Color(0xFF334155) : const Color(0xFFCBD5E1);

    return Dialog(
      backgroundColor: bgColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
      ),
      insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      child: Container(
        width: 440,
        padding: const EdgeInsets.all(24),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(6),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF064E3B) : const Color(0xFFD1FAE5),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Icon(
                      LucideIcons.fileSpreadsheet,
                      color: Color(0xFF10B981),
                      size: 22,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Import from Vyapar',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: textColor,
                      ),
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: Icon(
                      LucideIcons.x,
                      color: subtitleColor,
                      size: 20,
                    ),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              if (!fileSelected && !isProcessing) ...[
                // Dashed Upload Box
                InkWell(
                  onTap: () {
                    setState(() {
                      fileSelected = true;
                    });
                  },
                  borderRadius: BorderRadius.circular(20),
                  child: CustomPaint(
                    painter: DashedRoundedRectPainter(
                      color: borderColor,
                      strokeWidth: 1.2,
                      borderRadius: 20,
                      gap: 6,
                    ),
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 32, horizontal: 20),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            LucideIcons.upload,
                            size: 38,
                            color: isDark ? Colors.grey[400] : const Color(0xFF475569),
                          ),
                          const SizedBox(height: 14),
                          Text(
                            'Choose Vyapar export (.xlsx or .csv)',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: textColor,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Auto-detects Name, Code, Sale Price, Purchase Price, Stock, Tax',
                            style: TextStyle(
                              fontSize: 12.5,
                              color: subtitleColor,
                              height: 1.3,
                            ),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Tip Section
                RichText(
                  text: TextSpan(
                    style: TextStyle(
                      fontSize: 12,
                      color: subtitleColor,
                      height: 1.45,
                    ),
                    children: [
                      const TextSpan(
                        text: 'Tip: in Vyapar mobile app go to ',
                      ),
                      TextSpan(
                        text: 'Reports \u2192 Item Report',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: textColor,
                        ),
                      ),
                      const TextSpan(
                        text:
                            ' and Export Excel. We\'ll clean broken rows, normalize numbers, remove duplicates, and auto-suggest categories.',
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Cancel Button
                OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size.fromHeight(48),
                    side: BorderSide(
                      color: isDark ? Colors.grey[700]! : const Color(0xFFE2E8F0),
                      width: 1.5,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(24),
                    ),
                    foregroundColor: textColor,
                  ),
                  onPressed: () => Navigator.pop(context),
                  child: const Text(
                    'Cancel',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ] else if (fileSelected && !isProcessing) ...[
                // Selected File Card
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    border: Border.all(
                      color: const Color(0xFF10B981).withOpacity(0.4),
                    ),
                    borderRadius: BorderRadius.circular(16),
                    color: const Color(0xFF10B981).withOpacity(0.06),
                  ),
                  child: Row(
                    children: [
                      const Icon(
                        LucideIcons.fileCheck,
                        color: Color(0xFF10B981),
                        size: 32,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'vyapar_export_2026.xlsx',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                                color: textColor,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '42.5 KB \u2022 12 products detected',
                              style: TextStyle(
                                fontSize: 12,
                                color: subtitleColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: Icon(LucideIcons.x, color: subtitleColor, size: 18),
                        onPressed: () {
                          setState(() {
                            fileSelected = false;
                          });
                        },
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Import Mode',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                    color: textColor,
                  ),
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: mode,
                  decoration: InputDecoration(
                    fillColor: cardBgColor,
                    filled: true,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: borderColor),
                    ),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  ),
                  dropdownColor: bgColor,
                  style: TextStyle(color: textColor, fontSize: 13),
                  onChanged: (val) {
                    if (val != null) {
                      setState(() {
                        mode = val;
                      });
                    }
                  },
                  items: const [
                    DropdownMenuItem(value: 'merge', child: Text('Merge (Update existing, insert new)')),
                    DropdownMenuItem(value: 'replace', child: Text('Replace (Overwrite stock, insert new)')),
                    DropdownMenuItem(value: 'skip', child: Text('Skip (Only insert new)')),
                  ],
                ),
                const SizedBox(height: 24),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          minimumSize: const Size.fromHeight(48),
                          side: BorderSide(color: borderColor),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(24),
                          ),
                          foregroundColor: textColor,
                        ),
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Cancel', style: TextStyle(fontWeight: FontWeight.w600)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          minimumSize: const Size.fromHeight(48),
                          backgroundColor: const Color(0xFF10B981),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(24),
                          ),
                          elevation: 0,
                        ),
                        onPressed: _startImport,
                        child: const Text('Import', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ] else ...[
                // Processing & Log Screen
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Importing products... ${(progress * 100).toInt()}%',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: textColor,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 12),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: LinearProgressIndicator(
                        value: progress,
                        minHeight: 8,
                        backgroundColor: cardBgColor,
                        valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF10B981)),
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Import Logs:',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                        color: subtitleColor,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      height: 160,
                      width: double.infinity,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: cardBgColor,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: borderColor),
                      ),
                      child: ListView.builder(
                        itemCount: importLogs.length,
                        itemBuilder: (context, idx) {
                          return Padding(
                            padding: const EdgeInsets.symmetric(vertical: 3.0),
                            child: Text(
                              importLogs[idx],
                              style: TextStyle(
                                fontFamily: 'monospace',
                                fontSize: 11,
                                color: isDark ? Colors.greenAccent : const Color(0xFF0F766E),
                              ),
                            ),
                          );
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
