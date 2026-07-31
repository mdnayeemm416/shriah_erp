import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_colors.dart';
import '../../../services/online_image_search_service.dart';
import '../../common_widgets/smart_image_widget.dart';

class OnlineImageSearchDialog extends StatefulWidget {
  final String initialQuery;
  final int maxAllowed;

  const OnlineImageSearchDialog({
    super.key,
    required this.initialQuery,
    this.maxAllowed = 6,
  });

  @override
  State<OnlineImageSearchDialog> createState() => _OnlineImageSearchDialogState();
}

class _OnlineImageSearchDialogState extends State<OnlineImageSearchDialog> {
  late final TextEditingController _searchController;
  bool _isLoading = false;
  List<SearchResultImage> _results = [];
  final Set<String> _selectedUrls = {};
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _searchController = TextEditingController(text: widget.initialQuery);
    _performSearch(widget.initialQuery);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _performSearch(String query) async {
    final cleanQuery = query.trim();
    if (cleanQuery.isEmpty) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final results = await OnlineImageSearchService.searchImages(cleanQuery);
      if (mounted) {
        setState(() {
          _results = results;
          _isLoading = false;
          if (results.isEmpty) {
            _errorMessage = 'No online images found for "$cleanQuery".';
          }
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _errorMessage = 'Failed to fetch online images. Please try again or paste a direct image URL.';
        });
      }
    }
  }

  void _showCustomUrlDialog() {
    final urlController = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Enter Custom Image URL', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        content: TextField(
          controller: urlController,
          autofocus: true,
          decoration: const InputDecoration(
            hintText: 'https://example.com/image.jpg',
            labelText: 'Image URL',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              final url = urlController.text.trim();
              if (url.isNotEmpty) {
                Navigator.pop(ctx);
                Navigator.pop(context, [url]);
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF24B489),
              foregroundColor: Colors.white,
            ),
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final bgColor = isDark ? AppColors.cardDark : const Color(0xFFF8FAFC);
    final cardBg = isDark ? const Color(0xFF111827) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF1E293B);
    final hintColor = isDark ? const Color(0xFF64748B) : const Color(0xFF94A3B8);
    final borderColor = isDark ? const Color(0xFF1F2937) : const Color(0xFFE2E8F0);
    const primaryColor = Color(0xFF24B489);

    return Dialog(
      backgroundColor: bgColor,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 620, maxHeight: 680),
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 12, 12),
              child: Row(
                children: [
                  const Icon(LucideIcons.sparkles, color: primaryColor, size: 22),
                  const SizedBox(width: 10),
                  const Expanded(
                    child: Text(
                      'Find Product Images Online',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                  ),
                  IconButton(
                    icon: Icon(LucideIcons.x, color: hintColor, size: 20),
                    onPressed: () => Navigator.pop(context),
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                ],
              ),
            ),
            const Divider(height: 1, thickness: 1),

            // Search Bar Section
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      height: 46,
                      decoration: BoxDecoration(
                        color: cardBg,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: borderColor),
                      ),
                      child: TextField(
                        controller: _searchController,
                        style: TextStyle(color: textColor, fontSize: 14),
                        textInputAction: TextInputAction.search,
                        onSubmitted: (val) => _performSearch(val),
                        decoration: InputDecoration(
                          hintText: 'Search product images...',
                          hintStyle: TextStyle(color: hintColor, fontSize: 13),
                          prefixIcon: Icon(LucideIcons.search, size: 18, color: hintColor),
                          suffixIcon: _searchController.text.isNotEmpty
                              ? IconButton(
                                  icon: Icon(LucideIcons.x, size: 16, color: hintColor),
                                  onPressed: () {
                                    _searchController.clear();
                                    setState(() {});
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
                  ElevatedButton(
                    onPressed: _isLoading ? null : () => _performSearch(_searchController.text),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primaryColor,
                      foregroundColor: Colors.white,
                      minimumSize: const Size(0, 46),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      elevation: 0,
                    ),
                    child: const Text('Search', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),

            // Results Section
            Expanded(
              child: _isLoading
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const CircularProgressIndicator(color: primaryColor),
                          const SizedBox(height: 16),
                          Text(
                            'Searching online images for "${_searchController.text.trim()}"...',
                            style: TextStyle(color: hintColor, fontSize: 13),
                          ),
                        ],
                      ),
                    )
                  : _errorMessage != null
                      ? Center(
                          child: Padding(
                            padding: const EdgeInsets.all(24.0),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(LucideIcons.imageOff, size: 48, color: hintColor),
                                const SizedBox(height: 12),
                                Text(
                                  _errorMessage!,
                                  textAlign: TextAlign.center,
                                  style: TextStyle(color: hintColor, fontSize: 14),
                                ),
                                const SizedBox(height: 16),
                                OutlinedButton.icon(
                                  onPressed: _showCustomUrlDialog,
                                  icon: const Icon(LucideIcons.link, size: 16),
                                  label: const Text('Paste Image URL Manually'),
                                  style: OutlinedButton.styleFrom(
                                    foregroundColor: primaryColor,
                                    side: const BorderSide(color: primaryColor),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        )
                      : LayoutBuilder(
                          builder: (context, constraints) {
                            final crossAxisCount = constraints.maxWidth > 480 ? 3 : 2;
                            return GridView.builder(
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: crossAxisCount,
                                crossAxisSpacing: 12,
                                mainAxisSpacing: 12,
                                childAspectRatio: 0.85,
                              ),
                              itemCount: _results.length,
                              itemBuilder: (context, index) {
                                final item = _results[index];
                                final isSelected = _selectedUrls.contains(item.url);

                                return GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      if (isSelected) {
                                        _selectedUrls.remove(item.url);
                                      } else {
                                        if (_selectedUrls.length >= widget.maxAllowed) {
                                          ScaffoldMessenger.of(context).showSnackBar(
                                            SnackBar(
                                              content: Text('Maximum ${widget.maxAllowed} images can be selected.'),
                                            ),
                                          );
                                          return;
                                        }
                                        _selectedUrls.add(item.url);
                                      }
                                    });
                                  },
                                  child: AnimatedContainer(
                                    duration: const Duration(milliseconds: 150),
                                    decoration: BoxDecoration(
                                      color: cardBg,
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(
                                        color: isSelected ? primaryColor : borderColor,
                                        width: isSelected ? 2.5 : 1.0,
                                      ),
                                      boxShadow: isSelected
                                          ? [
                                              BoxShadow(
                                                color: primaryColor.withValues(alpha: 0.2),
                                                blurRadius: 8,
                                                spreadRadius: 1,
                                              )
                                            ]
                                          : null,
                                    ),
                                    child: ClipRRect(
                                      borderRadius: BorderRadius.circular(14),
                                      child: Stack(
                                        fit: StackFit.expand,
                                        children: [
                                          SmartImageWidget(
                                            imageUrl: item.url,
                                            fit: BoxFit.cover,
                                            fallbackWidget: Container(
                                              color: isDark ? Colors.grey[800] : Colors.grey[200],
                                              child: Column(
                                                mainAxisAlignment: MainAxisAlignment.center,
                                                children: [
                                                  Icon(LucideIcons.image, color: hintColor, size: 28),
                                                  const SizedBox(height: 4),
                                                  Text(
                                                    'Preview unavailable',
                                                    textAlign: TextAlign.center,
                                                    style: TextStyle(fontSize: 10, color: hintColor),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                          // Title/Source overlay at bottom
                                          Positioned(
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            child: Container(
                                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                              decoration: const BoxDecoration(
                                                gradient: LinearGradient(
                                                  begin: Alignment.bottomCenter,
                                                  end: Alignment.topCenter,
                                                  colors: [Colors.black87, Colors.transparent],
                                                ),
                                              ),
                                              child: Text(
                                                item.source,
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                                style: const TextStyle(
                                                  color: Colors.white,
                                                  fontSize: 10,
                                                  fontWeight: FontWeight.w500,
                                                ),
                                              ),
                                            ),
                                          ),
                                          // Checkmark Badge
                                          Positioned(
                                            top: 8,
                                            right: 8,
                                            child: Container(
                                              width: 26,
                                              height: 26,
                                              decoration: BoxDecoration(
                                                color: isSelected ? primaryColor : Colors.black38,
                                                shape: BoxShape.circle,
                                                border: Border.all(color: Colors.white, width: 1.5),
                                              ),
                                              child: Icon(
                                                isSelected ? LucideIcons.check : LucideIcons.plus,
                                                color: Colors.white,
                                                size: 14,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                );
                              },
                            );
                          },
                        ),
            ),

            const Divider(height: 1, thickness: 1),

            // Footer Actions
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Wrap(
                alignment: WrapAlignment.spaceBetween,
                crossAxisAlignment: WrapCrossAlignment.center,
                spacing: 8,
                runSpacing: 8,
                children: [
                  TextButton.icon(
                    onPressed: _showCustomUrlDialog,
                    icon: const Icon(LucideIcons.link, size: 16),
                    label: const Text('Custom URL'),
                    style: TextButton.styleFrom(foregroundColor: hintColor),
                  ),
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Cancel'),
                  ),
                  ElevatedButton(
                    onPressed: _selectedUrls.isEmpty
                        ? null
                        : () {
                            Navigator.pop(context, _selectedUrls.toList());
                          },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: primaryColor,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    ),
                    child: Text(
                      _selectedUrls.isEmpty
                          ? 'Select Images'
                          : 'Add Selected (${_selectedUrls.length})',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
