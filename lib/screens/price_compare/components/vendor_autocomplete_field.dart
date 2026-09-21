import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../blocs/price_compare/price_compare_cubit.dart';
import '../../../core/theme/app_colors.dart';

class VendorAutocompleteField extends StatefulWidget {
  final TextEditingController controller;
  final List<String>? suggestions;
  final String hintText;
  final ValueChanged<String>? onSelected;
  final ValueChanged<String>? onChanged;

  const VendorAutocompleteField({
    super.key,
    required this.controller,
    this.suggestions,
    this.hintText = 'Search or type new company',
    this.onSelected,
    this.onChanged,
  });

  @override
  State<VendorAutocompleteField> createState() => _VendorAutocompleteFieldState();
}

class _VendorAutocompleteFieldState extends State<VendorAutocompleteField> {
  final FocusNode _focusNode = FocusNode();
  List<String> _filtered = [];
  bool _showDropdown = false;

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(_handleFocusChanged);
    widget.controller.addListener(_handleTextChanged);
  }

  @override
  void dispose() {
    _focusNode.removeListener(_handleFocusChanged);
    widget.controller.removeListener(_handleTextChanged);
    _focusNode.dispose();
    super.dispose();
  }

  List<String> _getAllSuggestions() {
    if (widget.suggestions != null && widget.suggestions!.isNotEmpty) {
      return widget.suggestions!;
    }
    try {
      final cubit = context.read<PriceCompareCubit>();
      final set = <String>{};
      for (final v in cubit.state.vendors) {
        if (v.vendorName.trim().isNotEmpty) set.add(v.vendorName.trim());
      }
      for (final p in cubit.state.products) {
        if (p.analysis?.uniqueVendors != null) {
          for (final uv in p.analysis!.uniqueVendors) {
            if (uv.trim().isNotEmpty) set.add(uv.trim());
          }
        }
        for (final h in p.history) {
          if (h.vendorName.trim().isNotEmpty) set.add(h.vendorName.trim());
        }
      }
      final list = set.toList()..sort((a, b) => a.toLowerCase().compareTo(b.toLowerCase()));
      return list;
    } catch (_) {
      return [];
    }
  }

  void _handleFocusChanged() {
    if (!_focusNode.hasFocus) {
      // Small delay to allow tap on suggestion to fire before dropdown hides
      Future.delayed(const Duration(milliseconds: 180), () {
        if (mounted && !_focusNode.hasFocus) {
          setState(() {
            _showDropdown = false;
          });
        }
      });
    } else {
      _filterList(widget.controller.text);
    }
  }

  void _handleTextChanged() {
    _filterList(widget.controller.text);
  }

  void _filterList(String text) {
    final query = text.trim();
    if (query.isEmpty || !_focusNode.hasFocus) {
      if (_showDropdown) {
        setState(() {
          _filtered = [];
          _showDropdown = false;
        });
      }
      return;
    }

    final all = _getAllSuggestions();
    final matches = all.where((s) {
      return s.toLowerCase().contains(query.toLowerCase()) &&
          s.toLowerCase() != query.toLowerCase();
    }).toList();

    setState(() {
      _filtered = matches;
      _showDropdown = matches.isNotEmpty;
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          height: 48,
          decoration: BoxDecoration(
            color: isDark ? AppColors.inputDark : Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: _focusNode.hasFocus
                  ? const Color(0xFF23B386)
                  : (isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
            ),
          ),
          child: TextField(
            controller: widget.controller,
            focusNode: _focusNode,
            style: TextStyle(color: isDark ? AppColors.fgDark : const Color(0xFF0F172A)),
            onChanged: (val) {
              if (widget.onChanged != null) {
                widget.onChanged!(val);
              }
            },
            decoration: InputDecoration(
              hintText: widget.hintText,
              hintStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              suffixIcon: widget.controller.text.isNotEmpty
                  ? IconButton(
                      icon: const Icon(LucideIcons.x, size: 16, color: Color(0xFF94A3B8)),
                      onPressed: () {
                        widget.controller.clear();
                        if (widget.onChanged != null) {
                          widget.onChanged!('');
                        }
                      },
                      splashRadius: 16,
                    )
                  : null,
            ),
          ),
        ),
        if (_showDropdown && _filtered.isNotEmpty)
          Container(
            margin: const EdgeInsets.only(top: 6),
            constraints: const BoxConstraints(maxHeight: 180),
            decoration: BoxDecoration(
              color: isDark ? AppColors.popoverDark : Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: isDark ? AppColors.borderDark : const Color(0xFFE2E8F0)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: isDark ? 0.3 : 0.06),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(14),
              child: ListView.separated(
                shrinkWrap: true,
                padding: EdgeInsets.zero,
                itemCount: _filtered.length,
                separatorBuilder: (_, __) => Divider(
                  height: 1,
                  color: isDark ? AppColors.borderDark : const Color(0xFFF1F5F9),
                ),
                itemBuilder: (context, idx) {
                  final vendorName = _filtered[idx];
                  return Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: () {
                        widget.controller.text = vendorName;
                        widget.controller.selection = TextSelection.fromPosition(
                          TextPosition(offset: vendorName.length),
                        );
                        setState(() {
                          _showDropdown = false;
                        });
                        _focusNode.unfocus();
                        if (widget.onSelected != null) {
                          widget.onSelected!(vendorName);
                        }
                        if (widget.onChanged != null) {
                          widget.onChanged!(vendorName);
                        }
                      },
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
                        child: Row(
                          children: [
                            Container(
                              width: 26,
                              height: 26,
                              decoration: BoxDecoration(
                                color: isDark ? const Color(0xFF064E3B).withValues(alpha: 0.4) : const Color(0xFFE8F7F2),
                                shape: BoxShape.circle,
                              ),
                              child: const Center(
                                child: Icon(LucideIcons.building2, size: 13, color: Color(0xFF23B386)),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                vendorName,
                                style: TextStyle(
                                  fontSize: 13.5,
                                  fontWeight: FontWeight.w600,
                                  color: isDark ? AppColors.fgDark : const Color(0xFF1E293B),
                                ),
                              ),
                            ),
                            const Icon(LucideIcons.arrowUpLeft, size: 14, color: Color(0xFF94A3B8)),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
      ],
    );
  }
}
