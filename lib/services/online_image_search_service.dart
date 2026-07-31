import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

class SearchResultImage {
  final String url;
  final String thumbnailUrl;
  final String title;
  final String source;

  SearchResultImage({
    required this.url,
    required this.thumbnailUrl,
    required this.title,
    required this.source,
  });
}

class OnlineImageSearchService {
  static final Dio _dio = Dio(
    BaseOptions(
      connectTimeout: const Duration(seconds: 8),
      receiveTimeout: const Duration(seconds: 8),
      validateStatus: (status) => status != null && status < 500,
      headers: {
        'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    ),
  );

  static Future<List<SearchResultImage>> searchImages(String query) async {
    final cleanQuery = query.trim();
    if (cleanQuery.isEmpty) return [];

    final results = <SearchResultImage>[];
    final seenUrls = <String>{};

    void addResult(String url, String thumbnailUrl, String title, String source) {
      final trimmed = url.trim();
      if (trimmed.isNotEmpty &&
          (trimmed.startsWith('http://') || trimmed.startsWith('https://')) &&
          !seenUrls.contains(trimmed)) {
        seenUrls.add(trimmed);
        results.add(
          SearchResultImage(
            url: trimmed,
            thumbnailUrl: thumbnailUrl.isNotEmpty ? thumbnailUrl : trimmed,
            title: title,
            source: source,
          ),
        );
      }
    }

    // Provider 1: DuckDuckGo Image Search
    try {
      final ddgResults = await _searchDuckDuckGo(cleanQuery);
      for (final res in ddgResults) {
        addResult(res.url, res.thumbnailUrl, res.title, res.source);
      }
    } catch (e) {
      debugPrint('DuckDuckGo image search error: $e');
    }

    // Provider 2: Open Food Facts API (Great for groceries/products)
    if (results.length < 15) {
      try {
        final offResults = await _searchOpenFoodFacts(cleanQuery);
        for (final res in offResults) {
          addResult(res.url, res.thumbnailUrl, res.title, res.source);
        }
      } catch (e) {
        debugPrint('Open Food Facts search error: $e');
      }
    }

    // Provider 3: Wikimedia Commons API
    if (results.length < 15) {
      try {
        final wikiResults = await _searchWikimedia(cleanQuery);
        for (final res in wikiResults) {
          addResult(res.url, res.thumbnailUrl, res.title, res.source);
        }
      } catch (e) {
        debugPrint('Wikimedia search error: $e');
      }
    }

    // Provider 4: Unsplash Public Source (Fallback images for generic product search terms)
    if (results.isEmpty) {
      try {
        final encoded = Uri.encodeComponent(cleanQuery);
        addResult(
          'https://source.unsplash.com/featured/?$encoded',
          'https://source.unsplash.com/featured/?$encoded',
          cleanQuery,
          'Unsplash',
        );
      } catch (_) {}
    }

    return results;
  }

  static Future<List<SearchResultImage>> _searchDuckDuckGo(String query) async {
    final list = <SearchResultImage>[];
    try {
      final searchUrl = 'https://duckduckgo.com/?q=${Uri.encodeComponent(query)}';
      final htmlResp = await _dio.get<String>(searchUrl);
      final html = htmlResp.data ?? '';

      final vqdMatch = RegExp(r'vqd=([\d-]+)').firstMatch(html) ??
          RegExp(r'vqd="([^"]+)"').firstMatch(html) ??
          RegExp(r"vqd='([^']+)'").firstMatch(html);

      final vqd = vqdMatch?.group(1);
      if (vqd != null && vqd.isNotEmpty) {
        final imgUrl =
            'https://duckduckgo.com/i.js?l=us-en&o=json&q=${Uri.encodeComponent(query)}&vqd=$vqd';
        final jsonResp = await _dio.get(
          imgUrl,
          options: Options(
            headers: {
              'User-Agent':
                  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Referer': 'https://duckduckgo.com/',
            },
          ),
        );

        if (jsonResp.statusCode == 200) {
          final data = jsonResp.data is String ? json.decode(jsonResp.data) : jsonResp.data;
          if (data is Map && data['results'] is List) {
            for (final item in data['results']) {
              if (item is Map) {
                final img = item['image'] as String? ?? '';
                final thumb = item['thumbnail'] as String? ?? img;
                final title = item['title'] as String? ?? query;
                final source = item['source'] as String? ?? 'DuckDuckGo';
                if (img.isNotEmpty) {
                  list.add(SearchResultImage(
                    url: img,
                    thumbnailUrl: thumb,
                    title: title,
                    source: source,
                  ));
                }
              }
            }
          }
        }
      }
    } catch (e) {
      debugPrint('_searchDuckDuckGo error: $e');
    }
    return list;
  }

  static Future<List<SearchResultImage>> _searchOpenFoodFacts(String query) async {
    final list = <SearchResultImage>[];
    try {
      final url =
          'https://world.openfoodfacts.org/cgi/search.pl?search_terms=${Uri.encodeComponent(query)}&search_simple=1&action=process&json=1&page_size=20';
      final resp = await _dio.get(
        url,
        options: Options(
          headers: {'User-Agent': 'ShriahERP/1.0 (contact@shriah.com)'},
        ),
      );

      if (resp.statusCode == 200) {
        final data = resp.data is String ? json.decode(resp.data) : resp.data;
        if (data is Map && data['products'] is List) {
          for (final prod in data['products']) {
            if (prod is Map) {
              final img = prod['image_front_url'] as String? ??
                  prod['image_url'] as String? ??
                  prod['image_small_url'] as String? ??
                  '';
              final title = prod['product_name'] as String? ?? query;
              if (img.isNotEmpty) {
                list.add(SearchResultImage(
                  url: img,
                  thumbnailUrl: img,
                  title: title,
                  source: 'Open Food Facts',
                ));
              }
            }
          }
        }
      }
    } catch (e) {
      debugPrint('_searchOpenFoodFacts error: $e');
    }
    return list;
  }

  static Future<List<SearchResultImage>> _searchWikimedia(String query) async {
    final list = <SearchResultImage>[];
    try {
      final url =
          'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${Uri.encodeComponent(query)}&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json&gsrlimit=20';
      final resp = await _dio.get(url);

      if (resp.statusCode == 200) {
        final data = resp.data is String ? json.decode(resp.data) : resp.data;
        if (data is Map && data['query'] is Map && data['query']['pages'] is Map) {
          final pages = data['query']['pages'] as Map<String, dynamic>;
          for (final entry in pages.values) {
            if (entry is Map && entry['imageinfo'] is List && (entry['imageinfo'] as List).isNotEmpty) {
              final info = entry['imageinfo'][0] as Map;
              final img = info['url'] as String? ?? '';
              final title = entry['title'] as String? ?? query;
              if (img.isNotEmpty) {
                list.add(SearchResultImage(
                  url: img,
                  thumbnailUrl: img,
                  title: title.replaceAll('File:', ''),
                  source: 'Wikimedia Commons',
                ));
              }
            }
          }
        }
      }
    } catch (e) {
      debugPrint('_searchWikimedia error: $e');
    }
    return list;
  }
}
