import 'dart:async';
import 'package:uuid/uuid.dart';
import '../models/user_model.dart';

class AuthRepository {
  UserModel? _currentUser;
  
  // Seed database user profiles
  final List<UserModel> _users = [
    UserModel(
      id: 'admin-id-123',
      email: 'aahsanuh62@gmail.com',
      fullName: 'Admin AhsAN',
      mobile: '+966553687388',
      username: 'admin',
      landingPage: '/summary',
      createdAt: DateTime.now(),
    ),
  ];

  Future<UserModel?> getCurrentUser() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _currentUser;
  }

  Future<UserModel> signIn({
    required String identifier,
    required String password,
  }) async {
    await Future.delayed(const Duration(milliseconds: 800));
    
    final idClean = identifier.trim().toLowerCase();
    
    // Allow any sign-in for simplicity, but if it matches the admin email/username, return the admin user!
    UserModel? user;
    try {
      user = _users.firstWhere(
        (u) => u.email == idClean || u.username == idClean || u.mobile == idClean,
      );
    } catch (_) {
      // Create a temporary user if not found in list so the user can log in with any credentials in mock mode
      user = UserModel(
        id: const Uuid().v4(),
        email: idClean.contains('@') ? idClean : '$idClean@shriah.com',
        fullName: 'User ${identifier.split('@')[0]}',
        username: idClean.split('@')[0],
        landingPage: '/summary',
        createdAt: DateTime.now(),
      );
      _users.add(user);
    }

    _currentUser = user;
    return user;
  }

  Future<void> signUp({
    required String email,
    required String password,
    required String fullName,
  }) async {
    await Future.delayed(const Duration(milliseconds: 800));
    final user = UserModel(
      id: const Uuid().v4(),
      email: email.trim().toLowerCase(),
      fullName: fullName,
      username: email.split('@')[0],
      landingPage: '/summary',
      createdAt: DateTime.now(),
    );
    _users.add(user);
    _currentUser = user;
  }

  Future<void> signOut() async {
    await Future.delayed(const Duration(milliseconds: 200));
    _currentUser = null;
  }
}
