import 'package:flutter_test/flutter_test.dart';
import 'package:shriah_erp/models/product_model.dart';

void main() {
  group('ProductModel JSON Serialization Tests', () {
    test('fromJson successfully parses new camelCase response with categoryId', () {
      final jsonResponse = {
        "success": true,
        "message": "Success",
        "data": [
          {
            "id": "e4f8b91a-7b3c-4d5e-8f90-123456789abc",
            "name": "7up Dubba 330ml*18",
            "nameAr": "سفن اب دبة",
            "nameBn": "সেভেন আপ",
            "barcode": "62810019283",
            "itemCode": "PRD-492019",
            "categoryId": "cat-beverages-uuid",
            "price": 38.00,
            "purchasePrice": 36.00,
            "comparePrice": null,
            "stock": 36.00,
            "minStock": 5.00,
            "taxRate": 15.00,
            "imageUrl": null,
            "description": "330ml cans pack of 18",
            "isVisibleOnWebsite": true,
            "isFeatured": false,
            "showStock": true,
            "isDeleted": false,
            "createdAt": "2026-08-17 00:30:00"
          }
        ]
      };

      final productData = (jsonResponse['data'] as List).first as Map<String, dynamic>;
      final product = ProductModel.fromJson(productData);

      expect(product.id, "e4f8b91a-7b3c-4d5e-8f90-123456789abc");
      expect(product.name, "7up Dubba 330ml*18");
      expect(product.nameAr, "سفن اب دبة");
      expect(product.nameBn, "সেভেন আপ");
      expect(product.barcode, "62810019283");
      expect(product.itemCode, "PRD-492019");
      expect(product.price, 38.00);
      expect(product.purchasePrice, 36.00);
      expect(product.comparePrice, isNull);
      expect(product.stock, 36.00);
      expect(product.minStock, 5.00);
      expect(product.taxRate, 15.00);
      expect(product.imageUrl, isNull);
      expect(product.description, "330ml cans pack of 18");
      expect(product.isVisibleOnWebsite, isTrue);
      expect(product.isFeatured, isFalse);
      expect(product.showStock, isTrue);
      expect(product.isDeleted, isFalse);
      expect(product.createdAt, DateTime.parse("2026-08-17 00:30:00"));
      expect(product.categoryIds, contains("cat-beverages-uuid"));
    });

    test('toJson produces both camelCase and snake_case properties', () {
      final product = ProductModel(
        id: "test-uuid",
        name: "Test Product",
        nameAr: "سفن اب",
        nameBn: "সেভেন আপ",
        barcode: "123456",
        itemCode: "PRD-123",
        price: 10.0,
        purchasePrice: 8.0,
        stock: 100.0,
        minStock: 10.0,
        imageUrl: "http://example.com/image.png",
        isDeleted: false,
        createdAt: DateTime.parse("2026-08-17 00:30:00"),
        comparePrice: 12.0,
        taxRate: 15.0,
        description: "Test description",
        categoryIds: ["cat-1"],
        isVisibleOnWebsite: true,
        isFeatured: true,
        showStock: true,
      );

      final json = product.toJson();

      // Verify camelCase keys are correct
      expect(json['nameAr'], "سفن اب");
      expect(json['nameBn'], "সেভেন আপ");
      expect(json['itemCode'], "PRD-123");
      expect(json['purchasePrice'], 8.0);
      expect(json['minStock'], 10.0);
      expect(json['imageUrl'], "http://example.com/image.png");
      expect(json['isDeleted'], isFalse);
      expect(json['createdAt'], "2026-08-17T00:30:00.000");
      expect(json['comparePrice'], 12.0);
      expect(json['taxRate'], 15.0);
      expect(json['categoryIds'], contains("cat-1"));
      expect(json['categoryId'], "cat-1");
      expect(json['isVisibleOnWebsite'], isTrue);
      expect(json['isFeatured'], isTrue);
      expect(json['showStock'], isTrue);

      // Verify snake_case keys are also present for compatibility
      expect(json['name_ar'], "سفن اب");
      expect(json['name_bn'], "সেভেন আপ");
      expect(json['item_code'], "PRD-123");
      expect(json['purchase_price'], 8.0);
      expect(json['min_stock'], 10.0);
      expect(json['image_url'], "http://example.com/image.png");
      expect(json['is_deleted'], isFalse);
      expect(json['created_at'], "2026-08-17T00:30:00.000");
      expect(json['compare_price'], 12.0);
      expect(json['tax_rate'], 15.0);
      expect(json['category_ids'], contains("cat-1"));
      expect(json['category_id'], "cat-1");
      expect(json['is_visible_on_website'], isTrue);
      expect(json['is_featured'], isTrue);
      expect(json['show_stock'], isTrue);
    });
  });
}
