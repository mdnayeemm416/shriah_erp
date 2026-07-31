import 'dart:typed_data';
import 'package:intl/intl.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../models/product_model.dart';

class PdfPrintService {
  static Future<void> printProductList({
    required List<ProductModel> products,
    String title = 'Product Inventory & Price List',
  }) async {
    final pdfBytes = await buildProductListPdf(products: products, title: title);
    await Printing.layoutPdf(
      onLayout: (PdfPageFormat format) async => pdfBytes,
      name: 'Product_List_${DateTime.now().millisecondsSinceEpoch}',
    );
  }

  static Future<Uint8List> buildProductListPdf({
    required List<ProductModel> products,
    String title = 'Product Inventory & Price List',
  }) async {
    final pdf = pw.Document();
    final dateFormat = DateFormat('dd/MM/yyyy HH:mm');
    final formattedDate = dateFormat.format(DateTime.now());

    final primaryColor = PdfColor.fromHex('#0F9D58');
    final headerBgColor = PdfColor.fromHex('#0F9D58');
    final altRowBgColor = PdfColor.fromHex('#F8FAFC');
    final borderColor = PdfColor.fromHex('#E2E8F0');

    final tableHeaders = [
      '#',
      'Product Name',
      'SKU / Code',
      'Barcode',
      'Stock',
      'Purchase Price',
      'Sale Price',
    ];

    final tableData = <List<String>>[];
    for (int i = 0; i < products.length; i++) {
      final p = products[i];
      tableData.add([
        '${i + 1}',
        p.name,
        p.itemCode ?? 'N/A',
        p.barcode ?? 'N/A',
        '${p.stock.toInt()}',
        '${p.purchasePrice.toStringAsFixed(2)} SAR',
        '${p.price.toStringAsFixed(2)} SAR',
      ]);
    }

    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(32),
        header: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text(
                        'Shriah ERP',
                        style: pw.TextStyle(
                          fontSize: 20,
                          fontWeight: pw.FontWeight.bold,
                          color: primaryColor,
                        ),
                      ),
                      pw.SizedBox(height: 2),
                      pw.Text(
                        title,
                        style: pw.TextStyle(
                          fontSize: 14,
                          fontWeight: pw.FontWeight.bold,
                          color: PdfColors.grey800,
                        ),
                      ),
                    ],
                  ),
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.end,
                    children: [
                      pw.Text(
                        'Date: $formattedDate',
                        style: const pw.TextStyle(fontSize: 10, color: PdfColors.grey700),
                      ),
                      pw.SizedBox(height: 2),
                      pw.Text(
                        'Total Products: ${products.length}',
                        style: pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold, color: PdfColors.grey800),
                      ),
                    ],
                  ),
                ],
              ),
              pw.SizedBox(height: 8),
              pw.Divider(color: primaryColor, thickness: 1.5),
              pw.SizedBox(height: 12),
            ],
          );
        },
        footer: (pw.Context context) {
          return pw.Container(
            alignment: pw.Alignment.centerRight,
            margin: const pw.EdgeInsets.only(top: 10),
            child: pw.Row(
              mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
              children: [
                pw.Text(
                  'Shriah ERP - Official Product Details Report',
                  style: const pw.TextStyle(fontSize: 9, color: PdfColors.grey600),
                ),
                pw.Text(
                  'Page ${context.pageNumber} of ${context.pagesCount}',
                  style: const pw.TextStyle(fontSize: 9, color: PdfColors.grey600),
                ),
              ],
            ),
          );
        },
        build: (pw.Context context) {
          return [
            pw.TableHelper.fromTextArray(
              headers: tableHeaders,
              data: tableData,
              border: pw.TableBorder.all(color: borderColor, width: 0.5),
              headerStyle: pw.TextStyle(
                color: PdfColors.white,
                fontWeight: pw.FontWeight.bold,
                fontSize: 10,
              ),
              headerDecoration: pw.BoxDecoration(color: headerBgColor),
              cellStyle: const pw.TextStyle(fontSize: 9),
              cellPadding: const pw.EdgeInsets.symmetric(horizontal: 6, vertical: 6),
              rowDecoration: const pw.BoxDecoration(color: PdfColors.white),
              oddRowDecoration: pw.BoxDecoration(color: altRowBgColor),
              columnWidths: {
                0: const pw.FixedColumnWidth(24),
                1: const pw.FlexColumnWidth(3),
                2: const pw.FlexColumnWidth(1.5),
                3: const pw.FlexColumnWidth(1.8),
                4: const pw.FlexColumnWidth(1.2),
                5: const pw.FlexColumnWidth(1.8),
                6: const pw.FlexColumnWidth(1.8),
              },
              cellAlignments: {
                0: pw.Alignment.center,
                1: pw.Alignment.centerLeft,
                2: pw.Alignment.centerLeft,
                3: pw.Alignment.centerLeft,
                4: pw.Alignment.centerRight,
                5: pw.Alignment.centerRight,
                6: pw.Alignment.centerRight,
              },
            ),
          ];
        },
      ),
    );

    return pdf.save();
  }
}
