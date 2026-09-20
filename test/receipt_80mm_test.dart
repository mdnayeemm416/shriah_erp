import 'dart:convert';
import 'dart:io';
import 'package:flutter_test/flutter_test.dart';
import 'package:pdf/pdf.dart';
import 'package:printing/printing.dart';
import 'package:shriah_erp/models/wholesale_models.dart';
import 'package:shriah_erp/services/pdf_print_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('80mm Simplified Tax Invoice Tests', () {
    test('NumberToWordsHelper test', () {
      expect(NumberToWordsHelper.convertToSaudiRiyals(43.00), 'Forty Three Saudi Riyals Only');
      expect(NumberToWordsHelper.convertToSaudiRiyals(100.50), 'One Hundred Saudi Riyals and Fifty Halalas Only');
      expect(NumberToWordsHelper.convertToSaudiRiyals(0.0), 'Zero Saudi Riyals Only');
    });

    test('ZatcaQrHelper TLV generation test', () {
      final qrString = ZatcaQrHelper.generateQrCode(
        sellerName: 'Azzouz WholeSale',
        vatNumber: '311339561300003',
        timestamp: DateTime.parse('2026-08-29T12:24:00Z'),
        totalAmount: 43.00,
        vatAmount: 5.61,
      );

      expect(qrString.isNotEmpty, true);
      final decodedBytes = base64Decode(qrString);
      expect(decodedBytes[0], 1); // Tag 1
      final len1 = decodedBytes[1];
      final sellerName = utf8.decode(decodedBytes.sublist(2, 2 + len1));
      expect(sellerName, 'Azzouz WholeSale');
    });

    test('build80mmReceiptPdf generates and renders receipt correctly', () async {
      final sampleSale = WholesaleSaleModel(
        id: 'sale-1070',
        invoiceNumber: 1068,
        customerName: 'Azzouz',
        customerMobile: '',
        paymentMethod: 'due',
        createdAt: DateTime(2026, 8, 29, 12, 24),
        total: 43.00,
        dueAmount: 43.00,
        discount: 0.0,
        items: [
          WholesaleSaleItemModel(
            productId: 'p1',
            name: '15No Shopping Kees Rabea 2Kg',
            qty: 1.0,
            price: 18.0,
            purchasePrice: 12.0,
          ),
          WholesaleSaleItemModel(
            productId: 'p2',
            name: '18No Shopping Kees Rabea 3Kg',
            qty: 1.0,
            price: 25.0,
            purchasePrice: 16.0,
          ),
        ],
      );

      final pdfBytes = await PdfPrintService.build80mmReceiptPdf(
        entry: sampleSale,
        saleNumber: '1070',
        oldBalance: 0.00,
        newBalance: -59157.00,
        storeName: 'Azzouz WholeSale',
        storeNameArabic: 'Azzouz WholeSale',
        storeAddress1: 'Walyal Ahd, Makkah',
        storeAddress2: 'Walyal Ahd, Makkah',
        storeMobile: '0553687388',
        storeVatNumber: '311339561300003',
      );

      expect(pdfBytes.isNotEmpty, true);
      final pdfHeader = utf8.decode(pdfBytes.sublist(0, 5));
      expect(pdfHeader, '%PDF-');
    });
  });
}

