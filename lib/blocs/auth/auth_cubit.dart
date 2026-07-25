import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'auth_state.dart';
import '../../models/user_model.dart';
import '../../repositories/auth_repository.dart';

class AuthCubit extends Cubit<AuthState> {
  final AuthRepository authRepository;

  AuthCubit(this.authRepository) : super(AuthInitial()) {
    checkAuth();
  }

  Future<void> checkAuth() async {
    emit(AuthLoading());
    try {
      final savedCreds = await authRepository.getSavedCredentials();
      if (savedCreds != null) {
        try {
          final user = await authRepository.signIn(
            identifier: savedCreds['identifier']!,
            password: savedCreds['password']!,
            rememberMe: true,
          );
          emit(AuthAuthenticated(user));
          return;
        } catch (_) {
          // If online login fails (e.g. offline/network issue), check cached session
        }
      }

      final box = await Hive.openBox('auth');
      final token = box.get('auth_token') as String?;
      final userProfileMap = box.get('user_profile');

      if (token != null && token.isNotEmpty && userProfileMap is Map) {
        final user = UserModel.fromJson(Map<String, dynamic>.from(userProfileMap));
        authRepository.setCurrentUser(user);
        emit(AuthAuthenticated(user));
        return;
      }
      emit(AuthUnauthenticated());
    } catch (_) {
      emit(AuthUnauthenticated());
    }
  }

  Future<void> login(String identifier, String password, {bool rememberMe = true}) async {
    emit(AuthLoading());
    try {
      final user = await authRepository.signIn(
        identifier: identifier,
        password: password,
        rememberMe: rememberMe,
      );
      emit(AuthAuthenticated(user));
    } catch (e) {
      final errorMsg = e.toString().replaceFirst('Exception: ', '');
      emit(AuthError(errorMsg));
    }
  }

  Future<void> logout() async {
    emit(AuthLoading());
    try {
      await authRepository.signOut();
      emit(AuthUnauthenticated());
    } catch (_) {
      emit(AuthUnauthenticated());
    }
  }
}
