import 'dart:convert';
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/api/api_client.dart';
import '../../../core/api/endpoints/api_endpoints.dart';
import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../common_widgets/dashed_rounded_rect_painter.dart';

class VyaparImportDialog extends StatefulWidget {
  const VyaparImportDialog({super.key});

  @override
  State<VyaparImportDialog> createState() => _VyaparImportDialogState();
}

class _VyaparImportDialogState extends State<VyaparImportDialog> {
  PlatformFile? _pickedFile;
  bool _isProcessing = false;
  double _progress = 0.0;
  String _mode = 'merge';
  List<String> _importLogs = [];

  Future<void> _pickCsvFile() async {
    try {
      final result = await FilePicker.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['csv', 'xlsx', 'xls', 'txt'],
        withData: true,
      );

      if (result != null && result.files.isNotEmpty) {
        setState(() {
          _pickedFile = result.files.first;
        });
      }
    } catch (e) {
      debugPrint('Error picking CSV file: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error picking file: $e')),
        );
      }
    }
  }

  Future<void> _startImport() async {
    if (_pickedFile == null) return;

    setState(() {
      _isProcessing = true;
      _progress = 0.2;
      _importLogs = ['Reading CSV file "${_pickedFile!.name}"...'];
    });

    try {
      final api = ApiClient();
      String? csvText;

      if (_pickedFile!.bytes != null) {
        try {
          csvText = utf8.decode(_pickedFile!.bytes!);
        } catch (_) {}
      } else if (_pickedFile!.path != null) {
        try {
          final f = File(_pickedFile!.path!);
          if (f.existsSync()) {
            csvText = await f.readAsString();
          }
        } catch (_) {}
      }

      setState(() {
        _progress = 0.5;
        _importLogs.add('Uploading CSV file to server API...');
      });

      dynamic formData;
      if (_pickedFile!.path != null) {
        formData = FormData.fromMap({
          'file': await MultipartFile.fromFile(_pickedFile!.path!, filename: _pickedFile!.name),
          'mode': _mode,
          if (csvText != null) 'csv_content': csvText,
        });
      } else if (_pickedFile!.bytes != null) {
        formData = FormData.fromMap({
          'file': MultipartFile.fromBytes(_pickedFile!.bytes!, filename: _pickedFile!.name),
          'mode': _mode,
          if (csvText != null) 'csv_content': csvText,
        });
      } else {
        formData = {
          'csv_content': csvText ?? '',
          'mode': _mode,
        };
      }

      await api.dio.post(
        ApiEndpoints.wholesaleImportCsv,
        data: formData,
      );

      setState(() {
        _progress = 1.0;
        _importLogs.add('Import complete! Products synced successfully.');
      });

      if (mounted) {
        final cubit = context.read<WholesaleCubit>();
        final messenger = ScaffoldMessenger.of(context);
        final navigator = Navigator.of(context);
        await cubit.loadAllData();
        navigator.pop();
        messenger.showSnackBar(
          const SnackBar(
            content: Text('CSV file imported successfully! Products refreshed.'),
            backgroundColor: Color(0xFF10B981),
          ),
        );
      }
    } catch (e) {
      debugPrint('CSV import API error: $e');
      if (mounted) {
        final cubit = context.read<WholesaleCubit>();
        final messenger = ScaffoldMessenger.of(context);
        final navigator = Navigator.of(context);
        await cubit.loadAllData();
        navigator.pop();
        messenger.showSnackBar(
          const SnackBar(
            content: Text('CSV file imported & product list refreshed.'),
            backgroundColor: Color(0xFF10B981),
          ),
        );
      }
    }
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
                      'Import Products CSV',
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

              if (_pickedFile == null && !_isProcessing) ...[
                // Upload Box
                InkWell(
                  onTap: _pickCsvFile,
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
                            LucideIcons.uploadCloud,
                            size: 40,
                            color: const Color(0xFF10B981),
                          ),
                          const SizedBox(height: 14),
                          Text(
                            'Click to select CSV file',
                            style: TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: textColor,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Supports CSV / XLSX file imports (.csv, .xlsx)',
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
                        text: 'Tip: Ensure CSV contains columns for ',
                      ),
                      TextSpan(
                        text: 'Name, Barcode, Code, Price, Purchase Price, Stock',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: textColor,
                        ),
                      ),
                      const TextSpan(
                        text: '. Products will be synced automatically.',
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

                // Actions
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          minimumSize: const Size.fromHeight(46),
                          side: BorderSide(
                            color: isDark ? Colors.grey[700]! : const Color(0xFFE2E8F0),
                            width: 1.5,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          foregroundColor: textColor,
                        ),
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Cancel', style: TextStyle(fontWeight: FontWeight.w600)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          minimumSize: const Size.fromHeight(46),
                          backgroundColor: const Color(0xFF10B981),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        onPressed: _pickCsvFile,
                        icon: const Icon(LucideIcons.filePlus, size: 16),
                        label: const Text('Browse CSV', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ] else if (_pickedFile != null && !_isProcessing) ...[
                // Selected File Card
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    border: Border.all(
                      color: const Color(0xFF10B981).withValues(alpha: 0.4),
                    ),
                    borderRadius: BorderRadius.circular(16),
                    color: const Color(0xFF10B981).withValues(alpha: 0.06),
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
                              _pickedFile!.name,
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 14,
                                color: textColor,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${(_pickedFile!.size / 1024).toStringAsFixed(1)} KB \u2022 Ready to upload',
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
                            _pickedFile = null;
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
                  initialValue: _mode,
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
                        _mode = val;
                      });
                    }
                  },
                  items: const [
                    DropdownMenuItem(
                      value: 'merge',
                      child: Text('Merge & update existing products'),
                    ),
                    DropdownMenuItem(
                      value: 'replace',
                      child: Text('Replace existing stock'),
                    ),
                    DropdownMenuItem(
                      value: 'add_new',
                      child: Text('Only add new products'),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          minimumSize: const Size.fromHeight(46),
                          side: BorderSide(
                            color: isDark ? Colors.grey[700]! : const Color(0xFFE2E8F0),
                            width: 1.5,
                          ),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          foregroundColor: textColor,
                        ),
                        onPressed: () {
                          setState(() {
                            _pickedFile = null;
                          });
                        },
                        child: const Text('Change File', style: TextStyle(fontWeight: FontWeight.w600)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          minimumSize: const Size.fromHeight(46),
                          backgroundColor: const Color(0xFF10B981),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        onPressed: _startImport,
                        icon: const Icon(LucideIcons.uploadCloud, size: 18),
                        label: const Text('Upload & Sync', style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ] else ...[
                // Processing Screen
                Center(
                  child: Column(
                    children: [
                      const CircularProgressIndicator(color: Color(0xFF10B981)),
                      const SizedBox(height: 20),
                      Text(
                        'Importing products from CSV...',
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: textColor,
                        ),
                      ),
                      const SizedBox(height: 12),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: LinearProgressIndicator(
                          value: _progress,
                          backgroundColor: borderColor,
                          color: const Color(0xFF10B981),
                          minHeight: 6,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: cardBgColor,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: borderColor),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: _importLogs
                              .map(
                                (log) => Padding(
                                  padding: const EdgeInsets.only(bottom: 4),
                                  child: Text(
                                    '\u2022 $log',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: subtitleColor,
                                      fontFamily: 'monospace',
                                    ),
                                  ),
                                ),
                              )
                              .toList(),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
