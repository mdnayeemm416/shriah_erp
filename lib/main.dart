import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';
import 'package:hive_flutter/hive_flutter.dart';

import 'blocs/theme/theme_cubit.dart';
import 'blocs/language/language_cubit.dart';
import 'blocs/working_date/working_date_cubit.dart';
import 'blocs/auth/auth_cubit.dart';
import 'blocs/shop/shop_bloc.dart';
import 'blocs/shop/shop_event.dart';
import 'blocs/employee/employee_bloc.dart';
import 'blocs/employee/employee_event.dart';
import 'blocs/daily_closing/daily_closing_cubit.dart';
import 'blocs/my_expenses/my_expenses_cubit.dart';
import 'blocs/price_compare/price_compare_cubit.dart';
import 'blocs/wholesale/wholesale_cubit.dart';

import 'repositories/auth_repository.dart';
import 'repositories/shop_repository.dart';
import 'repositories/employee_repository.dart';
import 'repositories/product_repository.dart';
import 'repositories/company_transaction_repository.dart';
import 'repositories/cash_snapshot_repository.dart';
import 'repositories/daily_closing_repository.dart';
import 'repositories/employee_expense_repository.dart';
import 'repositories/price_compare_repository.dart';
import 'repositories/wholesale_repository.dart';

import 'core/api/api_client.dart';
import 'core/theme/app_theme.dart';
import 'screens/shell.dart';
import 'screens/login/login_screen.dart';
import 'blocs/auth/auth_state.dart';

void main() async {
  final widgetsBinding = WidgetsFlutterBinding.ensureInitialized();
  FlutterNativeSplash.preserve(widgetsBinding: widgetsBinding);
  await Hive.initFlutter();
  await ApiClient().init();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
    ),
  );

  // 1. Instantiate Repositories
  final authRepo = AuthRepository();
  final shopRepo = ShopRepository();
  final employeeRepo = EmployeeRepository();
  final productRepo = ProductRepository();
  final companyRepo = CompanyTransactionRepository();
  final cashSnapshotRepo = CashSnapshotRepository();
  final dailyClosingRepo = DailyClosingRepository();
  final employeeExpenseRepo = EmployeeExpenseRepository();
  final priceCompareRepo = PriceCompareRepository();
  final wholesaleRepo = WholesaleRepository();

  // 2. Initialize Hive schemas & mock seed data
  await shopRepo.initialize();
  await employeeRepo.initialize();
  await productRepo.initialize();
  await companyRepo.initialize();
  await cashSnapshotRepo.initialize();
  await dailyClosingRepo.initialize();
  await employeeExpenseRepo.initialize();
  await priceCompareRepo.initialize();
  await wholesaleRepo.initialize();

  runApp(
    MultiRepositoryProvider(
      providers: [
        RepositoryProvider<AuthRepository>.value(value: authRepo),
        RepositoryProvider<ShopRepository>.value(value: shopRepo),
        RepositoryProvider<EmployeeRepository>.value(value: employeeRepo),
        RepositoryProvider<ProductRepository>.value(value: productRepo),
        RepositoryProvider<CompanyTransactionRepository>.value(
          value: companyRepo,
        ),
        RepositoryProvider<CashSnapshotRepository>.value(
          value: cashSnapshotRepo,
        ),
        RepositoryProvider<DailyClosingRepository>.value(
          value: dailyClosingRepo,
        ),
        RepositoryProvider<EmployeeExpenseRepository>.value(
          value: employeeExpenseRepo,
        ),
        RepositoryProvider<PriceCompareRepository>.value(
          value: priceCompareRepo,
        ),
        RepositoryProvider<WholesaleRepository>.value(value: wholesaleRepo),
      ],
      child: MultiBlocProvider(
        providers: [
          BlocProvider<ThemeCubit>(create: (_) => ThemeCubit()),
          BlocProvider<LanguageCubit>(create: (_) => LanguageCubit()),
          BlocProvider<WorkingDateCubit>(create: (_) => WorkingDateCubit()),
          BlocProvider<AuthCubit>(create: (context) => AuthCubit(authRepo)),
          BlocProvider<ShopBloc>(
            create: (context) => ShopBloc(shopRepo)..add(LoadShops()),
          ),
          BlocProvider<EmployeeBloc>(
            create: (context) =>
                EmployeeBloc(employeeRepo)..add(LoadEmployeesList()),
          ),
          BlocProvider<DailyClosingCubit>(
            create: (context) => DailyClosingCubit(
              dailyClosingRepo: context.read<DailyClosingRepository>(),
              shopRepo: context.read<ShopRepository>(),
              employeeRepo: context.read<EmployeeRepository>(),
              companyRepo: context.read<CompanyTransactionRepository>(),
            ),
          ),
          BlocProvider<MyExpensesCubit>(
            create: (context) => MyExpensesCubit(
              expenseRepo: context.read<EmployeeExpenseRepository>(),
              employeeRepo: context.read<EmployeeRepository>(),
            ),
          ),
          BlocProvider<PriceCompareCubit>(
            create: (context) => PriceCompareCubit(
              compareRepo: context.read<PriceCompareRepository>(),
            )..loadProducts(),
          ),
          BlocProvider<WholesaleCubit>(
            create: (context) => WholesaleCubit(
              wholesaleRepo: context.read<WholesaleRepository>(),
              productRepo: context.read<ProductRepository>(),
            )..loadAllData(),
          ),
        ],
        child: const MyApp(),
      ),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    final themeMode = context.watch<ThemeCubit>().state;
    final locale = context.watch<LanguageCubit>().state;

    return MaterialApp(
      title: 'ShRiAh ERP',
      debugShowCheckedModeBanner: false,
      themeMode: themeMode,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      locale: Locale(locale),
      // Always start with the splash — it navigates itself after animations
      home: const SplashScreen(),
    );
  }
}

// ─── Animated Flutter Splash Screen ──────────────────────────────────────────────
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _logoCtrl;
  late AnimationController _textCtrl;
  late Animation<double> _fadeAnim;
  late Animation<double> _scaleAnim;
  late Animation<double> _textFade;
  late Animation<Offset> _textSlide;

  @override
  void initState() {
    super.initState();

    // Remove the native splash screen immediately when the first frame of the Flutter UI is rendered,
    // so the user can see our beautiful entry animations.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      FlutterNativeSplash.remove();
    });

    _logoCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );
    _textCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    _fadeAnim = CurvedAnimation(parent: _logoCtrl, curve: Curves.easeIn);
    _scaleAnim = Tween<double>(
      begin: 0.5,
      end: 1.0,
    ).animate(CurvedAnimation(parent: _logoCtrl, curve: Curves.elasticOut));

    _textFade = CurvedAnimation(parent: _textCtrl, curve: Curves.easeIn);
    _textSlide = Tween<Offset>(
      begin: const Offset(0, 0.5),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _textCtrl, curve: Curves.easeOut));

    // Play the animations
    _logoCtrl.forward().then((_) => _textCtrl.forward());

    // Hold the splash screen for 3.0 seconds total to ensure premium experience is visible
    Future.delayed(const Duration(milliseconds: 3000), () async {
      if (!mounted) return;
      final authCubit = context.read<AuthCubit>();
      AuthState authState = authCubit.state;
      if (authState is AuthLoading) {
        authState = await authCubit.stream.firstWhere((s) => s is! AuthLoading);
      }

      if (!mounted) return;
      if (authState is AuthAuthenticated) {
        Navigator.pushReplacement(
          context,
          PageRouteBuilder(
            pageBuilder: (_, __, ___) => const AppShell(),
            transitionsBuilder: (_, anim, __, child) =>
                FadeTransition(opacity: anim, child: child),
            transitionDuration: const Duration(milliseconds: 600),
          ),
        );
      } else {
        Navigator.pushReplacement(
          context,
          PageRouteBuilder(
            pageBuilder: (_, __, ___) => const LoginScreen(),
            transitionsBuilder: (_, anim, __, child) =>
                FadeTransition(opacity: anim, child: child),
            transitionDuration: const Duration(milliseconds: 600),
          ),
        );
      }
    });
  }

  @override
  void dispose() {
    _logoCtrl.dispose();
    _textCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF060913), Color(0xFF09161B), Color(0xFF05271E)],
            stops: [0.0, 0.5, 1.0],
          ),
        ),
        child: Stack(
          children: [
            // Decorative glowing circles (Layered background glows)
            Positioned(
              top: -100,
              right: -100,
              child: Container(
                width: 360,
                height: 360,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFF14B8A6).withOpacity(0.09),
                ),
              ),
            ),
            Positioned(
              bottom: -120,
              left: -80,
              child: Container(
                width: 400,
                height: 400,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFF10B981).withOpacity(0.07),
                ),
              ),
            ),
            // Subtler center glow behind the logo
            Center(
              child: Container(
                width: 250,
                height: 250,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFF14B8A6).withOpacity(0.04),
                ),
              ),
            ),

            // Center content
            Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Logo with fade + scale (Solid white card container for visibility contrast)
                  FadeTransition(
                    opacity: _fadeAnim,
                    child: ScaleTransition(
                      scale: _scaleAnim,
                      child: Container(
                        width: 140,
                        height: 140,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(36),
                          border: Border.all(
                            color: const Color(0xFF14B8A6).withOpacity(0.35),
                            width: 2.0,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF14B8A6).withOpacity(0.4),
                              blurRadius: 40,
                              spreadRadius: 2,
                            ),
                            BoxShadow(
                              color: Colors.black.withOpacity(0.12),
                              blurRadius: 15,
                              offset: const Offset(0, 10),
                            ),
                          ],
                        ),
                        padding: const EdgeInsets.all(22),
                        child: Image.asset(
                          'assets/images/shriah.png',
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 36),

                  // Tagline with slide-up fade and gradient shader text
                  FadeTransition(
                    opacity: _textFade,
                    child: SlideTransition(
                      position: _textSlide,
                      child: Column(
                        children: [
                          ShaderMask(
                            shaderCallback: (bounds) => const LinearGradient(
                              colors: [Colors.white, Color(0xFF2DD4BF)],
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                            ).createShader(bounds),
                            child: const Text(
                              'ShRiAh Group',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                                letterSpacing: 1.5,
                              ),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'ENTERPRISE RESOURCE PLANNING',
                            style: TextStyle(
                              color: const Color(0xFF2DD4BF).withOpacity(0.65),
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              letterSpacing: 3.0,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 70),

                  // Modernized Loading progress bar with subtle glow
                  FadeTransition(
                    opacity: _textFade,
                    child: Container(
                      width: 140,
                      height: 4,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF14B8A6).withOpacity(0.25),
                            blurRadius: 8,
                            spreadRadius: 1,
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(10),
                        child: LinearProgressIndicator(
                          backgroundColor: Colors.white.withOpacity(0.08),
                          valueColor: const AlwaysStoppedAnimation<Color>(
                            Color(0xFF14B8A6),
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Version tag bottom
            Positioned(
              bottom: 32,
              left: 0,
              right: 0,
              child: FadeTransition(
                opacity: _textFade,
                child: Text(
                  'Version 1.0.0',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.25),
                    fontSize: 11,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
