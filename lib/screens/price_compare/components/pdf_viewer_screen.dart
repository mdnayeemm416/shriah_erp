import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../core/api/api_client.dart';
import '../../../core/theme/app_colors.dart';
import '../../common_widgets/smart_image_widget.dart';

class PdfViewerScreen extends StatefulWidget {
  final String urlOrPath;
  final String title;

  const PdfViewerScreen({
    super.key,
    required this.urlOrPath,
    required this.title,
  });

  @override
  State<PdfViewerScreen> createState() => _PdfViewerScreenState();
}

class _PdfViewerScreenState extends State<PdfViewerScreen> {
  bool _isLoading = true;
  String? _errorMessage;
  Uint8List? _pdfBytes;
  Uint8List? _rawImageBytes;
  bool _isImage = false;
  bool _showRawImage = false;

  @override
  void initState() {
    super.initState();
    _loadPdf();
  }

  bool _isLocalFile(String path) {
    final trimmed = path.trim();
    if (trimmed.startsWith('file://')) return true;
    if (trimmed.startsWith('/data/') ||
        trimmed.startsWith('/storage/') ||
        trimmed.startsWith('/sdcard/') ||
        trimmed.startsWith('/var/') ||
        trimmed.startsWith('/Users/') ||
        trimmed.startsWith('/private/')) {
      return true;
    }
    try {
      if (File(trimmed).existsSync()) return true;
    } catch (_) {}
    return false;
  }

  String get _fileName {
    final parts = widget.urlOrPath.split('/');
    if (parts.isNotEmpty && parts.last.isNotEmpty) {
      final name = parts.last.split('?').first;
      if (name.toLowerCase().endsWith('.pdf')) return name;
      return '$name.pdf';
    }
    return 'document.pdf';
  }

  bool _isImageBytes(Uint8List bytes) {
    if (bytes.length < 4) return false;
    // JPEG (FF D8 FF)
    if (bytes[0] == 0xFF && bytes[1] == 0xD8 && bytes[2] == 0xFF) return true;
    // PNG (89 50 4E 47)
    if (bytes[0] == 0x89 && bytes[1] == 0x50 && bytes[2] == 0x4E && bytes[3] == 0x47) return true;
    // GIF (47 49 46 38)
    if (bytes[0] == 0x47 && bytes[1] == 0x49 && bytes[2] == 0x46 && bytes[3] == 0x38) return true;
    // WEBP (RIFF....WEBP)
    if (bytes.length > 12 &&
        bytes[0] == 0x52 && bytes[1] == 0x49 && bytes[2] == 0x46 && bytes[3] == 0x46 &&
        bytes[8] == 0x57 && bytes[9] == 0x45 && bytes[10] == 0x42 && bytes[11] == 0x50) {
      return true;
    }
    // BMP (BM)
    if (bytes[0] == 0x42 && bytes[1] == 0x4D) return true;
    return false;
  }

  bool _isValidPdfBytes(Uint8List bytes) {
    if (bytes.length < 5) return false;
    final checkLen = bytes.length < 1024 ? bytes.length : 1024;
    for (int i = 0; i < checkLen - 4; i++) {
      if (bytes[i] == 0x25 && // %
          bytes[i + 1] == 0x50 && // P
          bytes[i + 2] == 0x44 && // D
          bytes[i + 3] == 0x46) { // F
        return true;
      }
    }
    return false;
  }

  Future<Uint8List> _convertImageToPdf(Uint8List imgBytes) async {
    final doc = pw.Document();
    final image = pw.MemoryImage(imgBytes);
    doc.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(16),
        build: (pw.Context context) {
          return pw.Center(
            child: pw.Image(image, fit: pw.BoxFit.contain),
          );
        },
      ),
    );
    return await doc.save();
  }

  Future<void> _loadPdf() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _isImage = false;
      _rawImageBytes = null;
      _showRawImage = false;
    });

    try {
      final trimmed = widget.urlOrPath.trim();
      if (trimmed.isEmpty) {
        throw Exception('File path or URL is empty');
      }

      Uint8List? rawBytes;

      if (_isLocalFile(trimmed)) {
        String localPath = trimmed;
        if (localPath.startsWith('file://')) {
          try {
            localPath = Uri.parse(localPath).toFilePath();
          } catch (_) {
            localPath = localPath.replaceFirst('file://', '');
          }
        }
        final file = File(localPath);
        if (await file.exists()) {
          rawBytes = await file.readAsBytes();
        } else {
          throw Exception('Local file does not exist at $localPath');
        }
      } else {
        // Network URL
        final fullUrl = resolveImageUrl(trimmed);
        final token = ApiClient().token;
        final headers = <String, dynamic>{
          'Accept': '*/*',
        };
        if (token != null && token.isNotEmpty) {
          headers['Authorization'] = 'Bearer $token';
        }

        try {
          final response = await ApiClient().dio.get<List<int>>(
            fullUrl,
            options: Options(
              responseType: ResponseType.bytes,
              headers: headers,
            ),
          );
          if (response.data != null && response.data!.isNotEmpty) {
            rawBytes = Uint8List.fromList(response.data!);
          }
        } catch (dioError) {
          // Fallback with clean Dio instance
          final cleanDio = Dio(
            BaseOptions(
              connectTimeout: const Duration(seconds: 15),
              receiveTimeout: const Duration(seconds: 30),
            ),
          );
          final response = await cleanDio.get<List<int>>(
            fullUrl,
            options: Options(
              responseType: ResponseType.bytes,
              headers: headers,
            ),
          );
          if (response.data != null && response.data!.isNotEmpty) {
            rawBytes = Uint8List.fromList(response.data!);
          } else {
            throw Exception('Unable to retrieve file data: $dioError');
          }
        }
      }

      if (rawBytes == null || rawBytes.isEmpty) {
        throw Exception('Received empty file data');
      }

      // Check content format
      if (_isImageBytes(rawBytes)) {
        // The file is an image (JPG, PNG, WEBP, etc.)
        _rawImageBytes = rawBytes;
        _isImage = true;
        try {
          final convertedPdf = await _convertImageToPdf(rawBytes);
          if (mounted) {
            setState(() {
              _pdfBytes = convertedPdf;
              _isLoading = false;
            });
          }
          return;
        } catch (_) {
          // If PDF conversion fails, show raw image directly
          if (mounted) {
            setState(() {
              _showRawImage = true;
              _isLoading = false;
            });
          }
          return;
        }
      }

      if (_isValidPdfBytes(rawBytes)) {
        // Valid PDF document
        if (mounted) {
          setState(() {
            _pdfBytes = rawBytes;
            _isLoading = false;
          });
        }
        return;
      }

      // Neither PDF nor Image: check if server returned JSON or HTML error
      String errorMsg = 'The file is not a valid PDF or image document.';
      try {
        final text = utf8.decode(rawBytes);
        final trimmedText = text.trim();
        if (trimmedText.startsWith('{') || trimmedText.startsWith('[')) {
          final decoded = jsonDecode(trimmedText);
          if (decoded is Map && decoded['message'] != null) {
            errorMsg = decoded['message'].toString();
          }
        } else if (trimmedText.toLowerCase().contains('<html') || trimmedText.toLowerCase().contains('404')) {
          errorMsg = 'File not found or inaccessible on the server (404).';
        }
      } catch (_) {}

      throw Exception(errorMsg);
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = e.toString().replaceFirst('Exception: ', '');
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _openExternal() async {
    try {
      final trimmed = widget.urlOrPath.trim();
      if (_isLocalFile(trimmed)) {
        if (_pdfBytes != null) {
          await Printing.sharePdf(
            bytes: _pdfBytes!,
            filename: _fileName,
          );
        }
        return;
      }

      final fullUrl = resolveImageUrl(trimmed);
      final uri = Uri.parse(fullUrl);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Could not open external viewer')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error opening file: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? AppColors.bgDark : const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(
          widget.title,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
          ),
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
        backgroundColor: isDark ? AppColors.bgDark : Colors.white,
        foregroundColor: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          if (_isImage && _rawImageBytes != null)
            IconButton(
              icon: Icon(
                _showRawImage ? LucideIcons.fileText : LucideIcons.image,
                size: 20,
              ),
              tooltip: _showRawImage ? 'View as PDF Document' : 'View Full Image',
              onPressed: () {
                setState(() {
                  _showRawImage = !_showRawImage;
                });
              },
            ),
          IconButton(
            icon: const Icon(LucideIcons.externalLink, size: 20),
            tooltip: 'Open in Browser / External App',
            onPressed: _openExternal,
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: _buildBody(isDark),
    );
  }

  Widget _buildBody(bool isDark) {
    if (_isLoading) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const CircularProgressIndicator(color: Color(0xFF23B386)),
            const SizedBox(height: 16),
            Text(
              'Loading document...',
              style: TextStyle(
                fontSize: 14,
                color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              _fileName,
              style: TextStyle(
                fontSize: 12,
                color: isDark ? AppColors.mutedFgDark : const Color(0xFF94A3B8),
              ),
            ),
          ],
        ),
      );
    }

    if (_errorMessage != null || (_pdfBytes == null && _rawImageBytes == null)) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(28),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF7F1D1D).withValues(alpha: 0.3) : const Color(0xFFFEE2E2),
                  shape: BoxShape.circle,
                ),
                child: const Icon(LucideIcons.alertCircle, size: 40, color: Color(0xFFEF4444)),
              ),
              const SizedBox(height: 16),
              Text(
                'Failed to load document',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                _errorMessage ?? 'Unknown error occurred while downloading the document.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 12.5,
                  color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B),
                ),
                maxLines: 4,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                      side: BorderSide(color: isDark ? AppColors.borderDark : const Color(0xFFCBD5E1)),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    ),
                    onPressed: _loadPdf,
                    icon: const Icon(LucideIcons.refreshCw, size: 16),
                    label: const Text('Retry'),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF23B386),
                      foregroundColor: Colors.white,
                      elevation: 0,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    ),
                    onPressed: _openExternal,
                    icon: const Icon(LucideIcons.externalLink, size: 16),
                    label: const Text('Open Externally'),
                  ),
                ],
              ),
            ],
          ),
        ),
      );
    }

    if (_showRawImage && _rawImageBytes != null) {
      return Container(
        color: isDark ? AppColors.bgDark : const Color(0xFF0F172A),
        child: InteractiveViewer(
          minScale: 0.5,
          maxScale: 4.0,
          child: Center(
            child: Image.memory(
              _rawImageBytes!,
              fit: BoxFit.contain,
              errorBuilder: (_, __, ___) => Center(
                child: Text(
                  'Failed to render image',
                  style: TextStyle(color: isDark ? AppColors.fgDark : Colors.white),
                ),
              ),
            ),
          ),
        ),
      );
    }

    return PdfPreview(
      build: (format) => _pdfBytes!,
      pdfFileName: _fileName,
      allowPrinting: true,
      allowSharing: true,
      canChangePageFormat: false,
      canChangeOrientation: false,
      canDebug: false,
      maxPageWidth: 720,
      loadingWidget: const Center(
        child: CircularProgressIndicator(color: Color(0xFF23B386)),
      ),
      onError: (context, error) => Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(LucideIcons.alertCircle, size: 40, color: Color(0xFFEF4444)),
              const SizedBox(height: 12),
              Text(
                'Could not render PDF preview on this device',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                  color: isDark ? AppColors.fgDark : const Color(0xFF0F172A),
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'The document format may not be supported by the native PDF renderer. You can open it in an external app or browser.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12.5, color: isDark ? AppColors.mutedFgDark : const Color(0xFF64748B)),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF23B386),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
                onPressed: _openExternal,
                icon: const Icon(LucideIcons.externalLink, size: 16),
                label: const Text('Open with External Viewer'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
