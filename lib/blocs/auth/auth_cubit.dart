import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive/hive.dart';
import 'auth_state.dart';
import '../../repositories/auth_repository.dart';

class AuthCubit extends Cubit<AuthState> {
  final AuthRepository authRepository;

  AuthCubit(this.authRepository) : super(AuthInitial()) {
    checkAuth();
  }

  Future<void> checkAuth() async {
    emit(AuthLoading());
    try {
      final box = await Hive.openBox('settings');
      final savedUserId = box.get('userId');
      
      if (savedUserId != null) {
        // If there was a saved user session, sign in mock user
        final user = await authRepository.signIn(
          identifier: box.get('userIdentifier', defaultValue: 'aahsanuh62@gmail.com'),
          password: 'mock',
        );
        emit(AuthAuthenticated(user));
        return;
      }
      emit(AuthUnauthenticated());
    } catch (e) {
      emit(AuthUnauthenticated());
    }
  }

  Future<void> login(String identifier, String password) async {
    emit(AuthLoading());
    try {
      final user = await authRepository.signIn(
        identifier: identifier,
        password: password,
      );
      
      final box = await Hive.openBox('settings');
      await box.put('userId', user.id);
      await box.put('userIdentifier', identifier);
      
      emit(AuthAuthenticated(user));
    } catch (e) {
      emit(AuthError(e.toString()));
    }
  }

  Future<void> logout() async {
    emit(AuthLoading());
    try {
      await authRepository.signOut();
      final box = await Hive.openBox('settings');
      await box.delete('userId');
      await box.delete('userIdentifier');
      emit(AuthUnauthenticated());
    } catch (e) {
      emit(AuthUnauthenticated());
    }
  }
}
