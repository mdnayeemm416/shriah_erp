import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../core/theme/app_colors.dart';
import '../../common_widgets/empty_error_state_widgets.dart';
import '../../common_widgets/smart_image_widget.dart';
import '../../../../blocs/sales_management/sales_management_cubit.dart';
import '../../../../blocs/sales_management/sales_management_state.dart';
import '../../../../models/sales_visit_model.dart';
import 'package:toastification/toastification.dart';

class VisitHistoryDashboard extends StatefulWidget {
  final Color cardBg;
  final Color textColor;
  final Color? subtextColor;
  final Color borderColor;
  final bool isDark;

  const VisitHistoryDashboard({
    super.key,
    required this.cardBg,
    required this.textColor,
    required this.subtextColor,
    required this.borderColor,
    required this.isDark,
  });

  @override
  State<VisitHistoryDashboard> createState() => _VisitHistoryDashboardState();
}

class _VisitHistoryDashboardState extends State<VisitHistoryDashboard> {
  @override
  Widget build(BuildContext context) {
    return BlocBuilder<SalesManagementCubit, SalesManagementState>(
      builder: (context, state) {
        final selectedDate = state.selectedDate;

        // The list is already filtered by date from the API, so we show all returned records
        final dateRecords = List<VisitRecord>.from(state.visitRecords);

        // Sort by time ascending for gap calculations
        dateRecords.sort((a, b) => a.dateTime.compareTo(b.dateTime));

        final filteredRecords = dateRecords;

        // 2. Compute Statistics (use API summaryMetrics if available, fallback to client calculations)
        final summary = state.summaryMetrics;
        
        final totalVisits = summary?.totalVisits ?? filteredRecords.length;
        final uniqueShops = summary?.uniqueShops ?? filteredRecords.map((r) => r.shopName).toSet().length;
        final totalSale = summary?.totalReportedSale ?? filteredRecords.fold<double>(0.0, (sum, r) => sum + r.amount);

        double cashTotal = summary?.cashTotal ?? 0.0;
        double bankTotal = summary?.bankTotal ?? 0.0;
        double creditTotal = summary?.creditTotal ?? 0.0;
        int zeroSaleCount = summary?.zeroSaleCount ?? 0;

        if (summary == null) {
          for (final r in filteredRecords) {
            if (r.amount == 0) {
              zeroSaleCount++;
            }
            if (r.paymentType == 'Cash') {
              cashTotal += r.amount;
            } else if (r.paymentType == 'Bank') {
              bankTotal += r.amount;
            } else if (r.paymentType == 'Credit') {
              creditTotal += r.amount;
            } else if (r.paymentType == 'Partial') {
              cashTotal += r.cashAmount;
              bankTotal += r.bankAmount;
              creditTotal += r.creditAmount;
            }
          }
        }

        // Time stats
        String firstVisitTime = summary?.firstVisitTime ?? '--:--';
        String lastVisitTime = summary?.lastVisitTime ?? '--:--';
        String avgGapText = summary?.avgTimeBetweenShops ?? 'N/A';

        if (summary == null && dateRecords.isNotEmpty) {
          firstVisitTime = DateFormat('HH:mm').format(dateRecords.first.dateTime);
          lastVisitTime = DateFormat('HH:mm').format(dateRecords.last.dateTime);

          if (dateRecords.length > 1) {
            int totalDiffMinutes = 0;
            for (int i = 0; i < dateRecords.length - 1; i++) {
              totalDiffMinutes += dateRecords[i + 1]
                  .dateTime
                  .difference(dateRecords[i].dateTime)
                  .inMinutes;
            }
            final avgMinutes = totalDiffMinutes ~/ (dateRecords.length - 1);
            final hours = avgMinutes ~/ 60;
            final mins = avgMinutes % 60;
            avgGapText = hours > 0 ? '${hours}h ${mins}m' : '${mins}m';
          }
        }

        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // A. TOP BAR WITH DATE PICKER PILL
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'HISTORY & SUMMARY',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 0.5,
                    color: widget.subtextColor,
                  ),
                ),
                InkWell(
                  onTap: () async {
                    final newDate = await showDatePicker(
                      context: context,
                      initialDate: selectedDate,
                      firstDate: DateTime(2020),
                      lastDate: DateTime(2030),
                      builder: (context, child) {
                        return Theme(
                          data: widget.isDark ? ThemeData.dark() : ThemeData.light(),
                          child: child!,
                        );
                      },
                    );
                    if (newDate != null && context.mounted) {
                      context.read<SalesManagementCubit>().selectDate(newDate);
                    }
                  },
                  borderRadius: BorderRadius.circular(20),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEF3C7), // Soft yellow from screenshot
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFFF59E0B), width: 1.5),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(LucideIcons.calendar, size: 14, color: Color(0xFFD97706)),
                        const SizedBox(width: 6),
                        Text(
                          DateFormat('dd MMM').format(selectedDate),
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFFD97706),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // B. STATISTICS CAPSULES IN 3-COLUMN GRID
            Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  children: [
                    Expanded(child: _buildStatCard('SHOPS VISITED', totalVisits.toString())),
                    const SizedBox(width: 8),
                    Expanded(child: _buildStatCard('UNIQUE SHOPS', uniqueShops.toString())),
                    const SizedBox(width: 8),
                    Expanded(child: _buildStatCard('REPORTED SALE', totalSale.toStringAsFixed(2))),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(child: _buildStatCard('TOTAL CASH', cashTotal.toStringAsFixed(2))),
                    const SizedBox(width: 8),
                    Expanded(child: _buildStatCard('TOTAL BANK', bankTotal.toStringAsFixed(2))),
                    const SizedBox(width: 8),
                    Expanded(child: _buildStatCard('TOTAL CREDIT', creditTotal.toStringAsFixed(2))),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(child: _buildStatCard('ZERO-SALE VISITS', zeroSaleCount.toString())),
                    const SizedBox(width: 8),
                    Expanded(child: _buildStatCard('FIRST VISIT', firstVisitTime)),
                    const SizedBox(width: 8),
                    Expanded(child: _buildStatCard('LAST VISIT', lastVisitTime)),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Expanded(child: _buildStatCard('AVG. TIME\nBETWEEN SHOPS', avgGapText)),
                    const Expanded(child: SizedBox()),
                    const SizedBox(width: 8),
                    const Expanded(child: SizedBox()),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 24),

            // C. RECORDS LIST
            if (state.loading)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(32.0),
                  child: CircularProgressIndicator(color: AppColors.primary),
                ),
              )
            else if (state.error.isNotEmpty)
              BeautifulErrorStateWidget(
                message: state.error,
                onRetry: () {
                  context.read<SalesManagementCubit>().loadSalesVisits();
                },
              )
            else if (filteredRecords.isEmpty)
              const BeautifulEmptyStateWidget(
                icon: LucideIcons.folderOpen,
                title: 'No Visit Records',
                description: 'No field visit logs have been captured for this date.',
              )
            else
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: filteredRecords.length,
                separatorBuilder: (_, __) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final record = filteredRecords[index];
                  return _buildRecordCard(index + 1, record, filteredRecords);
                },
              ),
          ],
        );
      },
    );
  }

  Widget _buildStatCard(String label, String value) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
      decoration: BoxDecoration(
        color: widget.isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: widget.borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            label.toUpperCase(),
            style: TextStyle(
              fontSize: 8.5,
              fontWeight: FontWeight.bold,
              color: widget.subtextColor,
              letterSpacing: 0.5,
              height: 1.2,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.bold,
              color: widget.textColor,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildPaymentTypeChip(String type) {
    Color bg;
    Color fg;
    switch (type) {
      case 'No Sale':
        bg = const Color(0xFFFCE8E6);
        fg = const Color(0xFFC5221F);
        break;
      case 'Cash':
        bg = const Color(0xFFE6F4EA);
        fg = const Color(0xFF137333);
        break;
      case 'Bank':
        bg = const Color(0xFFE8F0FE);
        fg = const Color(0xFF1A73E8);
        break;
      case 'Credit':
        bg = const Color(0xFFFEF7E0);
        fg = const Color(0xFFB06000);
        break;
      default: // Partial / other
        bg = const Color(0xFFF3E8FF);
        fg = const Color(0xFF7E22CE);
        break;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        type,
        style: TextStyle(color: fg, fontSize: 10, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildStatusChip(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      decoration: BoxDecoration(
        color: widget.isDark ? Colors.white10 : const Color(0xFFF1F3F4),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: widget.isDark ? Colors.white70 : const Color(0xFF5F6368),
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Future<void> _launchMapsUrl(String shopLocation) async {
    try {
      if (shopLocation.trim().isEmpty) return;

      String query = '';
      if (shopLocation.contains('|')) {
        // Format: "24.7136,46.6753|Address" -> extract coordinates
        final parts = shopLocation.split('|');
        final coordPart = parts[0].trim();
        query = coordPart
            .replaceAll('° N', '')
            .replaceAll('° E', '')
            .replaceAll('°N', '')
            .replaceAll('°E', '')
            .replaceAll('Lat:', '')
            .replaceAll('Lon:', '')
            .replaceAll(' ', '');
      } else {
        // Clean up standard coordinate prefixes/symbols
        final clean = shopLocation
            .replaceAll('° N', '')
            .replaceAll('° E', '')
            .replaceAll('°N', '')
            .replaceAll('°E', '')
            .replaceAll('Lat:', '')
            .replaceAll('Lon:', '')
            .trim();

        // Check if the cleaned string is coordinate-like (numbers, dots, commas, minus, plus, spaces)
        final isCoordinates = RegExp(r'^[\d\s.,\-+]+$').hasMatch(clean);
        if (isCoordinates) {
          query = clean.replaceAll(' ', '');
        } else {
          // If it's a general address name, keep the spaces and pass it to maps
          query = shopLocation.trim();
        }
      }

      if (query.isEmpty) {
        query = '24.7136,46.6753'; // Default fallback
      }

      final uri = Uri.https('www.google.com', '/maps/search/', {
        'api': '1',
        'query': query,
      });

      // Try calling launchUrl directly first since canLaunchUrl might return false
      // due to missing OS query configurations on some platforms.
      try {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } catch (e) {
        // Fallback using canLaunchUrl just in case
        if (await canLaunchUrl(uri)) {
          await launchUrl(uri, mode: LaunchMode.externalApplication);
        } else {
          debugPrint('Could not launch maps URL: $uri, error: $e');
        }
      }
    } catch (e) {
      debugPrint('Error launching maps: $e');
    }
  }

  Widget _buildRecordCard(int index, VisitRecord record, List<VisitRecord> dateRecords) {
    final timeStr = DateFormat('HH:mm').format(record.dateTime);

    // Calculate time from previous shop
    String timeGapStr = 'First Visit of Day';
    if (index > 1) {
      final prevRecord = dateRecords[index - 2];
      final diff = record.dateTime.difference(prevRecord.dateTime);
      final diffInMinutes = diff.inMinutes;
      if (diffInMinutes < 60) {
        timeGapStr = 'Approx. Time from Previous Shop: $diffInMinutes minutes';
      } else {
        final hours = diffInMinutes ~/ 60;
        final mins = diffInMinutes % 60;
        timeGapStr = 'Approx. Time from Previous Shop: ${hours}h ${mins}m';
      }
    }

    // Parse location
    String addressStr = 'Address not captured';
    if (record.shopLocation.contains('|')) {
      final parts = record.shopLocation.split('|');
      addressStr = parts[1];
    } else {
      addressStr = record.shopLocation;
    }

    final isZeroSale = record.amount == 0;

    return Card(
      color: widget.cardBg,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: BorderSide(color: widget.borderColor),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Left Column: Index Circle
            Container(
              width: 32,
              height: 32,
              decoration: const BoxDecoration(
                color: AppColors.primaryGlow,
                shape: BoxShape.circle,
              ),
              child: Center(
                child: Text(
                  index.toString(),
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                ),
              ),
            ),
            const SizedBox(width: 14),

            // Middle Column: Content Details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title and Chips
                  Wrap(
                    crossAxisAlignment: WrapCrossAlignment.center,
                    spacing: 6,
                    runSpacing: 4,
                    children: [
                      Text(
                        record.shopName,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                      _buildPaymentTypeChip(isZeroSale ? 'No Sale' : record.paymentType),
                      _buildStatusChip('captured'),
                    ],
                  ),
                  const SizedBox(height: 6),

                  // Amount
                  Text(
                    '${record.amount.toStringAsFixed(2)} SAR',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: AppColors.primaryGlow,
                    ),
                  ),
                  const SizedBox(height: 6),

                  // Breakdown
                  Text(
                    'Cash ${record.cashAmount.toStringAsFixed(2)} · Bank ${record.bankAmount.toStringAsFixed(2)} · Credit ${record.creditAmount.toStringAsFixed(2)}',
                    style: TextStyle(fontSize: 11, color: widget.subtextColor),
                  ),
                  const SizedBox(height: 6),

                  // Notes
                  if (record.notes.isNotEmpty) ...[
                    Text(
                      '"${record.notes}"',
                      style: TextStyle(
                        fontSize: 12,
                        fontStyle: FontStyle.italic,
                        color: widget.isDark ? Colors.white70 : Colors.grey[800],
                      ),
                    ),
                    const SizedBox(height: 6),
                  ],

                  // Clock & time from previous
                  Row(
                    children: [
                      Icon(LucideIcons.clock, size: 12, color: widget.subtextColor),
                      const SizedBox(width: 4),
                      Expanded(
                        child: Text(
                          '$timeStr · $timeGapStr',
                          style: TextStyle(fontSize: 11, color: widget.subtextColor),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),

                  // Address
                  Text(
                    addressStr,
                    style: TextStyle(fontSize: 11, color: widget.subtextColor),
                  ),
                  const SizedBox(height: 8),

                  // Actions: Open in Google Maps & Delete Visit Log
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      InkWell(
                        onTap: () => _launchMapsUrl(record.shopLocation),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(LucideIcons.externalLink, size: 14, color: AppColors.primary),
                            SizedBox(width: 4),
                            Text(
                              'Open in Google Maps',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: AppColors.primary,
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        constraints: const BoxConstraints(),
                        padding: EdgeInsets.zero,
                        icon: const Icon(LucideIcons.trash2, size: 16, color: Colors.redAccent),
                        onPressed: () => _showDeleteConfirmDialog(context, record),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),

            // Right Column: Shop Photo Preview
            SmartImageWidget(
              imageUrl: record.photoPath,
              width: 80,
              height: 80,
              fit: BoxFit.cover,
              borderRadius: BorderRadius.circular(16),
              fallbackWidget: Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: widget.isDark ? Colors.white10 : const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: widget.borderColor),
                ),
                child: const Icon(LucideIcons.image, size: 24, color: Colors.white24),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showDeleteConfirmDialog(BuildContext context, VisitRecord record) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Visit Log', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        content: Text('Are you sure you want to delete the field visit log for "${record.shopName}"? This action cannot be undone.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            onPressed: () {
              Navigator.pop(ctx);
              context.read<SalesManagementCubit>().deleteVisitRecord(record.id).then((_) {
                toastification.show(
                  context: context,
                  type: ToastificationType.success,
                  style: ToastificationStyle.flatColored,
                  title: const Text('Success'),
                  description: const Text('Field visit record deleted successfully.'),
                  autoCloseDuration: const Duration(seconds: 4),
                  showProgressBar: true,
                );
              }).catchError((e) {
                toastification.show(
                  context: context,
                  type: ToastificationType.error,
                  style: ToastificationStyle.flatColored,
                  title: const Text('Delete Failed'),
                  description: Text(e.toString().replaceFirst('Exception: ', '')),
                  autoCloseDuration: const Duration(seconds: 4),
                  showProgressBar: true,
                );
              });
            },
            child: const Text('Delete', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
