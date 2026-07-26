import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:image_picker/image_picker.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_colors.dart';
import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../models/wholesale_models.dart';
import '../../common_widgets/dashed_rounded_rect_painter.dart';
import '../../common_widgets/dialog_helper_widgets.dart';

class AddCategoryBottomSheet extends StatefulWidget {
  final WholesaleCategoryModel? categoryToEdit;

  const AddCategoryBottomSheet({
    super.key,
    this.categoryToEdit,
  });

  @override
  State<AddCategoryBottomSheet> createState() => _AddCategoryBottomSheetState();
}

class _AddCategoryBottomSheetState extends State<AddCategoryBottomSheet> {
  String? selectedImagePath;
  String smartSectionValue = '— None —';
  bool isActive = true;

  late final TextEditingController nameController;
  late final TextEditingController arController;
  late final TextEditingController bnController;
  late final TextEditingController sortController;

  @override
  void initState() {
    super.initState();
    final cat = widget.categoryToEdit;
    nameController = TextEditingController(text: cat?.name ?? '');
    arController = TextEditingController(text: cat?.nameAr ?? '');
    bnController = TextEditingController(text: cat?.nameBn ?? '');
    sortController = TextEditingController(text: cat?.sortOrder.toString() ?? '0');
    isActive = cat?.isActive ?? true;
    selectedImagePath = cat?.imageUrl;
    smartSectionValue = cat?.smartSection ?? '— None —';
  }

  @override
  void dispose() {
    nameController.dispose();
    arController.dispose();
    bnController.dispose();
    sortController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final bgColor = isDark ? const Color(0xFF161E2E) : Colors.white;
    final labelColor = isDark ? Colors.grey[400] : const Color(0xFF64748B);
    final textColor = isDark ? Colors.white : const Color(0xFF1E293B);
    final inputBg = isDark ? const Color(0xFF111827) : const Color(0xFFF8FAFC);
    final borderColor = isDark ? const Color(0xFF1F2937) : const Color(0xFFE2E8F0);

    return SafeArea(
      top: false,
      child: Container(
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        padding: EdgeInsets.only(
          left: 20,
          right: 20,
          top: 16,
          bottom: MediaQuery.of(context).viewInsets.bottom + 24,
        ),
        child: SafeArea(
          child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const SizedBox(width: 48),
                  Text(
                    'New category',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: textColor,
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: Icon(
                      LucideIcons.x,
                      color: labelColor,
                      size: 20,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Image label
              FieldLabel('Category image / icon', color: labelColor),
              const SizedBox(height: 10),

              // Dashed photo box container
              CustomPaint(
                painter: DashedRoundedRectPainter(
                  color: borderColor,
                  borderRadius: 16,
                  gap: 6,
                ),
                child: Container(
                  width: double.infinity,
                  height: 160,
                  alignment: Alignment.center,
                  child: selectedImagePath != null
                      ? Stack(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(16),
                              child: selectedImagePath!.startsWith('http')
                                  ? Image.network(
                                      selectedImagePath!,
                                      width: double.infinity,
                                      height: 160,
                                      fit: BoxFit.cover,
                                      errorBuilder: (context, error, stackTrace) {
                                        return Center(
                                          child: Icon(
                                            LucideIcons.imageOff,
                                            size: 40,
                                            color: labelColor,
                                          ),
                                        );
                                      },
                                    )
                                  : Image.file(
                                      File(selectedImagePath!),
                                      width: double.infinity,
                                      height: 160,
                                      fit: BoxFit.cover,
                                      errorBuilder: (context, error, stackTrace) {
                                        return Center(
                                          child: Icon(
                                            LucideIcons.imageOff,
                                            size: 40,
                                            color: labelColor,
                                          ),
                                        );
                                      },
                                    ),
                            ),
                            Positioned(
                              top: 8,
                              right: 8,
                              child: GestureDetector(
                                onTap: () {
                                  setState(() {
                                    selectedImagePath = null;
                                  });
                                },
                                child: Container(
                                  padding: const EdgeInsets.all(6),
                                  decoration: const BoxDecoration(
                                    color: Colors.black54,
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(
                                    LucideIcons.trash2,
                                    color: Colors.white,
                                    size: 14,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        )
                      : Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              LucideIcons.image,
                              size: 44,
                              color: isDark ? Colors.grey[700] : Colors.grey[400],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'No image yet',
                              style: TextStyle(
                                color: isDark ? Colors.grey[500] : Colors.grey[400],
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                ),
              ),
              const SizedBox(height: 12),

              // Camera, Gallery, Find row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: PillIconButton(
                      icon: LucideIcons.camera,
                      label: 'Camera',
                      isDark: isDark,
                      onTap: () async {
                        final ImagePicker picker = ImagePicker();
                        final XFile? image = await picker.pickImage(source: ImageSource.camera);
                        if (image != null) {
                          setState(() {
                            selectedImagePath = image.path;
                          });
                        }
                      },
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: PillIconButton(
                      icon: LucideIcons.image,
                      label: 'Gallery',
                      isDark: isDark,
                      onTap: () async {
                        final ImagePicker picker = ImagePicker();
                        final XFile? image = await picker.pickImage(source: ImageSource.gallery);
                        if (image != null) {
                          setState(() {
                            selectedImagePath = image.path;
                          });
                        }
                      },
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: PillIconButton(
                      icon: LucideIcons.sparkles,
                      label: 'Find',
                      isDark: isDark,
                      onTap: () {
                        setState(() {
                          selectedImagePath = 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop';
                        });
                      },
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),

              // Compress notice
              Text(
                'Auto-compressed to 1280px JPEG. Use a clear, well-lit photo of the product.',
                style: TextStyle(
                  fontSize: 11,
                  color: labelColor,
                ),
              ),
              const SizedBox(height: 20),

              // Name *
              FieldLabel('Name *', color: labelColor),
              const SizedBox(height: 8),
              DialogTextField(
                controller: nameController,
                hint: 'Category name',
                inputBg: inputBg,
                borderColor: borderColor,
                textColor: textColor,
              ),
              const SizedBox(height: 16),

              // Side-by-side row: Name (Bengali) & Name (Arabic)
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        FieldLabel('Name (Bengali)', color: labelColor),
                        const SizedBox(height: 8),
                        DialogTextField(
                          controller: bnController,
                          hint: 'নাম (বাংলা)',
                          inputBg: inputBg,
                          borderColor: borderColor,
                          textColor: textColor,
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        FieldLabel('Name (Arabic)', color: labelColor),
                        const SizedBox(height: 8),
                        DialogTextField(
                          controller: arController,
                          hint: 'الاسم (بالعربية)',
                          inputBg: inputBg,
                          borderColor: borderColor,
                          textColor: textColor,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // Sort order
              FieldLabel('Sort order', color: labelColor),
              const SizedBox(height: 8),
              DialogTextField(
                controller: sortController,
                hint: '0',
                keyboardType: TextInputType.number,
                inputBg: inputBg,
                borderColor: borderColor,
                textColor: textColor,
              ),
              const SizedBox(height: 16),

              // Smart section (optional)
              FieldLabel('Smart section (optional)', color: labelColor),
              const SizedBox(height: 8),
              Container(
                decoration: BoxDecoration(
                  color: inputBg,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: borderColor),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: smartSectionValue,
                    isExpanded: true,
                    dropdownColor: bgColor,
                    style: TextStyle(color: textColor, fontSize: 14),
                    icon: const Icon(LucideIcons.chevronDown, size: 16),
                    items: <String>[
                      '— None —',
                      'Featured Products',
                      'Popular Categories',
                      'Best Sellers',
                      'New Arrivals',
                    ].map<DropdownMenuItem<String>>((String value) {
                      return DropdownMenuItem<String>(
                        value: value,
                        child: Text(value),
                      );
                    }).toList(),
                    onChanged: (String? newValue) {
                      if (newValue != null) {
                        setState(() {
                          smartSectionValue = newValue;
                        });
                      }
                    },
                  ),
                ),
              ),
              const SizedBox(height: 8),

              // Smart section notice
              Text(
                'Products assigned here automatically appear in the matching home section on the customer website.',
                style: TextStyle(
                  fontSize: 11,
                  color: labelColor,
                ),
              ),
              const SizedBox(height: 20),

              // Active Switch Row
              Container(
                decoration: BoxDecoration(
                  color: inputBg,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: borderColor),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Active',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: textColor,
                      ),
                    ),
                    Switch(
                      value: isActive,
                      activeThumbColor: Colors.white,
                      activeTrackColor: AppColors.primaryGlow,
                      inactiveTrackColor: isDark ? Colors.grey[800] : Colors.grey[300],
                      onChanged: (bool val) {
                        setState(() {
                          isActive = val;
                        });
                      },
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Save and Cancel buttons
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(50),
                  backgroundColor: AppColors.primaryGlow,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(24),
                  ),
                  elevation: 0,
                ),
                onPressed: () {
                  final name = nameController.text.trim();
                  final ar = arController.text.trim();
                  final bn = bnController.text.trim();
                  final sort = int.tryParse(sortController.text) ?? 0;
                  if (name.isNotEmpty) {
                    if (widget.categoryToEdit != null) {
                      final updated = widget.categoryToEdit!.copyWith(
                        name: name,
                        nameAr: ar.isEmpty ? null : ar,
                        nameBn: bn.isEmpty ? null : bn,
                        sortOrder: sort,
                        isActive: isActive,
                        imageUrl: selectedImagePath,
                        smartSection: smartSectionValue == '— None —' ? null : smartSectionValue,
                      );
                      context.read<WholesaleCubit>().updateCategory(updated);
                    } else {
                      context.read<WholesaleCubit>().createCategory(
                        name: name,
                        nameAr: ar.isEmpty ? null : ar,
                        nameBn: bn.isEmpty ? null : bn,
                        sortOrder: sort,
                        isActive: isActive,
                        imageUrl: selectedImagePath,
                        smartSection: smartSectionValue == '— None —' ? null : smartSectionValue,
                      );
                    }
                    Navigator.pop(context);
                  }
                },
                child: const Text(
                  'Save',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size.fromHeight(50),
                  side: BorderSide(color: borderColor),
                  foregroundColor: textColor,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(24),
                  ),
                  backgroundColor: isDark ? Colors.transparent : Colors.white,
                ),
                onPressed: () => Navigator.pop(context),
                child: const Text(
                  'Cancel',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                ),
              ),
            ],
          ),
        ),
      ),
    ),
  );
}
}
