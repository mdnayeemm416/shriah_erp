import 'dart:async';
import 'package:hive_flutter/hive_flutter.dart';
import '../core/api/api_client.dart';
import '../models/user_model.dart';

class AuthRepository {
  UserModel? _currentUser;
  final ApiClient _apiClient = ApiClient();
  static const String _authBoxName = 'auth';

  UserModel? get currentUser => _currentUser;

  void setCurrentUser(UserModel? user) {
    _currentUser = user;
  }

  Future<UserModel?> getCurrentUser() async {
    return _currentUser;
  }

  Future<UserModel> signIn({
    required String identifier,
    required String password,
  }) async {
    final res = await _apiClient.login(
      identifier: identifier,
      password: password,
    );

    if (res['success'] == true && res['data'] != null && res['data']['user'] != null) {
      final userMap = Map<String, dynamic>.from(res['data']['user'] as Map);
      final user = UserModel.fromJson(userMap);
      _currentUser = user;

      // Save user profile in Hive box
      final box = await Hive.openBox(_authBoxName);
      await box.put('user_profile', user.toJson());

      return user;
    } else {
      final errorMsg = res['message'] as String? ?? 'Invalid credentials or server error';
      throw Exception(errorMsg);
    }
  }

  Future<void> signUp({
    required String email,
    required String password,
    required String fullName,
  }) async {
    throw Exception('Registration disabled. Please contact system administrator.');
  }

  Future<void> signOut() async {
    await _apiClient.setToken(null);
    _currentUser = null;
    final box = await Hive.openBox(_authBoxName);
    await box.delete('user_profile');
  }
}
