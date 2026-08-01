import 'dart:typed_data';
import 'package:intl/intl.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../models/product_model.dart';
import '../models/wholesale_models.dart';

class TransactionPrintData {
  final String headerTitle;
  final String invoiceNumber;
  final String partyName;
  final String partyMobile;
  final DateTime createdAt;
  final double totalAmount;
  final double subtotal;
  final double discount;
  final double paidAmount;
  final double dueAmount;
  final String paymentMethod;
  final String status;
  final String? notes;
  final List<WholesaleSaleItemModel> items;

  TransactionPrintData({
    required this.headerTitle,
    required this.invoiceNumber,
    required this.partyName,
    required this.partyMobile,
    required this.createdAt,
    required this.totalAmount,
    required this.subtotal,
    required this.discount,
    required this.paidAmount,
    required this.dueAmount,
    required this.paymentMethod,
    required this.status,
    this.notes,
    required this.items,
  });

  factory TransactionPrintData.fromEntry(dynamic entry, {String? overridePartyName}) {
    if (entry is WholesaleSaleModel) {
      final sub = entry.items.fold(0.0, (sum, i) => sum + (i.qty * i.price));
      final paid = (entry.total - entry.dueAmount).clamp(0.0, double.infinity);
      final pName = (overridePartyName != null && overridePartyName.isNotEmpty)
          ? overridePartyName
          : (entry.customerName.isEmpty ? 'Walk-in Customer' : entry.customerName);
      return TransactionPrintData(
        headerTitle: 'SALE RECEIPT',
        invoiceNumber: '${entry.invoiceNumber}',
        partyName: pName,
        partyMobile: entry.customerMobile,
        createdAt: entry.createdAt,
        totalAmount: entry.total,
        subtotal: sub > 0 ? sub : entry.total,
        discount: entry.discount,
        paidAmount: paid,
        dueAmount: entry.dueAmount,
        paymentMethod: entry.paymentMethod,
        status: entry.status,
        items: entry.items,
      );
    } else if (entry is WholesalePurchaseModel) {
      final sub = entry.items.fold(0.0, (sum, i) => sum + (i.qty * i.price));
      return TransactionPrintData(
        headerTitle: 'PURCHASE INVOICE',
        invoiceNumber: entry.invoiceNumber,
        partyName: (overridePartyName != null && overridePartyName.isNotEmpty) ? overridePartyName : entry.supplierName,
        partyMobile: '',
        createdAt: entry.createdAt,
        totalAmount: entry.total,
        subtotal: sub > 0 ? sub : entry.total,
        discount: 0.0,
        paidAmount: entry.total,
        dueAmount: 0.0,
        paymentMethod: 'Cash/Bank',
        status: 'Completed',
        notes: entry.notes,
        items: entry.items,
      );
    } else if (entry is WholesalePaymentModel) {
      final isPaymentIn = entry.kind == 'payment_in';
      return TransactionPrintData(
        headerTitle: isPaymentIn ? 'PAYMENT RECEIVED' : 'PAYMENT OUT',
        invoiceNumber: entry.id.length > 8 ? entry.id.substring(0, 8).toUpperCase() : entry.id.toUpperCase(),
        partyName: (overridePartyName != null && overridePartyName.isNotEmpty) ? overridePartyName : 'Customer',
        partyMobile: '',
        createdAt: entry.createdAt,
        totalAmount: entry.amount,
        subtotal: entry.amount,
        discount: 0.0,
        paidAmount: entry.amount,
        dueAmount: 0.0,
        paymentMethod: 'Cash',
        status: 'Completed',
        notes: entry.notes,
        items: [],
      );
    } else if (entry is WholesaleOrderModel) {
      final sub = entry.items.fold(0.0, (sum, i) => sum + (i.qty * i.price));
      return TransactionPrintData(
        headerTitle: 'ORDER INVOICE',
        invoiceNumber: '${entry.orderNumber}',
        partyName: (overridePartyName != null && overridePartyName.isNotEmpty) ? overridePartyName : entry.customerName,
        partyMobile: entry.customerMobile,
        createdAt: entry.createdAt,
        totalAmount: entry.total,
        subtotal: sub > 0 ? sub : entry.total,
        discount: 0.0,
        paidAmount: 0.0,
        dueAmount: entry.total,
        paymentMethod: 'Pending',
        status: entry.status,
        notes: entry.notes,
        items: entry.items,
      );
    }

    return TransactionPrintData(
      headerTitle: 'TRANSACTION',
      invoiceNumber: '0000',
      partyName: (overridePartyName != null && overridePartyName.isNotEmpty) ? overridePartyName : 'Customer',
      partyMobile: '',
      createdAt: DateTime.now(),
      totalAmount: 0.0,
      subtotal: 0.0,
      discount: 0.0,
      paidAmount: 0.0,
      dueAmount: 0.0,
      paymentMethod: 'N/A',
      status: 'Completed',
      items: [],
    );
  }
}

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

  // Thermal 80mm Receipt Printing
  static Future<void> print80mmReceipt({
    required dynamic entry,
    String? partyName,
  }) async {
    final pdfBytes = await build80mmReceiptPdf(entry: entry, partyName: partyName);
    await Printing.layoutPdf(
      onLayout: (PdfPageFormat format) async => pdfBytes,
      name: 'Receipt_80mm_${DateTime.now().millisecondsSinceEpoch}',
    );
  }

  static Future<Uint8List> build80mmReceiptPdf({
    required dynamic entry,
    String? partyName,
  }) async {
    final data = TransactionPrintData.fromEntry(entry, overridePartyName: partyName);
    final pdf = pw.Document();
    final dateFormat = DateFormat('dd/MM/yyyy hh:mm a');
    final dateStr = dateFormat.format(data.createdAt);

    pdf.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.roll80.copyWith(
          marginTop: 10,
          marginBottom: 10,
          marginLeft: 10,
          marginRight: 10,
        ),
        build: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              // Store Header
              pw.Center(
                child: pw.Text(
                  'SHRIAH ERP',
                  style: pw.TextStyle(
                    fontSize: 14,
                    fontWeight: pw.FontWeight.bold,
                  ),
                ),
              ),
              pw.SizedBox(height: 2),
              pw.Center(
                child: pw.Text(
                  '80mm POS Thermal Receipt',
                  style: const pw.TextStyle(fontSize: 8, color: PdfColors.grey700),
                ),
              ),
              pw.SizedBox(height: 4),
              pw.Center(
                child: pw.Text(
                  '${data.headerTitle} ${data.invoiceNumber}',
                  style: pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold),
                ),
              ),
              pw.SizedBox(height: 2),
              pw.Center(
                child: pw.Text(
                  dateStr,
                  style: const pw.TextStyle(fontSize: 8, color: PdfColors.grey700),
                ),
              ),
              pw.SizedBox(height: 6),
              pw.Divider(thickness: 0.5, color: PdfColors.grey500),
              pw.SizedBox(height: 4),

              // Party Info
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Text('Party:', style: const pw.TextStyle(fontSize: 8, color: PdfColors.grey700)),
                  pw.Expanded(
                    child: pw.Text(
                      data.partyName,
                      textAlign: pw.TextAlign.right,
                      style: pw.TextStyle(fontSize: 9, fontWeight: pw.FontWeight.bold),
                    ),
                  ),
                ],
              ),
              if (data.partyMobile.isNotEmpty) ...[
                pw.SizedBox(height: 2),
                pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [
                    pw.Text('Mobile:', style: const pw.TextStyle(fontSize: 8, color: PdfColors.grey700)),
                    pw.Text(
                      data.partyMobile,
                      style: const pw.TextStyle(fontSize: 8),
                    ),
                  ],
                ),
              ],
              pw.SizedBox(height: 4),
              pw.Divider(thickness: 0.5, color: PdfColors.grey500),
              pw.SizedBox(height: 4),

              // Items List
              if (data.items.isNotEmpty) ...[
                pw.Row(
                  children: [
                    pw.Expanded(flex: 3, child: pw.Text('Item', style: pw.TextStyle(fontSize: 8, fontWeight: pw.FontWeight.bold))),
                    pw.Expanded(flex: 1, child: pw.Text('Qty', textAlign: pw.TextAlign.center, style: pw.TextStyle(fontSize: 8, fontWeight: pw.FontWeight.bold))),
                    pw.Expanded(flex: 2, child: pw.Text('Price', textAlign: pw.TextAlign.right, style: pw.TextStyle(fontSize: 8, fontWeight: pw.FontWeight.bold))),
                    pw.Expanded(flex: 2, child: pw.Text('Total', textAlign: pw.TextAlign.right, style: pw.TextStyle(fontSize: 8, fontWeight: pw.FontWeight.bold))),
                  ],
                ),
                pw.SizedBox(height: 4),
                pw.Divider(thickness: 0.3, color: PdfColors.grey400),
                pw.SizedBox(height: 4),
                ...data.items.map((item) {
                  return pw.Padding(
                    padding: const pw.EdgeInsets.only(bottom: 4),
                    child: pw.Row(
                      children: [
                        pw.Expanded(
                          flex: 3,
                          child: pw.Text(
                            item.name,
                            style: const pw.TextStyle(fontSize: 8),
                            maxLines: 2,
                          ),
                        ),
                        pw.Expanded(
                          flex: 1,
                          child: pw.Text(
                            '${item.qty.toInt()}',
                            textAlign: pw.TextAlign.center,
                            style: const pw.TextStyle(fontSize: 8),
                          ),
                        ),
                        pw.Expanded(
                          flex: 2,
                          child: pw.Text(
                            item.price.toStringAsFixed(2),
                            textAlign: pw.TextAlign.right,
                            style: const pw.TextStyle(fontSize: 8),
                          ),
                        ),
                        pw.Expanded(
                          flex: 2,
                          child: pw.Text(
                            (item.qty * item.price).toStringAsFixed(2),
                            textAlign: pw.TextAlign.right,
                            style: pw.TextStyle(fontSize: 8, fontWeight: pw.FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  );
                }),
                pw.SizedBox(height: 4),
                pw.Divider(thickness: 0.5, color: PdfColors.grey500),
                pw.SizedBox(height: 4),
              ],

              // Financial Summary
              _buildRollSummaryRow('Subtotal:', 'SAR ${data.subtotal.toStringAsFixed(2)}'),
              if (data.discount > 0)
                _buildRollSummaryRow('Discount:', '- SAR ${data.discount.toStringAsFixed(2)}'),
              _buildRollSummaryRow(
                'TOTAL:',
                'SAR ${data.totalAmount.toStringAsFixed(2)}',
                isBold: true,
                fontSize: 10,
              ),
              _buildRollSummaryRow('Paid:', 'SAR ${data.paidAmount.toStringAsFixed(2)}'),
              if (data.dueAmount > 0)
                _buildRollSummaryRow('Due:', 'SAR ${data.dueAmount.toStringAsFixed(2)}', isBold: true),
              pw.SizedBox(height: 2),
              _buildRollSummaryRow('Payment Method:', data.paymentMethod.toUpperCase()),

              if (data.notes != null && data.notes!.isNotEmpty) ...[
                pw.SizedBox(height: 4),
                pw.Text('Notes: ${data.notes}', style: const pw.TextStyle(fontSize: 7, color: PdfColors.grey700)),
              ],

              pw.SizedBox(height: 8),
              pw.Divider(thickness: 0.5, color: PdfColors.grey500),
              pw.SizedBox(height: 6),
              pw.Center(
                child: pw.Text(
                  'Thank you for your business!',
                  style: pw.TextStyle(fontSize: 8, fontWeight: pw.FontWeight.bold),
                ),
              ),
              pw.SizedBox(height: 2),
              pw.Center(
                child: pw.Text(
                  'Powered by Shriah ERP',
                  style: const pw.TextStyle(fontSize: 7, color: PdfColors.grey600),
                ),
              ),
              pw.SizedBox(height: 10),
            ],
          );
        },
      ),
    );

    return pdf.save();
  }

  static pw.Widget _buildRollSummaryRow(
    String label,
    String value, {
    bool isBold = false,
    double fontSize = 8,
  }) {
    return pw.Padding(
      padding: const pw.EdgeInsets.symmetric(vertical: 1),
      child: pw.Row(
        mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
        children: [
          pw.Text(
            label,
            style: pw.TextStyle(
              fontSize: fontSize,
              fontWeight: isBold ? pw.FontWeight.bold : pw.FontWeight.normal,
            ),
          ),
          pw.Text(
            value,
            style: pw.TextStyle(
              fontSize: fontSize,
              fontWeight: isBold ? pw.FontWeight.bold : pw.FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }

  // Invoice V2 A4 Printing
  static Future<void> printInvoiceV2({
    required dynamic entry,
    String? partyName,
  }) async {
    final pdfBytes = await buildInvoiceV2Pdf(entry: entry, partyName: partyName);
    await Printing.layoutPdf(
      onLayout: (PdfPageFormat format) async => pdfBytes,
      name: 'Invoice_V2_${DateTime.now().millisecondsSinceEpoch}',
    );
  }

  static Future<Uint8List> buildInvoiceV2Pdf({
    required dynamic entry,
    String? partyName,
  }) async {
    final data = TransactionPrintData.fromEntry(entry, overridePartyName: partyName);
    final pdf = pw.Document();
    final dateFormat = DateFormat('dd/MM/yyyy HH:mm');
    final dateStr = dateFormat.format(data.createdAt);

    final primaryColor = PdfColor.fromHex('#0F9D58'); // Teal brand color
    final headerDarkBg = PdfColor.fromHex('#1E293B');
    final altRowBgColor = PdfColor.fromHex('#F8FAFC');
    final borderColor = PdfColor.fromHex('#E2E8F0');
    final lightCardBg = PdfColor.fromHex('#F1F5F9');

    pdf.addPage(
      pw.MultiPage(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(32),
        header: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              // Top Header Row
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                crossAxisAlignment: pw.CrossAxisAlignment.start,
                children: [
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text(
                        'SHRIAH ERP',
                        style: pw.TextStyle(
                          fontSize: 22,
                          fontWeight: pw.FontWeight.bold,
                          color: primaryColor,
                        ),
                      ),
                      pw.SizedBox(height: 2),
                      pw.Text(
                        'Wholesale & Retail ERP Solution',
                        style: const pw.TextStyle(fontSize: 9, color: PdfColors.grey700),
                      ),
                      pw.Text(
                        'VAT / Tax Registration: 310029384700003',
                        style: const pw.TextStyle(fontSize: 8, color: PdfColors.grey600),
                      ),
                    ],
                  ),
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.end,
                    children: [
                      pw.Container(
                        padding: const pw.EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: pw.BoxDecoration(
                          color: primaryColor,
                          borderRadius: pw.BorderRadius.circular(4),
                        ),
                        child: pw.Text(
                          'INVOICE V2',
                          style: pw.TextStyle(
                            color: PdfColors.white,
                            fontWeight: pw.FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ),
                      pw.SizedBox(height: 6),
                      pw.Text(
                        '${data.headerTitle} ${data.invoiceNumber}',
                        style: pw.TextStyle(
                          fontSize: 12,
                          fontWeight: pw.FontWeight.bold,
                          color: PdfColors.grey900,
                        ),
                      ),
                      pw.SizedBox(height: 2),
                      pw.Text(
                        'Date: $dateStr',
                        style: const pw.TextStyle(fontSize: 9, color: PdfColors.grey700),
                      ),
                    ],
                  ),
                ],
              ),
              pw.SizedBox(height: 12),
              pw.Divider(color: primaryColor, thickness: 2),
              pw.SizedBox(height: 12),
            ],
          );
        },
        footer: (pw.Context context) {
          return pw.Container(
            alignment: pw.Alignment.centerRight,
            margin: const pw.EdgeInsets.only(top: 16),
            child: pw.Row(
              mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
              children: [
                pw.Text(
                  'Shriah ERP Official Invoice V2 • Thank you for your business!',
                  style: const pw.TextStyle(fontSize: 8, color: PdfColors.grey600),
                ),
                pw.Text(
                  'Page ${context.pageNumber} of ${context.pagesCount}',
                  style: const pw.TextStyle(fontSize: 8, color: PdfColors.grey600),
                ),
              ],
            ),
          );
        },
        build: (pw.Context context) {
          return [
            // Customer & Billed To Card
            pw.Container(
              padding: const pw.EdgeInsets.all(12),
              decoration: pw.BoxDecoration(
                color: lightCardBg,
                borderRadius: pw.BorderRadius.circular(8),
                border: pw.Border.all(color: borderColor, width: 0.8),
              ),
              child: pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text(
                        'BILLED TO / CUSTOMER',
                        style: pw.TextStyle(
                          fontSize: 8,
                          fontWeight: pw.FontWeight.bold,
                          color: PdfColors.grey700,
                        ),
                      ),
                      pw.SizedBox(height: 4),
                      pw.Text(
                        data.partyName,
                        style: pw.TextStyle(
                          fontSize: 13,
                          fontWeight: pw.FontWeight.bold,
                          color: PdfColors.grey900,
                        ),
                      ),
                      if (data.partyMobile.isNotEmpty) ...[
                        pw.SizedBox(height: 2),
                        pw.Text(
                          'Mobile: ${data.partyMobile}',
                          style: const pw.TextStyle(fontSize: 9, color: PdfColors.grey800),
                        ),
                      ],
                    ],
                  ),
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.end,
                    children: [
                      pw.Text(
                        'PAYMENT DETAILS',
                        style: pw.TextStyle(
                          fontSize: 8,
                          fontWeight: pw.FontWeight.bold,
                          color: PdfColors.grey700,
                        ),
                      ),
                      pw.SizedBox(height: 4),
                      pw.Text(
                        'Method: ${data.paymentMethod.toUpperCase()}',
                        style: pw.TextStyle(fontSize: 10, fontWeight: pw.FontWeight.bold),
                      ),
                      pw.SizedBox(height: 2),
                      pw.Text(
                        'Status: ${data.status.toUpperCase()}',
                        style: pw.TextStyle(
                          fontSize: 9,
                          color: data.dueAmount > 0 ? PdfColors.red800 : PdfColors.green800,
                          fontWeight: pw.FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            pw.SizedBox(height: 16),

            // Items Table
            if (data.items.isNotEmpty) ...[
              pw.TableHelper.fromTextArray(
                headers: ['#', 'Item Description', 'Qty', 'Unit Price', 'Total Amount'],
                data: List.generate(data.items.length, (index) {
                  final item = data.items[index];
                  return [
                    '${index + 1}',
                    item.name,
                    '${item.qty.toInt()}',
                    '${item.price.toStringAsFixed(2)} SAR',
                    '${(item.qty * item.price).toStringAsFixed(2)} SAR',
                  ];
                }),
                border: pw.TableBorder.all(color: borderColor, width: 0.5),
                headerStyle: pw.TextStyle(
                  color: PdfColors.white,
                  fontWeight: pw.FontWeight.bold,
                  fontSize: 9,
                ),
                headerDecoration: pw.BoxDecoration(color: headerDarkBg),
                cellStyle: const pw.TextStyle(fontSize: 9),
                cellPadding: const pw.EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                rowDecoration: const pw.BoxDecoration(color: PdfColors.white),
                oddRowDecoration: pw.BoxDecoration(color: altRowBgColor),
                columnWidths: {
                  0: const pw.FixedColumnWidth(28),
                  1: const pw.FlexColumnWidth(3.5),
                  2: const pw.FlexColumnWidth(1.2),
                  3: const pw.FlexColumnWidth(1.8),
                  4: const pw.FlexColumnWidth(2.0),
                },
                cellAlignments: {
                  0: pw.Alignment.center,
                  1: pw.Alignment.centerLeft,
                  2: pw.Alignment.center,
                  3: pw.Alignment.centerRight,
                  4: pw.Alignment.centerRight,
                },
              ),
            ] else ...[
              pw.Container(
                width: double.infinity,
                padding: const pw.EdgeInsets.all(16),
                decoration: pw.BoxDecoration(
                  color: altRowBgColor,
                  border: pw.Border.all(color: borderColor),
                  borderRadius: pw.BorderRadius.circular(6),
                ),
                child: pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.start,
                  children: [
                    pw.Text(
                      'Transaction Amount: ${data.totalAmount.toStringAsFixed(2)} SAR',
                      style: pw.TextStyle(fontSize: 12, fontWeight: pw.FontWeight.bold),
                    ),
                    if (data.notes != null) ...[
                      pw.SizedBox(height: 4),
                      pw.Text('Notes: ${data.notes}', style: const pw.TextStyle(fontSize: 9)),
                    ],
                  ],
                ),
              ),
            ],

            pw.SizedBox(height: 16),

            // Lower Section: Notes on left, Totals summary box on right
            pw.Row(
              crossAxisAlignment: pw.CrossAxisAlignment.start,
              mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
              children: [
                // Notes / Terms
                pw.Expanded(
                  flex: 5,
                  child: pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      if (data.notes != null && data.notes!.isNotEmpty) ...[
                        pw.Text('Notes & Remarks:', style: pw.TextStyle(fontSize: 9, fontWeight: pw.FontWeight.bold)),
                        pw.SizedBox(height: 4),
                        pw.Container(
                          width: double.infinity,
                          padding: const pw.EdgeInsets.all(8),
                          decoration: pw.BoxDecoration(
                            color: altRowBgColor,
                            border: pw.Border.all(color: borderColor, width: 0.5),
                            borderRadius: pw.BorderRadius.circular(4),
                          ),
                          child: pw.Text(
                            data.notes!,
                            style: const pw.TextStyle(fontSize: 8, color: PdfColors.grey800),
                          ),
                        ),
                        pw.SizedBox(height: 10),
                      ],
                      pw.Text('Terms & Conditions:', style: pw.TextStyle(fontSize: 8, fontWeight: pw.FontWeight.bold)),
                      pw.Text('1. All claims must be made within 7 days of invoice date.', style: const pw.TextStyle(fontSize: 7, color: PdfColors.grey700)),
                      pw.Text('2. Electronic computer-generated invoice, signature optional.', style: const pw.TextStyle(fontSize: 7, color: PdfColors.grey700)),
                    ],
                  ),
                ),
                pw.SizedBox(width: 24),

                // Summary Card (Right aligned)
                pw.Expanded(
                  flex: 4,
                  child: pw.Container(
                    padding: const pw.EdgeInsets.all(10),
                    decoration: pw.BoxDecoration(
                      border: pw.Border.all(color: borderColor, width: 0.8),
                      borderRadius: pw.BorderRadius.circular(6),
                      color: PdfColors.white,
                    ),
                    child: pw.Column(
                      children: [
                        _buildA4SummaryRow('Subtotal:', '${data.subtotal.toStringAsFixed(2)} SAR'),
                        if (data.discount > 0)
                          _buildA4SummaryRow('Discount:', '- ${data.discount.toStringAsFixed(2)} SAR'),
                        pw.Divider(color: borderColor, thickness: 0.5),
                        pw.Container(
                          padding: const pw.EdgeInsets.symmetric(vertical: 4, horizontal: 6),
                          decoration: pw.BoxDecoration(
                            color: primaryColor,
                            borderRadius: pw.BorderRadius.circular(4),
                          ),
                          child: pw.Row(
                            mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                            children: [
                              pw.Text('GRAND TOTAL:', style: pw.TextStyle(color: PdfColors.white, fontWeight: pw.FontWeight.bold, fontSize: 10)),
                              pw.Text('${data.totalAmount.toStringAsFixed(2)} SAR', style: pw.TextStyle(color: PdfColors.white, fontWeight: pw.FontWeight.bold, fontSize: 10)),
                            ],
                          ),
                        ),
                        pw.SizedBox(height: 4),
                        _buildA4SummaryRow('Paid Amount:', '${data.paidAmount.toStringAsFixed(2)} SAR', valueColor: PdfColors.green800),
                        if (data.dueAmount > 0)
                          _buildA4SummaryRow('Balance Due:', '${data.dueAmount.toStringAsFixed(2)} SAR', isBold: true, valueColor: PdfColors.red800),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            pw.SizedBox(height: 30),

            // Signature Block
            pw.Row(
              mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
              children: [
                pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.center,
                  children: [
                    pw.Container(width: 120, height: 1, color: PdfColors.grey400),
                    pw.SizedBox(height: 4),
                    pw.Text('Customer Signature', style: const pw.TextStyle(fontSize: 8, color: PdfColors.grey700)),
                  ],
                ),
                pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.center,
                  children: [
                    pw.Container(width: 120, height: 1, color: PdfColors.grey400),
                    pw.SizedBox(height: 4),
                    pw.Text('Authorized Signature', style: const pw.TextStyle(fontSize: 8, color: PdfColors.grey700)),
                  ],
                ),
              ],
            ),
          ];
        },
      ),
    );

    return pdf.save();
  }

  static pw.Widget _buildA4SummaryRow(
    String label,
    String value, {
    bool isBold = false,
    PdfColor? valueColor,
  }) {
    return pw.Padding(
      padding: const pw.EdgeInsets.symmetric(vertical: 2),
      child: pw.Row(
        mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
        children: [
          pw.Text(
            label,
            style: pw.TextStyle(
              fontSize: 9,
              fontWeight: isBold ? pw.FontWeight.bold : pw.FontWeight.normal,
              color: PdfColors.grey800,
            ),
          ),
          pw.Text(
            value,
            style: pw.TextStyle(
              fontSize: 9,
              fontWeight: isBold ? pw.FontWeight.bold : pw.FontWeight.normal,
              color: valueColor ?? PdfColors.grey900,
            ),
          ),
        ],
      ),
    );
  }
}
