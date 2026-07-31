import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../blocs/wholesale/wholesale_cubit.dart';
import '../../../blocs/wholesale/wholesale_state.dart';
import '../../../core/theme/app_colors.dart';
import '../../common_widgets/smart_image_widget.dart';
import 'add_category_bottom_sheet.dart';

class CategorySearchableDropdown extends StatelessWidget {
  final List<String> selectedCategories;
  final ValueChanged<List<String>> onChanged;

  const CategorySearchableDropdown({
    super.key,
    required this.selectedCategories,
    required this.onChanged,
  });

  void _openCategoryPicker(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return BlocProvider.value(
          value: BlocProvider.of<WholesaleCubit>(context),
          child: _CategoryPickerModal(
            selectedCategories: List<String>.from(selectedCategories),
            onChanged: onChanged,
          ),
        );
      },
    );
  }

  Future<void> _openAddCategorySheet(BuildContext context, [String? initialName]) async {
    final cubit = BlocProvider.of<WholesaleCubit>(context);
    final result = await showModalBottomSheet<String>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => BlocProvider.value(
        value: cubit,
        child: AddCategoryBottomSheet(initialName: initialName),
      ),
    );

    if (result != null && result.trim().isNotEmpty) {
      final newCatName = result.trim();
      final updatedList = List<String>.from(selectedCategories);
      if (!updatedList.contains(newCatName)) {
        updatedList.add(newCatName);
        onChanged(updatedList);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? const Color(0xFF111827) : Colors.white;
    final hintColor = isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8);
    final borderColor = isDark ? const Color(0xFF1F2937) : const Color(0xFFE2E8F0);
    const primaryColor = Color(0xFF24B489);

    return InkWell(
      onTap: () => _openCategoryPicker(context),
      borderRadius: BorderRadius.circular(20),
      child: Container(
        width: double.infinity,
        constraints: const BoxConstraints(minHeight: 52),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: cardBg,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: borderColor),
        ),
        child: Row(
          children: [
            Icon(LucideIcons.tag, size: 18, color: hintColor),
            const SizedBox(width: 10),
            Expanded(
              child: selectedCategories.isEmpty
                  ? Text(
                      'Select Category',
                      style: TextStyle(
                        fontSize: 14,
                        color: hintColor,
                      ),
                    )
                  : Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: selectedCategories.map((cat) {
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: primaryColor.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: primaryColor, width: 1),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                cat,
                                style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: primaryColor,
                                ),
                              ),
                              const SizedBox(width: 4),
                              InkWell(
                                onTap: () {
                                  final updatedList = List<String>.from(selectedCategories)..remove(cat);
                                  onChanged(updatedList);
                                },
                                child: const Icon(
                                  LucideIcons.x,
                                  size: 14,
                                  color: primaryColor,
                                ),
                              ),
                            ],
                          ),
                        );
                      }).toList(),
                    ),
            ),
            const SizedBox(width: 8),
            // Quick Add Category Button inside Dropdown Field
            InkWell(
              onTap: () => _openAddCategorySheet(context),
              borderRadius: BorderRadius.circular(16),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: primaryColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: primaryColor.withValues(alpha: 0.4)),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(LucideIcons.plus, size: 14, color: primaryColor),
                    SizedBox(width: 4),
                    Text(
                      'Add',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: primaryColor,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(width: 6),
            Icon(LucideIcons.chevronDown, size: 18, color: hintColor),
          ],
        ),
      ),
    );
  }
}

class _CategoryPickerModal extends StatefulWidget {
  final List<String> selectedCategories;
  final ValueChanged<List<String>> onChanged;

  const _CategoryPickerModal({
    required this.selectedCategories,
    required this.onChanged,
  });

  @override
  State<_CategoryPickerModal> createState() => _CategoryPickerModalState();
}

class _CategoryPickerModalState extends State<_CategoryPickerModal> {
  late final TextEditingController _searchController;
  late List<String> _currentSelected;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _searchController = TextEditingController();
    _currentSelected = List<String>.from(widget.selectedCategories);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _toggleCategory(String name) {
    setState(() {
      if (_currentSelected.contains(name)) {
        _currentSelected.remove(name);
      } else {
        _currentSelected.add(name);
      }
    });
    widget.onChanged(List<String>.from(_currentSelected));
  }

  Future<void> _openAddNewCategory([String? initialName]) async {
    final cubit = BlocProvider.of<WholesaleCubit>(context);
    final result = await showModalBottomSheet<String>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => BlocProvider.value(
        value: cubit,
        child: AddCategoryBottomSheet(initialName: initialName),
      ),
    );

    if (result != null && result.trim().isNotEmpty) {
      final newCatName = result.trim();
      setState(() {
        if (!_currentSelected.contains(newCatName)) {
          _currentSelected.add(newCatName);
        }
      });
      widget.onChanged(List<String>.from(_currentSelected));
    }
  }

  Widget _buildCategoryImage(String? imageUrl) {
    const double size = 38.0;

    Widget buildDefaultAvatar() {
      return Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          color: AppColors.primaryGlow.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(10),
        ),
        child: const Icon(
          LucideIcons.tag,
          color: AppColors.primaryGlow,
          size: 18,
        ),
      );
    }

    return SmartImageWidget(
      imageUrl: imageUrl,
      width: size,
      height: size,
      fit: BoxFit.cover,
      borderRadius: BorderRadius.circular(10),
      fallbackWidget: buildDefaultAvatar(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? const Color(0xFF161E2E) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF1E293B);
    final labelColor = isDark ? Colors.grey[400] : const Color(0xFF64748B);
    final inputBg = isDark ? const Color(0xFF111827) : const Color(0xFFF8FAFC);
    final borderColor = isDark ? const Color(0xFF1F2937) : const Color(0xFFE2E8F0);
    const primaryColor = Color(0xFF24B489);

    return BlocBuilder<WholesaleCubit, WholesaleState>(
      builder: (context, state) {
        final allCatObjects = state.categories;
        final stateCatNames = allCatObjects.map((c) => c.name).toSet();

        final extraNames = _currentSelected.where((name) => !stateCatNames.contains(name)).toList();

        final query = _searchQuery.trim().toLowerCase();

        final filteredStateCats = allCatObjects.where((cat) {
          if (query.isEmpty) return true;
          final matchName = cat.name.toLowerCase().contains(query);
          final matchBn = cat.nameBn?.toLowerCase().contains(query) ?? false;
          final matchAr = cat.nameAr?.toLowerCase().contains(query) ?? false;
          return matchName || matchBn || matchAr;
        }).toList();

        final filteredExtraNames = extraNames.where((name) {
          if (query.isEmpty) return true;
          return name.toLowerCase().contains(query);
        }).toList();

        final totalCount = filteredStateCats.length + filteredExtraNames.length;

        return Container(
          height: MediaQuery.of(context).size.height * 0.75,
          decoration: BoxDecoration(
            color: bgColor,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            children: [
              // Drag Handle
              const SizedBox(height: 12),
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: isDark ? Colors.grey[700] : Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 12),

              // Top Bar Header
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Select Category',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: textColor,
                            ),
                          ),
                          Text(
                            'Choose categories for this product',
                            style: TextStyle(
                              fontSize: 12,
                              color: labelColor,
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (_currentSelected.isNotEmpty)
                      TextButton(
                        onPressed: () {
                          setState(() {
                            _currentSelected.clear();
                          });
                          widget.onChanged([]);
                        },
                        child: const Text(
                          'Clear all',
                          style: TextStyle(color: Colors.redAccent, fontSize: 13),
                        ),
                      ),
                    IconButton(
                      icon: Icon(LucideIcons.x, color: labelColor, size: 20),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // Search Bar & Add Category Button Row
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Row(
                  children: [
                    // Search Bar Field
                    Expanded(
                      child: Container(
                        height: 46,
                        decoration: BoxDecoration(
                          color: inputBg,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: borderColor),
                        ),
                        child: TextField(
                          controller: _searchController,
                          style: TextStyle(color: textColor, fontSize: 14),
                          onChanged: (val) {
                            setState(() {
                              _searchQuery = val;
                            });
                          },
                          decoration: InputDecoration(
                            hintText: 'Search categories...',
                            hintStyle: TextStyle(color: labelColor, fontSize: 14),
                            prefixIcon: Icon(LucideIcons.search, size: 18, color: labelColor),
                            suffixIcon: _searchQuery.isNotEmpty
                                ? IconButton(
                                    icon: Icon(LucideIcons.x, size: 16, color: labelColor),
                                    onPressed: () {
                                      _searchController.clear();
                                      setState(() {
                                        _searchQuery = '';
                                      });
                                    },
                                  )
                                : null,
                            border: InputBorder.none,
                            contentPadding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    // Add Category Button
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: primaryColor,
                        foregroundColor: Colors.white,
                        elevation: 0,
                        minimumSize: const Size(0, 46),
                        padding: const EdgeInsets.symmetric(horizontal: 14),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      onPressed: () => _openAddNewCategory(_searchQuery.isNotEmpty ? _searchQuery : null),
                      icon: const Icon(LucideIcons.plus, size: 16),
                      label: const Text(
                        'Add Category',
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              const Divider(height: 1, thickness: 1),

              // Category List view
              Expanded(
                child: totalCount == 0
                    ? Center(
                        child: Padding(
                          padding: const EdgeInsets.all(24.0),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(LucideIcons.folderSearch, size: 48, color: labelColor),
                              const SizedBox(height: 12),
                              Text(
                                _searchQuery.isNotEmpty
                                    ? 'No category found matching "$_searchQuery"'
                                    : 'No categories available',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                  color: labelColor,
                                ),
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 16),
                              ElevatedButton.icon(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: primaryColor,
                                  foregroundColor: Colors.white,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                ),
                                onPressed: () => _openAddNewCategory(_searchQuery.isNotEmpty ? _searchQuery : null),
                                icon: const Icon(LucideIcons.plus, size: 16),
                                label: Text(
                                  _searchQuery.isNotEmpty ? 'Add "$_searchQuery" Category' : 'Add Category',
                                ),
                              ),
                            ],
                          ),
                        ),
                      )
                    : ListView(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        children: [
                          ...filteredStateCats.map((cat) {
                            final isSelected = _currentSelected.contains(cat.name);
                            final subTitleParts = <String>[];
                            if (cat.nameBn != null && cat.nameBn!.isNotEmpty) subTitleParts.add(cat.nameBn!);
                            if (cat.nameAr != null && cat.nameAr!.isNotEmpty) subTitleParts.add(cat.nameAr!);
                            final subTitle = subTitleParts.join(' · ');

                            return Container(
                              margin: const EdgeInsets.only(bottom: 6),
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? primaryColor.withValues(alpha: 0.08)
                                    : (isDark ? const Color(0xFF1F2937).withValues(alpha: 0.4) : const Color(0xFFF8FAFC)),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: isSelected ? primaryColor : borderColor,
                                  width: isSelected ? 1.5 : 1,
                                ),
                              ),
                              child: ListTile(
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                onTap: () => _toggleCategory(cat.name),
                                leading: _buildCategoryImage(cat.imageUrl),
                                title: Text(
                                  cat.name,
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                                    color: isSelected ? primaryColor : textColor,
                                  ),
                                ),
                                subtitle: subTitle.isNotEmpty
                                    ? Text(
                                        subTitle,
                                        style: TextStyle(fontSize: 12, color: labelColor),
                                      )
                                    : null,
                                trailing: Container(
                                  width: 24,
                                  height: 24,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: isSelected ? primaryColor : Colors.transparent,
                                    border: Border.all(
                                      color: isSelected ? primaryColor : labelColor!,
                                      width: 1.5,
                                    ),
                                  ),
                                  child: isSelected
                                      ? const Icon(LucideIcons.check, size: 14, color: Colors.white)
                                      : null,
                                ),
                              ),
                            );
                          }),
                          ...filteredExtraNames.map((name) {
                            final isSelected = _currentSelected.contains(name);
                            return Container(
                              margin: const EdgeInsets.only(bottom: 6),
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? primaryColor.withValues(alpha: 0.08)
                                    : (isDark ? const Color(0xFF1F2937).withValues(alpha: 0.4) : const Color(0xFFF8FAFC)),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: isSelected ? primaryColor : borderColor,
                                  width: isSelected ? 1.5 : 1,
                                ),
                              ),
                              child: ListTile(
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                onTap: () => _toggleCategory(name),
                                leading: _buildCategoryImage(null),
                                title: Text(
                                  name,
                                  style: TextStyle(
                                    fontSize: 14,
                                    fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                                    color: isSelected ? primaryColor : textColor,
                                  ),
                                ),
                                trailing: Container(
                                  width: 24,
                                  height: 24,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: isSelected ? primaryColor : Colors.transparent,
                                    border: Border.all(
                                      color: isSelected ? primaryColor : labelColor!,
                                      width: 1.5,
                                    ),
                                  ),
                                  child: isSelected
                                      ? const Icon(LucideIcons.check, size: 14, color: Colors.white)
                                      : null,
                                ),
                              ),
                            );
                          }),
                        ],
                      ),
              ),

              // Bottom Confirm / Done Bar
              Container(
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
                decoration: BoxDecoration(
                  color: bgColor,
                  border: Border(top: BorderSide(color: borderColor)),
                ),
                child: SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primaryColor,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(24),
                      ),
                      elevation: 0,
                    ),
                    onPressed: () => Navigator.pop(context),
                    child: Text(
                      _currentSelected.isNotEmpty
                          ? 'Done (${_currentSelected.length} selected)'
                          : 'Done',
                      style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
