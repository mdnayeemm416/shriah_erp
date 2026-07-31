import 'dart:io';
import 'package:flutter/material.dart';
import '../../core/api/api_client.dart';

ImageProvider getSmartImageProvider(String path) {
  final trimmed = path.trim();
  if (trimmed.isEmpty) {
    return const AssetImage('');
  }

  String? localPath;
  if (trimmed.startsWith('file://')) {
    try {
      localPath = Uri.parse(trimmed).toFilePath();
    } catch (_) {
      localPath = trimmed.replaceFirst('file://', '');
    }
  } else if (trimmed.startsWith('/data/') ||
      trimmed.startsWith('/storage/') ||
      trimmed.startsWith('/sdcard/') ||
      trimmed.startsWith('/var/') ||
      trimmed.startsWith('/Users/') ||
      trimmed.startsWith('/private/')) {
    localPath = trimmed;
  }

  if (localPath != null) {
    final file = File(localPath);
    if (file.existsSync()) {
      return FileImage(file);
    }
  }

  try {
    final file = File(trimmed);
    if (file.existsSync()) {
      return FileImage(file);
    }
  } catch (_) {}

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return NetworkImage(trimmed);
  }

  if (trimmed.startsWith('file:')) {
    return const AssetImage('');
  }

  const base = ApiClient.baseUrl;
  final fullUrl = trimmed.startsWith('/') ? '$base$trimmed' : '$base/$trimmed';
  return NetworkImage(fullUrl);
}

class SmartImageWidget extends StatelessWidget {
  final String? imageUrl;
  final double? width;
  final double? height;
  final BoxFit fit;
  final BorderRadiusGeometry? borderRadius;
  final Widget fallbackWidget;

  const SmartImageWidget({
    super.key,
    required this.imageUrl,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.borderRadius,
    required this.fallbackWidget,
  });

  @override
  Widget build(BuildContext context) {
    if (imageUrl == null || imageUrl!.trim().isEmpty) {
      return fallbackWidget;
    }

    final trimmed = imageUrl!.trim();

    // 1. Handle Local Device File Paths (Gallery, Camera, Cache)
    String? localFilePath;
    if (trimmed.startsWith('file://')) {
      try {
        localFilePath = Uri.parse(trimmed).toFilePath();
      } catch (_) {
        localFilePath = trimmed.replaceFirst('file://', '');
      }
    } else if (trimmed.startsWith('/data/') ||
        trimmed.startsWith('/storage/') ||
        trimmed.startsWith('/sdcard/') ||
        trimmed.startsWith('/var/') ||
        trimmed.startsWith('/Users/') ||
        trimmed.startsWith('/private/')) {
      localFilePath = trimmed;
    }

    if (localFilePath != null) {
      final file = File(localFilePath);
      if (file.existsSync()) {
        final img = Image.file(
          file,
          width: width,
          height: height,
          fit: fit,
          errorBuilder: (_, __, ___) => fallbackWidget,
        );
        return borderRadius != null ? ClipRRect(borderRadius: borderRadius!, child: img) : img;
      } else {
        // Local file path was provided but file doesn't exist.
        // DO NOT send HTTP request to API server! Show fallback icon directly.
        return fallbackWidget;
      }
    }

    try {
      final file = File(trimmed);
      if (file.existsSync()) {
        final img = Image.file(
          file,
          width: width,
          height: height,
          fit: fit,
          errorBuilder: (_, __, ___) => fallbackWidget,
        );
        return borderRadius != null ? ClipRRect(borderRadius: borderRadius!, child: img) : img;
      }
    } catch (_) {}

    if (trimmed.startsWith('file:')) {
      return fallbackWidget;
    }

    // 2. Handle Network / API Response URLs
    String fullUrl;
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      fullUrl = trimmed;
    } else {
      const base = ApiClient.baseUrl;
      fullUrl = trimmed.startsWith('/') ? '$base$trimmed' : '$base/$trimmed';
    }

    final img = Image.network(
      fullUrl,
      width: width,
      height: height,
      fit: fit,
      errorBuilder: (context, error, stackTrace) {
        return fallbackWidget;
      },
    );

    return borderRadius != null ? ClipRRect(borderRadius: borderRadius!, child: img) : img;
  }
}
