import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'dashed_container.dart';

class PriceCompareEmptyState extends StatelessWidget {
  final VoidCallback onAddProduct;

  const PriceCompareEmptyState({
    super.key,
    required this.onAddProduct,
  });

  @override
  Widget build(BuildContext context) {
    return DashedContainer(
      borderRadius: 24,
      color: const Color(0xFFCBD5E1),
      dash: 6.0,
      gap: 5.0,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 48),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Circular Package Icon
          Container(
            width: 76,
            height: 76,
            decoration: const BoxDecoration(
              color: Color(0xFFE8F7F2),
              shape: BoxShape.circle,
            ),
            child: const Center(
              child: Icon(
                LucideIcons.box,
                color: Color(0xFF23B386),
                size: 36,
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Title
          const Text(
            'No products available.',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Color(0xFF0F172A),
            ),
          ),
          const SizedBox(height: 8),

          // Subtitle with inline green (+) button icon
          Center(
            child: RichText(
              textAlign: TextAlign.center,
              text: TextSpan(
                style: const TextStyle(
                  fontSize: 13.5,
                  color: Color(0xFF64748B),
                  height: 1.5,
                ),
                children: [
                  const TextSpan(text: 'Tap the '),
                  WidgetSpan(
                    alignment: PlaceholderAlignment.middle,
                    child: GestureDetector(
                      onTap: onAddProduct,
                      child: Container(
                        width: 20,
                        height: 20,
                        margin: const EdgeInsets.symmetric(horizontal: 4),
                        decoration: const BoxDecoration(
                          color: Color(0xFF23B386),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.add,
                          color: Colors.white,
                          size: 13,
                        ),
                      ),
                    ),
                  ),
                  const TextSpan(text: ' button to add your first\nproduct.'),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
