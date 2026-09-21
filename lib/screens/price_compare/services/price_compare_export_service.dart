import 'dart:io';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:path_provider/path_provider.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../models/price_compare_models.dart';

class PriceCompareExportService {
  PriceCompareExportService._();

  /// Export as PDF
  static Future<void> exportPdf(
    BuildContext context,
    List<PriceCompareProductModel> products, {
    PriceCompareProductModel? singleProduct,
  }) async {
    final pdf = pw.Document();
    final dateStr = DateFormat('yyyy-MM-dd HH:mm').format(DateTime.now());

    final items = singleProduct != null ? [singleProduct] : products;

    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(32),
        build: (pw.Context ctx) {
          return [
            pw.Header(
              level: 0,
              child: pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text(
                        'Price Comparison Benchmark Report',
                        style: pw.TextStyle(
                          fontSize: 18,
                          fontWeight: pw.FontWeight.bold,
                        ),
                      ),
                      pw.SizedBox(height: 4),
                      pw.Text(
                        'Generated on $dateStr',
                        style: const pw.TextStyle(fontSize: 10, color: PdfColors.grey700),
                      ),
                    ],
                  ),
                  pw.Text(
                    'Shriah ERP',
                    style: pw.TextStyle(
                      fontSize: 14,
                      fontWeight: pw.FontWeight.bold,
                      color: PdfColors.teal,
                    ),
                  ),
                ],
              ),
            ),
            pw.SizedBox(height: 16),
            ...items.map((prod) {
              final lowest = prod.lowestPurchasePrice;
              final highest = prod.highestPurchasePrice;
              final entries = prod.history;

              return pw.Container(
                margin: const pw.EdgeInsets.only(bottom: 16),
                padding: const pw.EdgeInsets.all(12),
                decoration: pw.BoxDecoration(
                  border: pw.Border.all(color: PdfColors.grey300),
                  borderRadius: const pw.BorderRadius.all(pw.Radius.circular(8)),
                ),
                child: pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.start,
                  children: [
                    pw.Row(
                      mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                      children: [
                        pw.Text(
                          prod.productName,
                          style: pw.TextStyle(fontSize: 13, fontWeight: pw.FontWeight.bold),
                        ),
                        pw.Text(
                          'Sale: SAR ${prod.sellingPrice.toStringAsFixed(2)}',
                          style: pw.TextStyle(fontSize: 12, fontWeight: pw.FontWeight.bold, color: PdfColors.teal),
                        ),
                      ],
                    ),
                    if (prod.barcode != null && prod.barcode!.isNotEmpty)
                      pw.Text('Barcode: ${prod.barcode}', style: const pw.TextStyle(fontSize: 9, color: PdfColors.grey600)),
                    pw.SizedBox(height: 6),
                    pw.Row(
                      children: [
                        if (lowest != null)
                          pw.Text('Lowest: SAR ${lowest.toStringAsFixed(2)}   ', style: const pw.TextStyle(fontSize: 10, color: PdfColors.green700)),
                        if (highest != null)
                          pw.Text('Highest: SAR ${highest.toStringAsFixed(2)}   ', style: const pw.TextStyle(fontSize: 10, color: PdfColors.red700)),
                        if (prod.averagePurchasePrice != null)
                          pw.Text('Avg: SAR ${prod.averagePurchasePrice!.toStringAsFixed(2)}', style: const pw.TextStyle(fontSize: 10)),
                      ],
                    ),
                    if (entries.isNotEmpty) ...[
                      pw.SizedBox(height: 8),
                      pw.Table(
                        border: pw.TableBorder.all(color: PdfColors.grey200),
                        children: [
                          pw.TableRow(
                            decoration: const pw.BoxDecoration(color: PdfColors.grey100),
                            children: [
                              _tableHeader('Vendor / Supplier'),
                              _tableHeader('Purchase Price'),
                              _tableHeader('Date'),
                              _tableHeader('Margin'),
                            ],
                          ),
                          ...entries.map((e) {
                            return pw.TableRow(
                              children: [
                                _tableCell(e.vendorName),
                                _tableCell('SAR ${e.purchasePrice.toStringAsFixed(2)}'),
                                _tableCell(e.purchaseDate ?? '-'),
                                _tableCell(
                                  e.marginPercentage != null
                                      ? '${e.marginPercentage!.toStringAsFixed(1)}%'
                                      : '-',
                                ),
                              ],
                            );
                          }),
                        ],
                      ),
                    ],
                  ],
                ),
              );
            }),
          ];
        },
      ),
    );

    await Printing.sharePdf(
      bytes: await pdf.save(),
      filename: 'price_compare_${DateTime.now().millisecondsSinceEpoch}.pdf',
    );
  }

  /// Print Report directly
  static Future<void> printReport(
    BuildContext context,
    List<PriceCompareProductModel> products, {
    PriceCompareProductModel? singleProduct,
  }) async {
    final pdf = pw.Document();
    final dateStr = DateFormat('yyyy-MM-dd HH:mm').format(DateTime.now());
    final items = singleProduct != null ? [singleProduct] : products;

    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(32),
        build: (pw.Context ctx) {
          return [
            pw.Header(
              level: 0,
              child: pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Text(
                    'Price Comparison Report',
                    style: pw.TextStyle(fontSize: 18, fontWeight: pw.FontWeight.bold),
                  ),
                  pw.Text('Date: $dateStr', style: const pw.TextStyle(fontSize: 10)),
                ],
              ),
            ),
            pw.SizedBox(height: 12),
            pw.Table(
              border: pw.TableBorder.all(color: PdfColors.grey300),
              children: [
                pw.TableRow(
                  decoration: const pw.BoxDecoration(color: PdfColors.grey100),
                  children: [
                    _tableHeader('Product'),
                    _tableHeader('Sale Price'),
                    _tableHeader('Lowest Buy'),
                    _tableHeader('Highest Buy'),
                    _tableHeader('Best Supplier'),
                  ],
                ),
                ...items.map((prod) {
                  final lowest = prod.lowestPurchasePrice;
                  final highest = prod.highestPurchasePrice;
                  final bestVendor = prod.history.isNotEmpty
                      ? prod.history.reduce((a, b) => a.purchasePrice < b.purchasePrice ? a : b).vendorName
                      : (prod.analysis?.vendorBreakdown.isNotEmpty == true ? prod.analysis!.vendorBreakdown.first.vendorName : '-');

                  return pw.TableRow(
                    children: [
                      _tableCell(prod.productName),
                      _tableCell('SAR ${prod.sellingPrice.toStringAsFixed(2)}'),
                      _tableCell(lowest != null ? 'SAR ${lowest.toStringAsFixed(2)}' : '-'),
                      _tableCell(highest != null ? 'SAR ${highest.toStringAsFixed(2)}' : '-'),
                      _tableCell(bestVendor),
                    ],
                  );
                }),
              ],
            ),
          ];
        },
      ),
    );

    await Printing.layoutPdf(onLayout: (format) async => pdf.save());
  }

  /// Export as Excel / CSV
  static Future<void> exportExcel(
    BuildContext context,
    List<PriceCompareProductModel> products, {
    PriceCompareProductModel? singleProduct,
  }) async {
    final items = singleProduct != null ? [singleProduct] : products;
    final sb = StringBuffer();

    // CSV Header
    sb.writeln('Product Name,Barcode,Category,Sale Price,Lowest Purchase,Highest Purchase,Supplier,Supplier Price,Purchase Date,Margin %');

    for (final prod in items) {
      final lowest = prod.lowestPurchasePrice?.toStringAsFixed(2) ?? '';
      final highest = prod.highestPurchasePrice?.toStringAsFixed(2) ?? '';

      if (prod.history.isEmpty) {
        sb.writeln('"${prod.productName}","${prod.barcode ?? ''}","${prod.category ?? ''}",${prod.sellingPrice},$lowest,$highest,"","","",""');
      } else {
        for (final entry in prod.history) {
          final marginPct = entry.marginPercentage?.toStringAsFixed(1) ?? '';
          sb.writeln('"${prod.productName}","${prod.barcode ?? ''}","${prod.category ?? ''}",${prod.sellingPrice},$lowest,$highest,"${entry.vendorName}",${entry.purchasePrice},"${entry.purchaseDate ?? ''}",$marginPct');
        }
      }
    }

    final tempDir = await getTemporaryDirectory();
    final file = File('${tempDir.path}/price_comparison_${DateTime.now().millisecondsSinceEpoch}.csv');
    await file.writeAsString(sb.toString());

    await Share.shareXFiles(
      [XFile(file.path)],
      text: 'Price Comparison Excel/CSV Export',
      subject: 'Price Comparison Export',
    );
  }

  /// Share formatted text on WhatsApp
  static Future<void> shareOnWhatsApp(
    BuildContext context,
    List<PriceCompareProductModel> products, {
    PriceCompareProductModel? singleProduct,
  }) async {
    final items = singleProduct != null ? [singleProduct] : products;
    final sb = StringBuffer();

    sb.writeln('📊 *Price Comparison Summary*');
    sb.writeln('Generated: ${DateFormat('yyyy-MM-dd').format(DateTime.now())}');
    sb.writeln('-----------------------------');

    for (final prod in items) {
      sb.writeln('🛍️ *${prod.productName}*');
      sb.writeln('• Sale Price: SAR ${prod.sellingPrice.toStringAsFixed(2)}');
      if (prod.lowestPurchasePrice != null) {
        sb.writeln('• Lowest Buy: SAR ${prod.lowestPurchasePrice!.toStringAsFixed(2)}');
      }
      if (prod.highestPurchasePrice != null) {
        sb.writeln('• Highest Buy: SAR ${prod.highestPurchasePrice!.toStringAsFixed(2)}');
      }
      if (prod.history.isNotEmpty) {
        sb.writeln('  _Suppliers:_');
        for (final entry in prod.history) {
          sb.writeln('  - ${entry.vendorName}: SAR ${entry.purchasePrice.toStringAsFixed(2)} (${entry.purchaseDate ?? ''})');
        }
      }
      sb.writeln('');
    }

    final message = sb.toString();
    final encoded = Uri.encodeComponent(message);
    final whatsappUri = Uri.parse('whatsapp://send?text=$encoded');

    try {
      if (await canLaunchUrl(whatsappUri)) {
        await launchUrl(whatsappUri);
      } else {
        await Share.share(message, subject: 'Price Comparison Report');
      }
    } catch (_) {
      await Share.share(message, subject: 'Price Comparison Report');
    }
  }

  static pw.Widget _tableHeader(String text) {
    return pw.Padding(
      padding: const pw.EdgeInsets.all(6),
      child: pw.Text(
        text,
        style: pw.TextStyle(fontSize: 9, fontWeight: pw.FontWeight.bold),
      ),
    );
  }

  static pw.Widget _tableCell(String text) {
    return pw.Padding(
      padding: const pw.EdgeInsets.all(6),
      child: pw.Text(text, style: const pw.TextStyle(fontSize: 8.5)),
    );
  }
}
