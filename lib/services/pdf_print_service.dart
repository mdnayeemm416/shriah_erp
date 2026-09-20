import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:intl/intl.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../models/product_model.dart';
import '../models/wholesale_models.dart';

class ZatcaQrHelper {
  static String generateQrCode({
    required String sellerName,
    required String vatNumber,
    required DateTime timestamp,
    required double totalAmount,
    required double vatAmount,
  }) {
    final bytes = BytesBuilder();

    void addTlv(int tag, String value) {
      final valBytes = utf8.encode(value);
      bytes.addByte(tag);
      bytes.addByte(valBytes.length);
      bytes.add(valBytes);
    }

    addTlv(1, sellerName);
    addTlv(2, vatNumber);
    addTlv(3, timestamp.toUtc().toIso8601String());
    addTlv(4, totalAmount.toStringAsFixed(2));
    addTlv(5, vatAmount.toStringAsFixed(2));

    return base64Encode(bytes.toBytes());
  }
}

class NumberToWordsHelper {
  static const _units = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];

  static const _tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  static String _convertLessThanThousand(int n) {
    if (n == 0) return '';
    if (n < 20) return _units[n];
    if (n < 100) {
      return '${_tens[n ~/ 10]}${n % 10 != 0 ? ' ${_units[n % 10]}' : ''}';
    }
    return '${_units[n ~/ 100]} Hundred${n % 100 != 0 ? ' ${_convertLessThanThousand(n % 100)}' : ''}';
  }

  static String convertToSaudiRiyals(double amount) {
    if (amount <= 0) return 'Zero Saudi Riyals Only';

    final whole = amount.floor();
    final fraction = ((amount - whole) * 100).round();

    String result = '';
    if (whole == 0) {
      result = 'Zero';
    } else {
      int temp = whole;
      int chunkIndex = 0;
      final chunks = ['', 'Thousand', 'Million', 'Billion'];
      final parts = <String>[];

      while (temp > 0 && chunkIndex < chunks.length) {
        final remainder = temp % 1000;
        if (remainder != 0) {
          final chunkText = _convertLessThanThousand(remainder);
          final label = chunks[chunkIndex];
          parts.insert(0, label.isEmpty ? chunkText : '$chunkText $label');
        }
        temp ~/= 1000;
        chunkIndex++;
      }
      result = parts.join(' ');
    }

    String text = '$result Saudi Riyals';
    if (fraction > 0) {
      text += ' and ${_convertLessThanThousand(fraction)} Halalas';
    }
    return '$text Only';
  }
}

class TransactionPrintData {
  final String headerTitle;
  final String invoiceNumber;
  final String partyName;
  final String partyMobile;
  final String? partyVatNumber;
  final String? saleNumber;
  final DateTime createdAt;
  final double totalAmount;
  final double subtotal;
  final double vatAmount;
  final double discount;
  final double paidAmount;
  final double dueAmount;
  final double oldBalance;
  final double newBalance;
  final String paymentMethod;
  final String status;
  final String? notes;
  final List<WholesaleSaleItemModel> items;

  // Store profile info
  final String storeName;
  final String storeNameArabic;
  final String storeAddress1;
  final String storeAddress2;
  final String storeMobile;
  final String storeVatNumber;

  TransactionPrintData({
    required this.headerTitle,
    required this.invoiceNumber,
    required this.partyName,
    required this.partyMobile,
    this.partyVatNumber,
    this.saleNumber,
    required this.createdAt,
    required this.totalAmount,
    required this.subtotal,
    required this.vatAmount,
    required this.discount,
    required this.paidAmount,
    required this.dueAmount,
    this.oldBalance = 0.0,
    this.newBalance = 0.0,
    required this.paymentMethod,
    required this.status,
    this.notes,
    required this.items,
    this.storeName = 'Azzouz WholeSale',
    this.storeNameArabic = 'Azzouz WholeSale',
    this.storeAddress1 = 'Walyal Ahd, Makkah',
    this.storeAddress2 = 'Walyal Ahd, Makkah',
    this.storeMobile = '0553687388',
    this.storeVatNumber = '311339561300003',
  });

  factory TransactionPrintData.fromEntry(
    dynamic entry, {
    String? overridePartyName,
    String? partyVatNumber,
    String? saleNumber,
    double? oldBalance,
    double? newBalance,
    String? storeName,
    String? storeNameArabic,
    String? storeAddress1,
    String? storeAddress2,
    String? storeMobile,
    String? storeVatNumber,
  }) {
    final sName = storeName ?? 'Azzouz WholeSale';
    final sNameAr = storeNameArabic ?? 'Azzouz WholeSale';
    final sAddr1 = storeAddress1 ?? 'Walyal Ahd, Makkah';
    final sAddr2 = storeAddress2 ?? 'Walyal Ahd, Makkah';
    final sMobile = storeMobile ?? '0553687388';
    final sVat = storeVatNumber ?? '311339561300003';

    if (entry is WholesaleSaleModel) {
      final total = entry.total;
      // In KSA 80mm Simplified Tax Receipts, prices are VAT-inclusive:
      // Subtotal = total / 1.15, VAT = total - subtotal
      final sub = total > 0 ? (total / 1.15) : 0.0;
      final vat = total - sub;
      final paid = (entry.total - entry.dueAmount).clamp(0.0, double.infinity);
      final pName = (overridePartyName != null && overridePartyName.isNotEmpty)
          ? overridePartyName
          : (entry.customerName.isEmpty
                ? 'Walk-in Customer'
                : entry.customerName);
      final oldBal = oldBalance ?? 0.0;
      final newBal = newBalance ?? (oldBal + entry.dueAmount);

      return TransactionPrintData(
        headerTitle: 'SALE RECEIPT',
        invoiceNumber: '${entry.invoiceNumber}',
        partyName: pName,
        partyMobile: entry.customerMobile,
        partyVatNumber: partyVatNumber,
        saleNumber: saleNumber ?? '${entry.invoiceNumber}',
        createdAt: entry.createdAt,
        totalAmount: total,
        subtotal: sub,
        vatAmount: vat,
        discount: entry.discount,
        paidAmount: paid,
        dueAmount: entry.dueAmount,
        oldBalance: oldBal,
        newBalance: newBal,
        paymentMethod: entry.paymentMethod,
        status: entry.status,
        items: entry.items,
        storeName: sName,
        storeNameArabic: sNameAr,
        storeAddress1: sAddr1,
        storeAddress2: sAddr2,
        storeMobile: sMobile,
        storeVatNumber: sVat,
      );
    } else if (entry is WholesalePurchaseModel) {
      final sub = entry.items.fold(0.0, (sum, i) => sum + (i.qty * i.price));
      final vat = entry.total > sub ? (entry.total - sub) : 0.0;
      return TransactionPrintData(
        headerTitle: 'PURCHASE INVOICE',
        invoiceNumber: entry.invoiceNumber,
        partyName: (overridePartyName != null && overridePartyName.isNotEmpty)
            ? overridePartyName
            : entry.supplierName,
        partyMobile: '',
        partyVatNumber: partyVatNumber,
        saleNumber: saleNumber ?? entry.invoiceNumber,
        createdAt: entry.createdAt,
        totalAmount: entry.total,
        subtotal: sub > 0 ? sub : entry.total,
        vatAmount: vat,
        discount: 0.0,
        paidAmount: entry.total,
        dueAmount: 0.0,
        oldBalance: oldBalance ?? 0.0,
        newBalance: newBalance ?? 0.0,
        paymentMethod: 'Cash/Bank',
        status: 'Completed',
        notes: entry.notes,
        items: entry.items,
        storeName: sName,
        storeNameArabic: sNameAr,
        storeAddress1: sAddr1,
        storeAddress2: sAddr2,
        storeMobile: sMobile,
        storeVatNumber: sVat,
      );
    } else if (entry is WholesalePaymentModel) {
      final isPaymentIn = entry.kind == 'payment_in';
      return TransactionPrintData(
        headerTitle: isPaymentIn ? 'PAYMENT RECEIVED' : 'PAYMENT OUT',
        invoiceNumber: entry.id.length > 8
            ? entry.id.substring(0, 8).toUpperCase()
            : entry.id.toUpperCase(),
        partyName: (overridePartyName != null && overridePartyName.isNotEmpty)
            ? overridePartyName
            : 'Customer',
        partyMobile: '',
        partyVatNumber: partyVatNumber,
        saleNumber: saleNumber,
        createdAt: entry.createdAt,
        totalAmount: entry.amount,
        subtotal: entry.amount,
        vatAmount: 0.0,
        discount: 0.0,
        paidAmount: entry.amount,
        dueAmount: 0.0,
        oldBalance: oldBalance ?? 0.0,
        newBalance: newBalance ?? 0.0,
        paymentMethod: 'Cash',
        status: 'Completed',
        notes: entry.notes,
        items: [],
        storeName: sName,
        storeNameArabic: sNameAr,
        storeAddress1: sAddr1,
        storeAddress2: sAddr2,
        storeMobile: sMobile,
        storeVatNumber: sVat,
      );
    } else if (entry is WholesaleOrderModel) {
      final sub = entry.items.fold(0.0, (sum, i) => sum + (i.qty * i.price));
      final vat = entry.total > sub ? (entry.total - sub) : 0.0;
      return TransactionPrintData(
        headerTitle: 'ORDER INVOICE',
        invoiceNumber: '${entry.orderNumber}',
        partyName: (overridePartyName != null && overridePartyName.isNotEmpty)
            ? overridePartyName
            : entry.customerName,
        partyMobile: entry.customerMobile,
        partyVatNumber: partyVatNumber,
        saleNumber: saleNumber ?? '${entry.orderNumber}',
        createdAt: entry.createdAt,
        totalAmount: entry.total,
        subtotal: sub > 0 ? sub : entry.total,
        vatAmount: vat,
        discount: 0.0,
        paidAmount: 0.0,
        dueAmount: entry.total,
        oldBalance: oldBalance ?? 0.0,
        newBalance: newBalance ?? entry.total,
        paymentMethod: 'Pending',
        status: entry.status,
        notes: entry.notes,
        items: entry.items,
        storeName: sName,
        storeNameArabic: sNameAr,
        storeAddress1: sAddr1,
        storeAddress2: sAddr2,
        storeMobile: sMobile,
        storeVatNumber: sVat,
      );
    }

    return TransactionPrintData(
      headerTitle: 'TRANSACTION',
      invoiceNumber: '0000',
      partyName: (overridePartyName != null && overridePartyName.isNotEmpty)
          ? overridePartyName
          : 'Customer',
      partyMobile: '',
      partyVatNumber: partyVatNumber,
      saleNumber: saleNumber,
      createdAt: DateTime.now(),
      totalAmount: 0.0,
      subtotal: 0.0,
      vatAmount: 0.0,
      discount: 0.0,
      paidAmount: 0.0,
      dueAmount: 0.0,
      oldBalance: oldBalance ?? 0.0,
      newBalance: newBalance ?? 0.0,
      paymentMethod: 'N/A',
      status: 'Completed',
      items: [],
      storeName: sName,
      storeNameArabic: sNameAr,
      storeAddress1: sAddr1,
      storeAddress2: sAddr2,
      storeMobile: sMobile,
      storeVatNumber: sVat,
    );
  }
}

class PdfPrintService {
  static Future<void> printProductList({
    required List<ProductModel> products,
    String title = 'Product Inventory & Price List',
  }) async {
    final pdfBytes = await buildProductListPdf(
      products: products,
      title: title,
    );
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
                        style: const pw.TextStyle(
                          fontSize: 10,
                          color: PdfColors.grey700,
                        ),
                      ),
                      pw.SizedBox(height: 2),
                      pw.Text(
                        'Total Products: ${products.length}',
                        style: pw.TextStyle(
                          fontSize: 10,
                          fontWeight: pw.FontWeight.bold,
                          color: PdfColors.grey800,
                        ),
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
                  style: const pw.TextStyle(
                    fontSize: 9,
                    color: PdfColors.grey600,
                  ),
                ),
                pw.Text(
                  'Page ${context.pageNumber} of ${context.pagesCount}',
                  style: const pw.TextStyle(
                    fontSize: 9,
                    color: PdfColors.grey600,
                  ),
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
              cellPadding: const pw.EdgeInsets.symmetric(
                horizontal: 6,
                vertical: 6,
              ),
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

  // Thermal 80mm Receipt Printing (Simplified Tax Invoice / فاتورة ضريبية مبسطة)
  static pw.Font? _cairoRegular;
  static pw.Font? _cairoBold;

  static Future<void> _ensureFontsLoaded() async {
    if (_cairoRegular != null && _cairoBold != null) return;
    try {
      final regData = await rootBundle.load('assets/fonts/Cairo-Regular.ttf');
      final boldData = await rootBundle.load('assets/fonts/Cairo-Bold.ttf');
      _cairoRegular = pw.Font.ttf(regData);
      _cairoBold = pw.Font.ttf(boldData);
    } catch (_) {
      try {
        _cairoRegular = await PdfGoogleFonts.cairoRegular();
        _cairoBold = await PdfGoogleFonts.cairoBold();
      } catch (_) {
        _cairoRegular = pw.Font.helvetica();
        _cairoBold = pw.Font.helveticaBold();
      }
    }
  }

  static pw.Widget _buildDashedLine({double height = 0.8}) {
    return pw.LayoutBuilder(
      builder: (context, constraints) {
        final boxWidth = constraints?.maxWidth ?? 200;
        const dashWidth = 3.0;
        const dashSpace = 2.0;
        final dashCount = (boxWidth / (dashWidth + dashSpace)).floor();
        return pw.Padding(
          padding: const pw.EdgeInsets.symmetric(vertical: 2.5),
          child: pw.Row(
            mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
            children: List.generate(dashCount, (_) {
              return pw.SizedBox(
                width: dashWidth,
                height: height,
                child: pw.DecoratedBox(
                  decoration: const pw.BoxDecoration(color: PdfColors.black),
                ),
              );
            }),
          ),
        );
      },
    );
  }

  static pw.Widget _buildRollSummaryRow(
    String label,
    String value, {
    bool isBold = false,
    double fontSize = 8.5,
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

  static Future<void> print80mmReceipt({
    required dynamic entry,
    String? partyName,
    String? partyVatNumber,
    String? saleNumber,
    double? oldBalance,
    double? newBalance,
    String? storeName,
    String? storeNameArabic,
    String? storeAddress1,
    String? storeAddress2,
    String? storeMobile,
    String? storeVatNumber,
  }) async {
    final pdfBytes = await build80mmReceiptPdf(
      entry: entry,
      partyName: partyName,
      partyVatNumber: partyVatNumber,
      saleNumber: saleNumber,
      oldBalance: oldBalance,
      newBalance: newBalance,
      storeName: storeName,
      storeNameArabic: storeNameArabic,
      storeAddress1: storeAddress1,
      storeAddress2: storeAddress2,
      storeMobile: storeMobile,
      storeVatNumber: storeVatNumber,
    );
    const format = PdfPageFormat(
      80 * PdfPageFormat.mm,
      300 * PdfPageFormat.mm,
      marginLeft: 3 * PdfPageFormat.mm,
      marginRight: 3 * PdfPageFormat.mm,
      marginTop: 3 * PdfPageFormat.mm,
      marginBottom: 3 * PdfPageFormat.mm,
    );
    await Printing.layoutPdf(
      onLayout: (PdfPageFormat _) async => pdfBytes,
      name: 'Receipt_80mm_${DateTime.now().millisecondsSinceEpoch}',
      format: format,
      dynamicLayout: false,
    );
  }

  static Future<void> preview80mmReceipt(
    BuildContext context, {
    required dynamic entry,
    String? partyName,
    String? partyVatNumber,
    String? saleNumber,
    double? oldBalance,
    double? newBalance,
    String? storeName,
    String? storeNameArabic,
    String? storeAddress1,
    String? storeAddress2,
    String? storeMobile,
    String? storeVatNumber,
  }) async {
    const format = PdfPageFormat(
      80 * PdfPageFormat.mm,
      300 * PdfPageFormat.mm,
      marginLeft: 3 * PdfPageFormat.mm,
      marginRight: 3 * PdfPageFormat.mm,
      marginTop: 3 * PdfPageFormat.mm,
      marginBottom: 3 * PdfPageFormat.mm,
    );
    final pdfBytes = await build80mmReceiptPdf(
      entry: entry,
      partyName: partyName,
      partyVatNumber: partyVatNumber,
      saleNumber: saleNumber,
      oldBalance: oldBalance,
      newBalance: newBalance,
      storeName: storeName,
      storeNameArabic: storeNameArabic,
      storeAddress1: storeAddress1,
      storeAddress2: storeAddress2,
      storeMobile: storeMobile,
      storeVatNumber: storeVatNumber,
    );

    if (!context.mounted) return;
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => Scaffold(
          appBar: AppBar(
            title: const Text('80mm Thermal Receipt'),
            backgroundColor: const Color(0xFF0F9D58),
            foregroundColor: Colors.white,
          ),
          body: PdfPreview(
            build: (f) => pdfBytes,
            initialPageFormat: format,
            pageFormats: const {'80mm Roll': format},
            canChangePageFormat: false,
            canChangeOrientation: false,
            canDebug: false,
            allowPrinting: true,
            allowSharing: true,
            pdfFileName: 'Receipt_${DateTime.now().millisecondsSinceEpoch}.pdf',
          ),
        ),
      ),
    );
  }

  static Future<Uint8List> generateReceiptImage({
    required dynamic entry,
    String? partyName,
    String? partyVatNumber,
    String? saleNumber,
    double? oldBalance,
    double? newBalance,
    String? storeName,
    String? storeNameArabic,
    String? storeAddress1,
    String? storeAddress2,
    String? storeMobile,
    String? storeVatNumber,
    double dpi = 300,
  }) async {
    final pdfBytes = await build80mmReceiptPdf(
      entry: entry,
      partyName: partyName,
      partyVatNumber: partyVatNumber,
      saleNumber: saleNumber,
      oldBalance: oldBalance,
      newBalance: newBalance,
      storeName: storeName,
      storeNameArabic: storeNameArabic,
      storeAddress1: storeAddress1,
      storeAddress2: storeAddress2,
      storeMobile: storeMobile,
      storeVatNumber: storeVatNumber,
    );
    await for (final page in Printing.raster(pdfBytes, dpi: dpi)) {
      return await page.toPng();
    }
    return pdfBytes;
  }

  static Future<Uint8List> build80mmReceiptPdf({
    required dynamic entry,
    String? partyName,
    String? partyVatNumber,
    String? saleNumber,
    double? oldBalance,
    double? newBalance,
    String? storeName,
    String? storeNameArabic,
    String? storeAddress1,
    String? storeAddress2,
    String? storeMobile,
    String? storeVatNumber,
  }) async {
    await _ensureFontsLoaded();

    final data = TransactionPrintData.fromEntry(
      entry,
      overridePartyName: partyName,
      partyVatNumber: partyVatNumber,
      saleNumber: saleNumber,
      oldBalance: oldBalance,
      newBalance: newBalance,
      storeName: storeName,
      storeNameArabic: storeNameArabic,
      storeAddress1: storeAddress1,
      storeAddress2: storeAddress2,
      storeMobile: storeMobile,
      storeVatNumber: storeVatNumber,
    );

    final pdf = pw.Document();
    final dateStr = DateFormat('dd/MM/yyyy').format(data.createdAt);
    final timeStr = DateFormat('HH:mm').format(data.createdAt);

    const format = PdfPageFormat(
      80 * PdfPageFormat.mm,
      300 * PdfPageFormat.mm,
      marginLeft: 3 * PdfPageFormat.mm,
      marginRight: 3 * PdfPageFormat.mm,
      marginTop: 3 * PdfPageFormat.mm,
      marginBottom: 3 * PdfPageFormat.mm,
    );

    pdf.addPage(
      pw.Page(
        pageFormat: format,
        theme: pw.ThemeData.withFont(base: _cairoRegular, bold: _cairoBold),
        build: (pw.Context context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.stretch,
            children: [
              // Store Header
              pw.Center(
                child: pw.Text(
                  data.storeName,
                  style: pw.TextStyle(
                    fontSize: 13,
                    fontWeight: pw.FontWeight.bold,
                  ),
                ),
              ),
              pw.Center(
                child: pw.Text(
                  data.storeNameArabic,
                  style: pw.TextStyle(
                    fontSize: 12,
                    fontWeight: pw.FontWeight.bold,
                  ),
                ),
              ),
              pw.SizedBox(height: 2),
              pw.Center(
                child: pw.Text(
                  data.storeAddress1,
                  style: const pw.TextStyle(fontSize: 8.5),
                ),
              ),
              pw.Center(
                child: pw.Text(
                  data.storeAddress2,
                  style: const pw.TextStyle(fontSize: 8.5),
                ),
              ),
              pw.SizedBox(height: 1),
              pw.Center(
                child: pw.Text(
                  'Mobile / رقم الجوال : ${data.storeMobile}',
                  style: const pw.TextStyle(fontSize: 8.5),
                ),
              ),
              pw.Center(
                child: pw.Text(
                  'VAT / الرقم الضريبي : ${data.storeVatNumber}',
                  style: const pw.TextStyle(fontSize: 8.5),
                ),
              ),
              pw.SizedBox(height: 3),
              pw.Divider(thickness: 1.0, color: PdfColors.black),
              pw.SizedBox(height: 2),

              // Document Title: Simplified Tax Invoice / فاتورة ضريبية مبسطة
              pw.Center(
                child: pw.Text(
                  'Simplified Tax Invoice',
                  style: pw.TextStyle(
                    fontSize: 9.5,
                    fontWeight: pw.FontWeight.bold,
                  ),
                ),
              ),
              pw.Center(
                child: pw.Text(
                  'فاتورة ضريبية مبسطة',
                  style: pw.TextStyle(
                    fontSize: 9.5,
                    fontWeight: pw.FontWeight.bold,
                  ),
                ),
              ),
              pw.SizedBox(height: 2),
              pw.Divider(thickness: 1.0, color: PdfColors.black),
              pw.SizedBox(height: 2),

              // Metadata Row 1: Invoice # and Payment Mode
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                crossAxisAlignment: pw.CrossAxisAlignment.start,
                children: [
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text(
                        'Invoice / # رقم الفاتورة :',
                        style: const pw.TextStyle(fontSize: 8.5),
                      ),
                      pw.Text(
                        data.invoiceNumber,
                        style: pw.TextStyle(
                          fontSize: 10,
                          fontWeight: pw.FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.end,
                    children: [
                      pw.Text(
                        'Pay / الدفع :',
                        style: const pw.TextStyle(fontSize: 8.5),
                      ),
                      pw.Text(
                        data.paymentMethod.isNotEmpty
                            ? data.paymentMethod
                            : 'due',
                        style: pw.TextStyle(
                          fontSize: 9.5,
                          fontWeight: pw.FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              pw.SizedBox(height: 3),

              // Metadata Row 2: Date & Time
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                crossAxisAlignment: pw.CrossAxisAlignment.start,
                children: [
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text(
                        'Date / التاريخ :',
                        style: const pw.TextStyle(fontSize: 8.5),
                      ),
                      pw.Text(
                        dateStr,
                        style: const pw.TextStyle(fontSize: 8.5),
                      ),
                    ],
                  ),
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.end,
                    children: [
                      pw.Text(
                        'Time / الوقت :',
                        style: const pw.TextStyle(fontSize: 8.5),
                      ),
                      pw.Text(
                        timeStr,
                        style: const pw.TextStyle(fontSize: 8.5),
                      ),
                    ],
                  ),
                ],
              ),
              pw.SizedBox(height: 3),

              // Metadata Row 3: Customer
              pw.Text(
                'Customer / العميل :',
                style: const pw.TextStyle(fontSize: 8.5),
              ),
              pw.Text(
                data.partyName,
                style: pw.TextStyle(
                  fontSize: 9.5,
                  fontWeight: pw.FontWeight.bold,
                ),
              ),
              pw.SizedBox(height: 3),

              // Metadata Row 4: Cust. VAT & Sale Number
              pw.Text(
                'Cust. VAT / الرقم الضريبي للعميل :${(data.partyVatNumber != null && data.partyVatNumber!.isNotEmpty) ? " ${data.partyVatNumber}" : ""}',
                style: const pw.TextStyle(fontSize: 8.5),
              ),
              pw.Text(
                'Sale # ${data.saleNumber ?? data.invoiceNumber}',
                style: const pw.TextStyle(fontSize: 8.5),
              ),
              pw.SizedBox(height: 3),
              pw.Divider(thickness: 1.0, color: PdfColors.black),
              pw.SizedBox(height: 1),

              // Items Table Header
              pw.Row(
                children: [
                  pw.Expanded(
                    flex: 5,
                    child: pw.Column(
                      crossAxisAlignment: pw.CrossAxisAlignment.start,
                      children: [
                        pw.Text(
                          'Item',
                          style: pw.TextStyle(
                            fontSize: 8.5,
                            fontWeight: pw.FontWeight.bold,
                          ),
                        ),
                        pw.Text(
                          'الصنف',
                          style: pw.TextStyle(
                            fontSize: 8,
                            fontWeight: pw.FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  pw.Expanded(
                    flex: 2,
                    child: pw.Column(
                      crossAxisAlignment: pw.CrossAxisAlignment.center,
                      children: [
                        pw.Text(
                          'QTY',
                          style: pw.TextStyle(
                            fontSize: 8.5,
                            fontWeight: pw.FontWeight.bold,
                          ),
                        ),
                        pw.Text(
                          'الكمية',
                          style: pw.TextStyle(
                            fontSize: 8,
                            fontWeight: pw.FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  pw.Expanded(
                    flex: 2,
                    child: pw.Column(
                      crossAxisAlignment: pw.CrossAxisAlignment.end,
                      children: [
                        pw.Text(
                          'RATE',
                          style: pw.TextStyle(
                            fontSize: 8.5,
                            fontWeight: pw.FontWeight.bold,
                          ),
                        ),
                        pw.Text(
                          'السعر',
                          style: pw.TextStyle(
                            fontSize: 8,
                            fontWeight: pw.FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                  pw.Expanded(
                    flex: 2,
                    child: pw.Column(
                      crossAxisAlignment: pw.CrossAxisAlignment.end,
                      children: [
                        pw.Text(
                          'TOTAL',
                          style: pw.TextStyle(
                            fontSize: 8.5,
                            fontWeight: pw.FontWeight.bold,
                          ),
                        ),
                        pw.Text(
                          'الإجمالي',
                          style: pw.TextStyle(
                            fontSize: 8,
                            fontWeight: pw.FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              _buildDashedLine(),

              // Items Rows
              ...data.items.map((item) {
                return pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.start,
                  children: [
                    pw.Text(
                      item.name,
                      style: pw.TextStyle(
                        fontSize: 8.5,
                        fontWeight: pw.FontWeight.bold,
                      ),
                    ),
                    pw.Row(
                      children: [
                        pw.Expanded(flex: 5, child: pw.SizedBox()),
                        pw.Expanded(
                          flex: 2,
                          child: pw.Text(
                            item.qty.toStringAsFixed(2),
                            textAlign: pw.TextAlign.center,
                            style: const pw.TextStyle(fontSize: 8.5),
                          ),
                        ),
                        pw.Expanded(
                          flex: 2,
                          child: pw.Text(
                            item.price.toStringAsFixed(2),
                            textAlign: pw.TextAlign.right,
                            style: const pw.TextStyle(fontSize: 8.5),
                          ),
                        ),
                        pw.Expanded(
                          flex: 2,
                          child: pw.Text(
                            (item.qty * item.price).toStringAsFixed(2),
                            textAlign: pw.TextAlign.right,
                            style: pw.TextStyle(
                              fontSize: 8.5,
                              fontWeight: pw.FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    _buildDashedLine(),
                  ],
                );
              }),

              // Financial Summary
              pw.SizedBox(height: 1),
              _buildRollSummaryRow(
                'Subtotal المجموع الفرعي',
                'SAR ${data.subtotal.toStringAsFixed(2)}',
              ),
              _buildRollSummaryRow(
                'VAT 15% ضريبة القيمة المضافة ١٥٪',
                'SAR ${data.vatAmount.toStringAsFixed(2)}',
              ),
              pw.SizedBox(height: 2),
              pw.Divider(thickness: 1.0, color: PdfColors.black),
              pw.SizedBox(height: 1),

              // Grand Total
              _buildRollSummaryRow(
                'Grand Total الإجمالي النهائي',
                'SAR ${data.totalAmount.toStringAsFixed(2)}',
                isBold: true,
                fontSize: 10,
              ),
              pw.SizedBox(height: 2),
              pw.Divider(thickness: 0.6, color: PdfColors.black),
              pw.SizedBox(height: 1),
              pw.Divider(thickness: 0.6, color: PdfColors.black),
              pw.SizedBox(height: 3),

              // Ledger Balances
              _buildRollSummaryRow(
                'Old Balance الرصيد السابق',
                'SAR ${data.oldBalance.toStringAsFixed(2)}',
              ),
              _buildRollSummaryRow(
                'Received المبلغ المستلم',
                'SAR ${data.paidAmount.toStringAsFixed(2)}',
              ),
              _buildRollSummaryRow(
                'New Balance الرصيد الجديد',
                'SAR ${data.newBalance.toStringAsFixed(2)}',
                isBold: true,
              ),
              _buildDashedLine(),

              // Amount in Words
              pw.SizedBox(height: 2),
              pw.Center(
                child: pw.Text(
                  'Amount in Words: ${NumberToWordsHelper.convertToSaudiRiyals(data.totalAmount)}',
                  style: const pw.TextStyle(fontSize: 8),
                  textAlign: pw.TextAlign.center,
                ),
              ),
              pw.Center(
                child: pw.Text(
                  'المبلغ كتابة',
                  style: const pw.TextStyle(fontSize: 7.5),
                ),
              ),
              _buildDashedLine(),
              pw.SizedBox(height: 4),

              // ZATCA QR Code
              pw.Center(
                child: pw.BarcodeWidget(
                  barcode: pw.Barcode.qrCode(),
                  data: ZatcaQrHelper.generateQrCode(
                    sellerName: data.storeName,
                    vatNumber: data.storeVatNumber,
                    timestamp: data.createdAt,
                    totalAmount: data.totalAmount,
                    vatAmount: data.vatAmount,
                  ),
                  width: 95,
                  height: 95,
                  drawText: false,
                ),
              ),
              pw.SizedBox(height: 2),
              pw.Center(
                child: pw.Text(
                  'ZATCA QR رمز الاستجابة السريعة',
                  style: const pw.TextStyle(fontSize: 7.5),
                ),
              ),
              pw.SizedBox(height: 4),
              pw.Divider(thickness: 1.0, color: PdfColors.black),
              pw.SizedBox(height: 3),

              // Footer
              pw.Center(
                child: pw.Text(
                  'THANK YOU',
                  style: pw.TextStyle(
                    fontSize: 10,
                    fontWeight: pw.FontWeight.bold,
                  ),
                ),
              ),
              pw.Center(
                child: pw.Text(
                  'شكراً لكم',
                  style: pw.TextStyle(
                    fontSize: 10,
                    fontWeight: pw.FontWeight.bold,
                  ),
                ),
              ),
              pw.SizedBox(height: 1),
              pw.Center(
                child: pw.Text(
                  'Visit Again',
                  style: const pw.TextStyle(fontSize: 8),
                ),
              ),
              pw.Center(
                child: pw.Text(
                  'نتمنى زيارتكم مرة أخرى',
                  style: const pw.TextStyle(fontSize: 8),
                ),
              ),
              pw.SizedBox(height: 6),
            ],
          );
        },
      ),
    );

    return pdf.save();
  }

  // Invoice V2 A4 Printing
  static Future<void> printInvoiceV2({
    required dynamic entry,
    String? partyName,
  }) async {
    final pdfBytes = await buildInvoiceV2Pdf(
      entry: entry,
      partyName: partyName,
    );
    await Printing.layoutPdf(
      onLayout: (PdfPageFormat format) async => pdfBytes,
      name: 'Invoice_V2_${DateTime.now().millisecondsSinceEpoch}',
    );
  }

  static Future<Uint8List> buildInvoiceV2Pdf({
    required dynamic entry,
    String? partyName,
  }) async {
    final data = TransactionPrintData.fromEntry(
      entry,
      overridePartyName: partyName,
    );
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
                        style: const pw.TextStyle(
                          fontSize: 9,
                          color: PdfColors.grey700,
                        ),
                      ),
                      pw.Text(
                        'VAT / Tax Registration: 310029384700003',
                        style: const pw.TextStyle(
                          fontSize: 8,
                          color: PdfColors.grey600,
                        ),
                      ),
                    ],
                  ),
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.end,
                    children: [
                      pw.Container(
                        padding: const pw.EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 4,
                        ),
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
                        style: const pw.TextStyle(
                          fontSize: 9,
                          color: PdfColors.grey700,
                        ),
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
                  style: const pw.TextStyle(
                    fontSize: 8,
                    color: PdfColors.grey600,
                  ),
                ),
                pw.Text(
                  'Page ${context.pageNumber} of ${context.pagesCount}',
                  style: const pw.TextStyle(
                    fontSize: 8,
                    color: PdfColors.grey600,
                  ),
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
                          style: const pw.TextStyle(
                            fontSize: 9,
                            color: PdfColors.grey800,
                          ),
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
                        style: pw.TextStyle(
                          fontSize: 10,
                          fontWeight: pw.FontWeight.bold,
                        ),
                      ),
                      pw.SizedBox(height: 2),
                      pw.Text(
                        'Status: ${data.status.toUpperCase()}',
                        style: pw.TextStyle(
                          fontSize: 9,
                          color: data.dueAmount > 0
                              ? PdfColors.red800
                              : PdfColors.green800,
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
                headers: [
                  '#',
                  'Item Description',
                  'Qty',
                  'Unit Price',
                  'Total Amount',
                ],
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
                cellPadding: const pw.EdgeInsets.symmetric(
                  horizontal: 8,
                  vertical: 6,
                ),
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
                      style: pw.TextStyle(
                        fontSize: 12,
                        fontWeight: pw.FontWeight.bold,
                      ),
                    ),
                    if (data.notes != null) ...[
                      pw.SizedBox(height: 4),
                      pw.Text(
                        'Notes: ${data.notes}',
                        style: const pw.TextStyle(fontSize: 9),
                      ),
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
                        pw.Text(
                          'Notes & Remarks:',
                          style: pw.TextStyle(
                            fontSize: 9,
                            fontWeight: pw.FontWeight.bold,
                          ),
                        ),
                        pw.SizedBox(height: 4),
                        pw.Container(
                          width: double.infinity,
                          padding: const pw.EdgeInsets.all(8),
                          decoration: pw.BoxDecoration(
                            color: altRowBgColor,
                            border: pw.Border.all(
                              color: borderColor,
                              width: 0.5,
                            ),
                            borderRadius: pw.BorderRadius.circular(4),
                          ),
                          child: pw.Text(
                            data.notes!,
                            style: const pw.TextStyle(
                              fontSize: 8,
                              color: PdfColors.grey800,
                            ),
                          ),
                        ),
                        pw.SizedBox(height: 10),
                      ],
                      pw.Text(
                        'Terms & Conditions:',
                        style: pw.TextStyle(
                          fontSize: 8,
                          fontWeight: pw.FontWeight.bold,
                        ),
                      ),
                      pw.Text(
                        '1. All claims must be made within 7 days of invoice date.',
                        style: const pw.TextStyle(
                          fontSize: 7,
                          color: PdfColors.grey700,
                        ),
                      ),
                      pw.Text(
                        '2. Electronic computer-generated invoice, signature optional.',
                        style: const pw.TextStyle(
                          fontSize: 7,
                          color: PdfColors.grey700,
                        ),
                      ),
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
                        _buildA4SummaryRow(
                          'Subtotal:',
                          '${data.subtotal.toStringAsFixed(2)} SAR',
                        ),
                        if (data.discount > 0)
                          _buildA4SummaryRow(
                            'Discount:',
                            '- ${data.discount.toStringAsFixed(2)} SAR',
                          ),
                        pw.Divider(color: borderColor, thickness: 0.5),
                        pw.Container(
                          padding: const pw.EdgeInsets.symmetric(
                            vertical: 4,
                            horizontal: 6,
                          ),
                          decoration: pw.BoxDecoration(
                            color: primaryColor,
                            borderRadius: pw.BorderRadius.circular(4),
                          ),
                          child: pw.Row(
                            mainAxisAlignment:
                                pw.MainAxisAlignment.spaceBetween,
                            children: [
                              pw.Text(
                                'GRAND TOTAL:',
                                style: pw.TextStyle(
                                  color: PdfColors.white,
                                  fontWeight: pw.FontWeight.bold,
                                  fontSize: 10,
                                ),
                              ),
                              pw.Text(
                                '${data.totalAmount.toStringAsFixed(2)} SAR',
                                style: pw.TextStyle(
                                  color: PdfColors.white,
                                  fontWeight: pw.FontWeight.bold,
                                  fontSize: 10,
                                ),
                              ),
                            ],
                          ),
                        ),
                        pw.SizedBox(height: 4),
                        _buildA4SummaryRow(
                          'Paid Amount:',
                          '${data.paidAmount.toStringAsFixed(2)} SAR',
                          valueColor: PdfColors.green800,
                        ),
                        if (data.dueAmount > 0)
                          _buildA4SummaryRow(
                            'Balance Due:',
                            '${data.dueAmount.toStringAsFixed(2)} SAR',
                            isBold: true,
                            valueColor: PdfColors.red800,
                          ),
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
                    pw.Container(
                      width: 120,
                      height: 1,
                      color: PdfColors.grey400,
                    ),
                    pw.SizedBox(height: 4),
                    pw.Text(
                      'Customer Signature',
                      style: const pw.TextStyle(
                        fontSize: 8,
                        color: PdfColors.grey700,
                      ),
                    ),
                  ],
                ),
                pw.Column(
                  crossAxisAlignment: pw.CrossAxisAlignment.center,
                  children: [
                    pw.Container(
                      width: 120,
                      height: 1,
                      color: PdfColors.grey400,
                    ),
                    pw.SizedBox(height: 4),
                    pw.Text(
                      'Authorized Signature',
                      style: const pw.TextStyle(
                        fontSize: 8,
                        color: PdfColors.grey700,
                      ),
                    ),
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
