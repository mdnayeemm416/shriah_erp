import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shriah_erp/screens/price_compare/price_compare_screen.dart';

void main() {
  testWidgets('PriceCompareScreen renders header and empty state', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(
        home: PriceCompareScreen(),
      ),
    );

    expect(find.text('Price Compare'), findsOneWidget);
    expect(find.text('PRICE COMPARE'), findsOneWidget);
    expect(find.text('Find & compare product prices'), findsOneWidget);
    expect(find.text('Scan Barcode'), findsOneWidget);
    expect(find.text('Add Product'), findsOneWidget);
    expect(find.text('All Products'), findsOneWidget);
    expect(find.text('0 items'), findsOneWidget);
    expect(find.text('No products available.'), findsOneWidget);

    // Tap Add Product to open modal bottom sheet
    await tester.tap(find.text('Add Product'));
    await tester.pumpAndSettle();

    expect(find.text('Product Information'), findsOneWidget);
    expect(find.text('Product Name *'), findsOneWidget);
    expect(find.text('Purchase Information'), findsOneWidget);
    expect(find.text('Save Product'), findsOneWidget);
    expect(find.text('Cancel'), findsOneWidget);

    // Verify Image Source action buttons
    await tester.ensureVisible(find.text('Find'));
    await tester.pumpAndSettle();

    expect(find.text('Camera'), findsOneWidget);
    expect(find.text('Gallery'), findsOneWidget);
    expect(find.text('Find'), findsOneWidget);

    // Tapping 'Find' without typing product name should show requirement dialog
    await tester.tap(find.text('Find'));
    await tester.pumpAndSettle();

    expect(find.text('Product Name Required'), findsOneWidget);
    expect(find.text('Please write the product name first before searching for images online.'), findsOneWidget);

    // Tap OK on the dialog
    await tester.tap(find.text('OK'));
    await tester.pumpAndSettle();

    expect(find.text('Product Name Required'), findsNothing);
  });
}
