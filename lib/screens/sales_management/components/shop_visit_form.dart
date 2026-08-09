import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:toastification/toastification.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../core/theme/app_colors.dart';
import '../../../../blocs/sales_management/sales_management_cubit.dart';
import '../../../../blocs/sales_management/sales_management_state.dart';
import '../../../../models/sales_visit_model.dart';

class ShopVisitForm extends StatefulWidget {
  final Color cardBg;
  final Color textColor;
  final Color? subtextColor;
  final Color borderColor;
  final bool isDark;
  final void Function(
    String customerName,
    double amount,
    String notes,
    String photoPath,
  ) onSubmit;

  const ShopVisitForm({
    super.key,
    required this.cardBg,
    required this.textColor,
    required this.subtextColor,
    required this.borderColor,
    required this.isDark,
    required this.onSubmit,
  });

  @override
  State<ShopVisitForm> createState() => _ShopVisitFormState();
}

class _ShopVisitFormState extends State<ShopVisitForm> {
  SalesCustomerModel? _selectedCustomer;
  final _amountController = TextEditingController(text: '0');
  final _notesController = TextEditingController();
  final _searchController = TextEditingController();
  final FocusNode _searchFocusNode = FocusNode();
  String? _selectedImagePath;
  bool _isSubmitting = false;

  // Captured location states
  String? _capturedCoordinates;
  String? _capturedAddress;
  bool _isCapturingLocation = false;

  // Payment Type & Partial breakdown states
  String _paymentType = 'Cash';
  final _cashController = TextEditingController(text: '0');
  final _bankController = TextEditingController(text: '0');
  final _creditController = TextEditingController(text: '0');

  bool get _isValid {
    if (_selectedCustomer == null) return false;
    final amountStr = _amountController.text.trim();
    final amount = double.tryParse(amountStr);
    if (amount == null || amount < 0) return false;
    if (amount == 0 && _notesController.text.trim().isEmpty) return false;
    if (_selectedImagePath == null) return false;
    if (_capturedCoordinates == null ||
        _isCapturingLocation ||
        _capturedCoordinates!.contains('failed') ||
        _capturedCoordinates!.contains('denied') ||
        _capturedCoordinates!.contains('disabled') ||
        _capturedCoordinates!.contains('Capturing')) {
      return false;
    }
    if (_paymentType == 'Partial') {
      final cash = double.tryParse(_cashController.text.trim()) ?? 0.0;
      final bank = double.tryParse(_bankController.text.trim()) ?? 0.0;
      final credit = double.tryParse(_creditController.text.trim()) ?? 0.0;
      final totalBreakdown = cash + bank + credit;
      if ((totalBreakdown - amount).abs() > 0.01) return false;
    }
    return true;
  }

  @override
  void initState() {
    super.initState();
    _searchFocusNode.addListener(() {
      setState(() {});
      if (_searchFocusNode.hasFocus) {
        context.read<SalesManagementCubit>().filterCustomers(_searchController.text);
      } else {
        // Delayed clear so that onTap handles suggestion selection first
        Future.delayed(const Duration(milliseconds: 180), () {
          if (mounted) {
            context.read<SalesManagementCubit>().clearFilteredCustomers();
          }
        });
      }
    });

    // Repaint on breakdown text changes to update warnings dynamically
    _amountController.addListener(() => setState(() {}));
    _cashController.addListener(() => setState(() {}));
    _bankController.addListener(() => setState(() {}));
    _creditController.addListener(() => setState(() {}));
    _notesController.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _searchFocusNode.dispose();
    _amountController.dispose();
    _notesController.dispose();
    _searchController.dispose();
    _cashController.dispose();
    _bankController.dispose();
    _creditController.dispose();
    super.dispose();
  }

  void _filterCustomers(String query) {
    context.read<SalesManagementCubit>().filterCustomers(query);
  }

  Future<void> _takePhoto() async {
    try {
      // Check location services first
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        toastification.show(
          context: context,
          type: ToastificationType.error,
          style: ToastificationStyle.flatColored,
          title: const Text('Location Services Disabled'),
          description: const Text('Please enable GPS/location services on your device to proceed.'),
          autoCloseDuration: const Duration(seconds: 4),
          showProgressBar: true,
        );
        return;
      }

      // Check location permission
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }

      if (permission == LocationPermission.denied || permission == LocationPermission.deniedForever) {
        toastification.show(
          context: context,
          type: ToastificationType.error,
          style: ToastificationStyle.flatColored,
          title: const Text('Permission Required'),
          description: const Text('Location permission required'),
          autoCloseDuration: const Duration(seconds: 4),
          showProgressBar: true,
        );
        return;
      }

      // Location permission is granted! Now open camera.
      final picker = ImagePicker();
      final XFile? image = await picker.pickImage(
        source: ImageSource.camera,
        imageQuality: 75,
      );
      
      if (image != null) {
        setState(() {
          _selectedImagePath = image.path;
          _isCapturingLocation = true;
          _capturedCoordinates = 'Capturing coordinates...';
          _capturedAddress = 'Retrieving readable address...';
        });

        // Get current location position
        try {
          Position position = await Geolocator.getCurrentPosition(
            locationSettings: const LocationSettings(
              accuracy: LocationAccuracy.high,
              timeLimit: Duration(seconds: 8),
            ),
          );

          String readableAddress = '';
          try {
            List<Placemark> placemarks = await placemarkFromCoordinates(
              position.latitude,
              position.longitude,
            );
            if (placemarks.isNotEmpty) {
              final pm = placemarks.first;
              final parts = [
                if (pm.name != null && pm.name != pm.street) pm.name,
                pm.street,
                pm.subLocality,
                pm.locality,
                pm.administrativeArea,
                pm.country,
              ].where((x) => x != null && x.toString().trim().isNotEmpty).toList();
              readableAddress = parts.join(", ");
            }
          } catch (_) {
            readableAddress = 'Address details unavailable';
          }

          setState(() {
            _isCapturingLocation = false;
            _capturedCoordinates = '${position.latitude.toStringAsFixed(5)}, ${position.longitude.toStringAsFixed(5)}';
            _capturedAddress = readableAddress.isNotEmpty ? readableAddress : 'Unknown location address';
          });
        } catch (e) {
          setState(() {
            _isCapturingLocation = false;
            _capturedCoordinates = 'Capture failed';
            _capturedAddress = 'Error: $e';
          });
        }
      }
    } catch (e) {
      if (mounted) {
        toastification.show(
          context: context,
          type: ToastificationType.error,
          style: ToastificationStyle.flatColored,
          title: const Text('Error'),
          description: Text('Failed to take photo: $e'),
          autoCloseDuration: const Duration(seconds: 4),
          showProgressBar: true,
        );
      }
    }
  }

  void _clearForm() {
    setState(() {
      _selectedCustomer = null;
      _amountController.text = '0.00';
      _notesController.clear();
      _selectedImagePath = null;
      _searchController.clear();
      _paymentType = 'Cash';
      _cashController.text = '0.00';
      _bankController.text = '0.00';
      _creditController.text = '0.00';
      _capturedCoordinates = null;
      _capturedAddress = null;
      _isCapturingLocation = false;
    });
    context.read<SalesManagementCubit>().clearFilteredCustomers();
  }

  Future<void> _submit() async {
    if (_selectedCustomer == null) {
      toastification.show(
        context: context,
        type: ToastificationType.warning,
        style: ToastificationStyle.flatColored,
        title: const Text('Validation Warning'),
        description: const Text('Please select a customer/shop'),
        autoCloseDuration: const Duration(seconds: 4),
        showProgressBar: true,
      );
      return;
    }

    final amountStr = _amountController.text.trim();
    final amount = double.tryParse(amountStr) ?? 0.0;
    if (amount < 0) {
      toastification.show(
        context: context,
        type: ToastificationType.warning,
        style: ToastificationStyle.flatColored,
        title: const Text('Validation Warning'),
        description: const Text('Please enter a valid positive sale amount'),
        autoCloseDuration: const Duration(seconds: 4),
        showProgressBar: true,
      );
      return;
    }

    // Require notes if sale amount is 0
    if (amount == 0 && _notesController.text.trim().isEmpty) {
      toastification.show(
        context: context,
        type: ToastificationType.warning,
        style: ToastificationStyle.flatColored,
        title: const Text('Validation Warning'),
        description: const Text('Notes are required when sale amount is 0.'),
        autoCloseDuration: const Duration(seconds: 4),
        showProgressBar: true,
      );
      return;
    }

    // If partial payment, check that the sum of cash, bank, and credit breakdown equals entered amount
    if (_paymentType == 'Partial') {
      final cash = double.tryParse(_cashController.text.trim()) ?? 0.0;
      final bank = double.tryParse(_bankController.text.trim()) ?? 0.0;
      final credit = double.tryParse(_creditController.text.trim()) ?? 0.0;
      final totalBreakdown = cash + bank + credit;

      if ((totalBreakdown - amount).abs() > 0.01) {
        toastification.show(
          context: context,
          type: ToastificationType.warning,
          style: ToastificationStyle.flatColored,
          title: const Text('Validation Warning'),
          description: Text('Payment breakdown total (${totalBreakdown.toStringAsFixed(2)} SAR) must equal the Sale Amount (${amount.toStringAsFixed(2)} SAR).'),
          autoCloseDuration: const Duration(seconds: 4),
          showProgressBar: true,
        );
        return;
      }
    }

    if (_selectedImagePath == null) {
      toastification.show(
        context: context,
        type: ToastificationType.warning,
        style: ToastificationStyle.flatColored,
        title: const Text('Validation Warning'),
        description: const Text('Please capture a shop photo'),
        autoCloseDuration: const Duration(seconds: 4),
        showProgressBar: true,
      );
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      final cash = double.tryParse(_cashController.text.trim()) ?? 0.0;
      final bank = double.tryParse(_bankController.text.trim()) ?? 0.0;
      final credit = double.tryParse(_creditController.text.trim()) ?? 0.0;

      final recordLocation = _capturedCoordinates != null && _capturedAddress != null
          ? '$_capturedCoordinates|$_capturedAddress'
          : (_selectedCustomer!.address ?? '24.7136,46.6753|Ash Shamiya Al Jadid, Makkah Al Mukarramah');

      final record = VisitRecord(
        id: 'visit-${DateTime.now().millisecondsSinceEpoch}',
        customerName: _selectedCustomer!.name,
        shopName: _selectedCustomer!.name,
        amount: amount,
        paymentType: _paymentType,
        cashAmount: _paymentType == 'Partial' ? cash : (_paymentType == 'Cash' ? amount : 0.0),
        bankAmount: _paymentType == 'Partial' ? bank : (_paymentType == 'Bank' ? amount : 0.0),
        creditAmount: _paymentType == 'Partial' ? credit : (_paymentType == 'Credit' ? amount : 0.0),
        notes: _notesController.text.trim(),
        photoPath: _selectedImagePath!,
        dateTime: DateTime.now(),
        shopLocation: recordLocation,
        salesmanName: 'Mohammed', // Default salesmanName
      );
      await context.read<SalesManagementCubit>().addVisitRecord(record);

      widget.onSubmit(
        _selectedCustomer!.name,
        amount,
        _notesController.text.trim(),
        _selectedImagePath!,
      );
      _clearForm();
    } catch (e) {
      if (mounted) {
        toastification.show(
          context: context,
          type: ToastificationType.error,
          style: ToastificationStyle.flatColored,
          title: const Text('Submission Failed'),
          description: Text(e.toString().replaceFirst('Exception: ', '')),
          autoCloseDuration: const Duration(seconds: 4),
          showProgressBar: true,
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isSubmitting = false);
      }
    }
  }

  void _showAddNewCustomerDialog() {
    final nameCtrl = TextEditingController();
    final shopNameCtrl = TextEditingController();
    final mobileCtrl = TextEditingController();
    final addressCtrl = TextEditingController();
    final notesCtrl = TextEditingController();
    String? shopLocation;
    bool isCapturing = false;

    showDialog(
      context: context,
      builder: (ctx) {
        bool isSaving = false;
        return StatefulBuilder(
          builder: (dialogCtx, setDialogState) {
            Widget buildFieldLabel(String label, {bool isRequired = false}) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 6, top: 12),
                child: RichText(
                  text: TextSpan(
                    text: label.toUpperCase(),
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.5,
                      color: widget.isDark ? Colors.grey[400] : const Color(0xFF64748B),
                    ),
                    children: isRequired
                        ? const [
                            TextSpan(
                              text: ' *',
                              style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
                            ),
                          ]
                        : null,
                  ),
                ),
              );
            }

            Widget buildTextField({
              required TextEditingController controller,
              required String hintText,
              TextInputType keyboardType = TextInputType.text,
              int maxLines = 1,
            }) {
              return TextField(
                controller: controller,
                keyboardType: keyboardType,
                maxLines: maxLines,
                decoration: InputDecoration(
                  hintText: hintText,
                  filled: true,
                  fillColor: widget.isDark ? const Color(0xFF111827) : const Color(0xFFF8FAFC),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: widget.borderColor),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(color: widget.borderColor),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
                  ),
                ),
              );
            }

            Future<void> captureCoordinates() async {
              setDialogState(() {
                isCapturing = true;
                shopLocation = 'Capturing current location...';
              });

              try {
                bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
                if (!serviceEnabled) {
                  setDialogState(() {
                    isCapturing = false;
                    shopLocation = null;
                  });
                  if (mounted) {
                    toastification.show(
                      context: context,
                      type: ToastificationType.error,
                      title: const Text('Location Services Disabled'),
                      description: const Text('Please enable location services (GPS) in your device settings.'),
                      autoCloseDuration: const Duration(seconds: 4),
                    );
                  }
                  return;
                }

                LocationPermission permission = await Geolocator.checkPermission();
                if (permission == LocationPermission.denied) {
                  permission = await Geolocator.requestPermission();
                  if (permission == LocationPermission.denied) {
                    setDialogState(() {
                      isCapturing = false;
                      shopLocation = null;
                    });
                    if (mounted) {
                      toastification.show(
                        context: context,
                        type: ToastificationType.error,
                        title: const Text('Permission Denied'),
                        description: const Text('Location permissions are required to capture the coordinates.'),
                        autoCloseDuration: const Duration(seconds: 4),
                      );
                    }
                    return;
                  }
                }

                if (permission == LocationPermission.deniedForever) {
                  setDialogState(() {
                    isCapturing = false;
                    shopLocation = null;
                  });
                  if (mounted) {
                    toastification.show(
                      context: context,
                      type: ToastificationType.error,
                      title: const Text('Permission Denied Permanently'),
                      description: const Text('Location permissions are permanently denied. Please enable them in app settings.'),
                      autoCloseDuration: const Duration(seconds: 4),
                    );
                  }
                  return;
                }

                Position position = await Geolocator.getCurrentPosition(
                  locationSettings: const LocationSettings(
                    accuracy: LocationAccuracy.high,
                    timeLimit: Duration(seconds: 7),
                  ),
                );

                String readableAddress = '';
                try {
                  List<Placemark> placemarks = await placemarkFromCoordinates(
                    position.latitude,
                    position.longitude,
                  );
                  if (placemarks.isNotEmpty) {
                    final pm = placemarks.first;
                    final parts = [
                      if (pm.name != null && pm.name != pm.street) pm.name,
                      pm.street,
                      pm.subLocality,
                      pm.locality,
                      pm.administrativeArea,
                      pm.country,
                    ].where((x) => x != null && x.toString().trim().isNotEmpty).toList();
                    readableAddress = parts.join(", ");
                  }
                } catch (_) {
                  // Fallback gracefully if reverse geocoding is unavailable
                }

                final coordsStr = 'Lat: ${position.latitude.toStringAsFixed(5)}, Lon: ${position.longitude.toStringAsFixed(5)}';

                setDialogState(() {
                  isCapturing = false;
                  if (readableAddress.isNotEmpty) {
                    shopLocation = readableAddress;
                  } else {
                    shopLocation = coordsStr;
                  }
                });
              } catch (e) {
                setDialogState(() {
                  isCapturing = false;
                  shopLocation = null;
                });
                if (mounted) {
                  toastification.show(
                    context: context,
                    type: ToastificationType.error,
                    title: const Text('Capture Failed'),
                    description: Text('Failed to retrieve location: $e'),
                    autoCloseDuration: const Duration(seconds: 4),
                  );
                }
              }
            }

            return Dialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              backgroundColor: widget.cardBg,
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 450),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: SingleChildScrollView(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // Header with close button
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Add New Customer',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            IconButton(
                              icon: const Icon(LucideIcons.x, size: 20),
                              onPressed: () => Navigator.pop(ctx),
                            ),
                          ],
                        ),
                        const Divider(height: 1),
                        const SizedBox(height: 8),

                        // Form Fields
                        buildFieldLabel('Customer Name', isRequired: true),
                        buildTextField(controller: nameCtrl, hintText: 'Enter customer name'),

                        buildFieldLabel('Shop Name'),
                        buildTextField(controller: shopNameCtrl, hintText: 'Enter shop name'),

                        buildFieldLabel('Mobile Number', isRequired: true),
                        buildTextField(
                          controller: mobileCtrl,
                          hintText: 'Enter mobile number',
                          keyboardType: TextInputType.phone,
                        ),

                        buildFieldLabel('Address'),
                        buildTextField(controller: addressCtrl, hintText: 'Enter address'),

                        buildFieldLabel('Current Shop Location'),
                        Row(
                          children: [
                            OutlinedButton.icon(
                              onPressed: isCapturing ? null : captureCoordinates,
                              icon: isCapturing
                                  ? const SizedBox(
                                      width: 12,
                                      height: 12,
                                      child: CircularProgressIndicator(strokeWidth: 1.5, color: AppColors.primary),
                                    )
                                  : const Icon(LucideIcons.mapPin, size: 14, color: AppColors.primary),
                              label: Text(
                                isCapturing ? 'Capturing...' : 'Capture',
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primary),
                              ),
                              style: OutlinedButton.styleFrom(
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(24),
                                ),
                                side: const BorderSide(color: AppColors.primary),
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                shopLocation ?? 'Not captured',
                                style: TextStyle(
                                  fontSize: 13,
                                  color: shopLocation != null
                                      ? (isCapturing ? Colors.orange : Colors.green)
                                      : Colors.grey,
                                  fontWeight: shopLocation != null ? FontWeight.bold : FontWeight.normal,
                                ),
                              ),
                            ),
                          ],
                        ),

                        buildFieldLabel('Notes'),
                        buildTextField(controller: notesCtrl, hintText: 'Enter notes', maxLines: 3),

                        const SizedBox(height: 24),

                        // Submit action button
                        ElevatedButton(
                          onPressed: () {
                            final name = nameCtrl.text.trim();
                            final mobile = mobileCtrl.text.trim();
                            final address = addressCtrl.text.trim();
                            final notes = notesCtrl.text.trim();

                            if (name.isEmpty) {
                              toastification.show(
                                context: ctx,
                                type: ToastificationType.warning,
                                style: ToastificationStyle.flatColored,
                                title: const Text('Validation Warning'),
                                description: const Text('Customer Name is required.'),
                                autoCloseDuration: const Duration(seconds: 3),
                              );
                              return;
                            }

                            if (mobile.isEmpty) {
                              toastification.show(
                                context: ctx,
                                type: ToastificationType.warning,
                                style: ToastificationStyle.flatColored,
                                title: const Text('Validation Warning'),
                                description: const Text('Mobile Number is required.'),
                                autoCloseDuration: const Duration(seconds: 3),
                              );
                              return;
                            }

                            setDialogState(() {
                              isSaving = true;
                            });

                            final shopName = shopNameCtrl.text.trim();
                            final newCustomer = SalesCustomerModel(
                              id: '',
                              name: name,
                              shopName: shopName.isEmpty ? null : shopName,
                              mobile: mobile,
                              address: address.isEmpty ? null : address,
                              shopLocation: shopLocation,
                              notes: notes.isEmpty ? null : notes,
                              createdAt: DateTime.now(),
                            );

                            context.read<SalesManagementCubit>().createCustomer(newCustomer).then((_) {
                              if (mounted) {
                                setState(() {
                                  _searchController.text = name;
                                });
                                context.read<SalesManagementCubit>().filterCustomers(name);
                                _searchFocusNode.requestFocus();
                                Navigator.pop(ctx);
                                toastification.show(
                                  context: context,
                                  type: ToastificationType.success,
                                  title: const Text('Customer Added'),
                                  description: Text('"$name" added successfully. Tap on the suggestion list to select.'),
                                  autoCloseDuration: const Duration(seconds: 4),
                                );
                              }
                            }).catchError((err) {
                              setDialogState(() {
                                isSaving = false;
                              });
                              toastification.show(
                                context: ctx,
                                type: ToastificationType.error,
                                title: const Text('Failed to Add Customer'),
                                description: Text(err.toString().replaceFirst('Exception: ', '')),
                                autoCloseDuration: const Duration(seconds: 4),
                              );
                            });
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primaryGlow,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(24),
                            ),
                          ),
                          child: isSaving
                              ? const SizedBox(
                                  width: 20,
                                  height: 20,
                                  child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                )
                              : const Text(
                                  'Save Customer',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 15,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }


  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: BorderSide(color: widget.borderColor, width: 1),
      ),
      color: widget.cardBg,
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // 1. SELECT CUSTOMER HEADER
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                RichText(
                  text: TextSpan(
                    text: 'SELECT CUSTOMER / SHOP',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.5,
                      color: widget.subtextColor,
                    ),
                    children: const [
                      TextSpan(text: ' *', style: TextStyle(color: Colors.red)),
                    ],
                  ),
                ),
                InkWell(
                  onTap: _showAddNewCustomerDialog,
                  borderRadius: BorderRadius.circular(8),
                  child: const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    child: Row(
                      children: [
                        Icon(LucideIcons.userPlus, size: 14, color: AppColors.primary),
                        SizedBox(width: 4),
                        Text(
                          'Add New Customer',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Search Text Field
            TextField(
              controller: _searchController,
              focusNode: _searchFocusNode,
              onTap: () => _filterCustomers(_searchController.text),
              onChanged: _filterCustomers,
              decoration: InputDecoration(
                hintText: 'Search name, shop, phone or address',
                prefixIcon: const Icon(LucideIcons.search, size: 18),
                filled: true,
                fillColor: widget.isDark ? const Color(0xFF111827) : const Color(0xFFF8FAFC),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide(color: widget.borderColor),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide(color: widget.borderColor),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
                ),
              ),
            ),
            const SizedBox(height: 8),

            // Filtered List Suggestions
            BlocBuilder<SalesManagementCubit, SalesManagementState>(
              builder: (context, state) {
                final showDropdown = _searchFocusNode.hasFocus;
                if (!showDropdown) {
                  return const SizedBox.shrink();
                }

                // If loading customers
                if (state.loadingCustomers) {
                  return Container(
                    padding: const EdgeInsets.all(16),
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: widget.isDark ? const Color(0xFF111827) : const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: widget.borderColor),
                    ),
                    child: const Center(
                      child: SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary),
                      ),
                    ),
                  );
                }

                // If customers loading failed
                if (state.customersError.isNotEmpty) {
                  return Container(
                    padding: const EdgeInsets.all(16),
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: widget.isDark ? const Color(0xFF111827) : const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: widget.borderColor),
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(LucideIcons.alertTriangle, size: 24, color: Colors.redAccent),
                        const SizedBox(height: 8),
                        Text(
                          state.customersError,
                          style: const TextStyle(color: Colors.redAccent, fontSize: 12),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 8),
                        TextButton.icon(
                          onPressed: () {
                            context.read<SalesManagementCubit>().loadCustomers();
                          },
                          icon: const Icon(LucideIcons.refreshCw, size: 12),
                          label: const Text('Retry', style: TextStyle(fontSize: 12)),
                        ),
                      ],
                    ),
                  );
                }

                // If customers list is empty
                if (state.customers.isEmpty) {
                  return Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: widget.isDark ? const Color(0xFF111827) : const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: widget.borderColor),
                    ),
                    child: const Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(LucideIcons.users, size: 32, color: Colors.grey),
                        SizedBox(height: 8),
                        Text(
                          'No customer available',
                          style: TextStyle(color: Colors.grey, fontSize: 13, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  );
                }

                // If search query is not empty but no matching filter results
                final suggestions = state.filteredCustomers;
                if (suggestions.isEmpty && _searchController.text.trim().isNotEmpty) {
                  return Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(
                      color: widget.isDark ? const Color(0xFF111827) : const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: widget.borderColor),
                    ),
                    child: const Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(LucideIcons.search, size: 32, color: Colors.grey),
                        SizedBox(height: 8),
                        Text(
                          'No matching customers found',
                          style: TextStyle(color: Colors.grey, fontSize: 13),
                        ),
                      ],
                    ),
                  );
                }

                // Otherwise show suggestion list (either filtered suggestions, or all customers if query is empty)
                final listToShow = _searchController.text.trim().isEmpty ? state.customers : suggestions;

                return Container(
                  constraints: const BoxConstraints(maxHeight: 220),
                  margin: const EdgeInsets.only(bottom: 12),
                  decoration: BoxDecoration(
                    color: widget.isDark ? const Color(0xFF111827) : const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: widget.borderColor),
                  ),
                  child: ListView.separated(
                    shrinkWrap: true,
                    padding: const EdgeInsets.all(8),
                    itemCount: listToShow.length,
                    separatorBuilder: (_, __) => const Divider(height: 1),
                    itemBuilder: (context, index) {
                      final customer = listToShow[index];
                      return ListTile(
                        title: Text(
                          customer.name,
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                        subtitle: Text(
                          customer.mobile + (customer.address != null ? ' • ${customer.address}' : ''),
                          style: TextStyle(fontSize: 11, color: widget.subtextColor),
                        ),
                        trailing: const Icon(LucideIcons.plus, size: 16, color: AppColors.primary),
                        onTap: () {
                          setState(() {
                            _selectedCustomer = customer;
                            _searchController.clear();
                            _searchFocusNode.unfocus();
                          });
                          context.read<SalesManagementCubit>().clearFilteredCustomers();
                        },
                      );
                    },
                  ),
                );
              },
            ),

            // Selected Customer Card
            if (_selectedCustomer != null)
              Container(
                padding: const EdgeInsets.all(12),
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.05),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.primary.withValues(alpha: 0.3), width: 1.5),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      backgroundColor: AppColors.primary.withValues(alpha: 0.12),
                      child: const Icon(LucideIcons.user, color: AppColors.primary, size: 18),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _selectedCustomer!.name,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            _selectedCustomer!.mobile,
                            style: TextStyle(fontSize: 11, color: widget.subtextColor),
                          ),
                          if (_selectedCustomer!.address != null) ...[
                            const SizedBox(height: 2),
                            Text(
                              _selectedCustomer!.address!,
                              style: TextStyle(fontSize: 11, color: widget.subtextColor),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ]
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(LucideIcons.x, size: 16, color: Colors.red),
                      onPressed: () => setState(() => _selectedCustomer = null),
                    ),
                  ],
                ),
              ),

            const SizedBox(height: 16),

            // 2. SALE AMOUNT (SAR)
            RichText(
              text: TextSpan(
                text: 'SALE AMOUNT (SAR)',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.5,
                  color: widget.subtextColor,
                ),
                children: const [
                  TextSpan(text: ' *', style: TextStyle(color: Colors.red)),
                ],
              ),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _amountController,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              inputFormatters: [
                FilteringTextInputFormatter.allow(RegExp(r'^\d+\.?\d{0,2}')),
              ],
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
              decoration: InputDecoration(
                filled: true,
                fillColor: widget.isDark ? const Color(0xFF111827) : const Color(0xFFF8FAFC),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide(color: widget.borderColor),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide(color: widget.borderColor),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
                ),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Reported visit amount only — no invoice is created.',
              style: TextStyle(fontSize: 11, color: widget.subtextColor, fontStyle: FontStyle.italic),
            ),

            const SizedBox(height: 24),

            // PAYMENT TYPE
            RichText(
              text: TextSpan(
                text: 'PAYMENT TYPE',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.5,
                  color: widget.subtextColor,
                ),
                children: const [
                  TextSpan(text: ' *', style: TextStyle(color: Colors.red)),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Segmented pill selectors row
            Row(
              children: ['Cash', 'Bank', 'Credit', 'Partial'].map((type) {
                final isSelected = _paymentType == type;
                return Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4.0),
                    child: InkWell(
                      onTap: () => setState(() => _paymentType = type),
                      borderRadius: BorderRadius.circular(24),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        decoration: BoxDecoration(
                          color: isSelected ? AppColors.primaryGlow : Colors.transparent,
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(
                            color: isSelected ? AppColors.primaryGlow : widget.borderColor,
                            width: 1.5,
                          ),
                        ),
                        child: Center(
                          child: Text(
                            type,
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.bold,
                              color: isSelected ? Colors.white : widget.textColor,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 16),

            // Partial breakdown container
            if (_paymentType == 'Partial') ...[
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: widget.isDark ? const Color(0xFF1E293B) : const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: widget.borderColor),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Row(
                      children: [
                        // CASH
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'CASH',
                                style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: widget.subtextColor),
                              ),
                              const SizedBox(height: 6),
                              TextField(
                                controller: _cashController,
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                inputFormatters: [
                                  FilteringTextInputFormatter.allow(RegExp(r'^\d+\.?\d{0,2}')),
                                ],
                                textAlign: TextAlign.center,
                                decoration: InputDecoration(
                                  filled: true,
                                  fillColor: widget.isDark ? const Color(0xFF111827) : Colors.white,
                                  contentPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
                                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: widget.borderColor)),
                                  enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: widget.borderColor)),
                                  focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.primary)),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),

                        // BANK
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'BANK',
                                style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: widget.subtextColor),
                              ),
                              const SizedBox(height: 6),
                              TextField(
                                controller: _bankController,
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                inputFormatters: [
                                  FilteringTextInputFormatter.allow(RegExp(r'^\d+\.?\d{0,2}')),
                                ],
                                textAlign: TextAlign.center,
                                decoration: InputDecoration(
                                  filled: true,
                                  fillColor: widget.isDark ? const Color(0xFF111827) : Colors.white,
                                  contentPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
                                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: widget.borderColor)),
                                  enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: widget.borderColor)),
                                  focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.primary)),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),

                        // CREDIT
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'CREDIT',
                                style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: widget.subtextColor),
                              ),
                              const SizedBox(height: 6),
                              TextField(
                                controller: _creditController,
                                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                inputFormatters: [
                                  FilteringTextInputFormatter.allow(RegExp(r'^\d+\.?\d{0,2}')),
                                ],
                                textAlign: TextAlign.center,
                                decoration: InputDecoration(
                                  filled: true,
                                  fillColor: widget.isDark ? const Color(0xFF111827) : Colors.white,
                                  contentPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
                                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: widget.borderColor)),
                                  enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide(color: widget.borderColor)),
                                  focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: AppColors.primary)),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Totals and warning calculations
                    Builder(
                      builder: (context) {
                        final enteredAmount = double.tryParse(_amountController.text.trim()) ?? 0.0;
                        final cashAmt = double.tryParse(_cashController.text.trim()) ?? 0.0;
                        final bankAmt = double.tryParse(_bankController.text.trim()) ?? 0.0;
                        final creditAmt = double.tryParse(_creditController.text.trim()) ?? 0.0;
                        final totalBreakdown = cashAmt + bankAmt + creditAmt;

                        final diff = (totalBreakdown - enteredAmount).abs();
                        final isLess = totalBreakdown < enteredAmount;
                        final matches = diff <= 0.01;

                        return Column(
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text('Entered Sale Amount', style: TextStyle(fontSize: 12, color: widget.subtextColor)),
                                Text('${enteredAmount.toStringAsFixed(2)} SAR', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: widget.textColor)),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text('Payment Breakdown Total', style: TextStyle(fontSize: 12, color: widget.subtextColor)),
                                Text('${totalBreakdown.toStringAsFixed(2)} SAR', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: widget.textColor)),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Align(
                              alignment: Alignment.centerLeft,
                              child: Text(
                                matches
                                    ? 'Payment breakdown matches Sale Amount'
                                    : (isLess
                                        ? 'Payment breakdown is ${diff.toStringAsFixed(2)} SAR less than Sale Amount'
                                        : 'Payment breakdown is ${diff.toStringAsFixed(2)} SAR more than Sale Amount'),
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: matches ? Colors.green : Colors.red,
                                ),
                              ),
                            ),
                          ],
                        );
                      }
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
            ],

            const SizedBox(height: 24),

            // 3. NOTES
            Builder(
              builder: (context) {
                final enteredAmount = double.tryParse(_amountController.text.trim()) ?? 0.0;
                final isRequired = enteredAmount == 0;
                return RichText(
                  text: TextSpan(
                    text: isRequired ? 'NOTES' : 'NOTES (optional)',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.5,
                      color: widget.subtextColor,
                    ),
                    children: isRequired
                        ? const [
                            TextSpan(text: ' *', style: TextStyle(color: Colors.red)),
                          ]
                        : null,
                  ),
                );
              }
            ),
            const SizedBox(height: 8),
            Stack(
              children: [
                TextField(
                  controller: _notesController,
                  maxLines: 4,
                  maxLength: 500,
                  style: const TextStyle(fontSize: 14),
                  buildCounter: (context, {required currentLength, required isFocused, maxLength}) => null,
                  onChanged: (_) => setState(() {}),
                  decoration: InputDecoration(
                    hintText: 'Any note about this visit...',
                    filled: true,
                    fillColor: widget.isDark ? const Color(0xFF111827) : const Color(0xFFF8FAFC),
                    contentPadding: const EdgeInsets.all(16),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                      borderSide: BorderSide(color: widget.borderColor),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                      borderSide: BorderSide(color: widget.borderColor),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16),
                      borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
                    ),
                  ),
                ),
                Positioned(
                  bottom: 12,
                  right: 12,
                  child: Text(
                    '${_notesController.text.length}/500',
                    style: TextStyle(fontSize: 11, color: widget.subtextColor),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // 4. SHOP PHOTO
            RichText(
              text: TextSpan(
                text: 'SHOP PHOTO',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 0.5,
                  color: widget.subtextColor,
                ),
                children: const [
                  TextSpan(text: ' *', style: TextStyle(color: Colors.red)),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Take Photo Button / Preview
            if (_selectedImagePath == null)
              ElevatedButton.icon(
                onPressed: _takePhoto,
                icon: const Icon(LucideIcons.camera, color: Colors.white),
                label: const Text(
                  'Take Shop Photo',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
              )
            else
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Stack(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Image.file(
                          File(_selectedImagePath!),
                          height: 200,
                          width: double.infinity,
                          fit: BoxFit.cover,
                        ),
                      ),
                      Positioned(
                        top: 8,
                        right: 8,
                        child: InkWell(
                          onTap: () => setState(() => _selectedImagePath = null),
                          child: Container(
                            padding: const EdgeInsets.all(6),
                            decoration: const BoxDecoration(
                              color: Colors.black54,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(LucideIcons.x, color: Colors.white, size: 16),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  TextButton.icon(
                    onPressed: _takePhoto,
                    icon: const Icon(LucideIcons.refreshCw, size: 14, color: AppColors.primary),
                    label: const Text(
                      'Retake Photo',
                      style: TextStyle(fontSize: 12, color: AppColors.primary, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Beautiful Location Card
                  Card(
                    elevation: 0,
                    color: widget.isDark ? const Color(0xFF1E293B) : const Color(0xFFF1F5F9),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                      side: BorderSide(color: widget.borderColor),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          CircleAvatar(
                            radius: 18,
                            backgroundColor: AppColors.primary.withValues(alpha: 0.1),
                            child: const Icon(LucideIcons.mapPin, color: AppColors.primary, size: 18),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'CAPTURED LOCATION',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: widget.subtextColor,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                                const SizedBox(height: 6),
                                if (_isCapturingLocation) ...[
                                  const SizedBox(
                                    height: 14,
                                    width: 14,
                                    child: CircularProgressIndicator(strokeWidth: 1.5, color: AppColors.primary),
                                  ),
                                  const SizedBox(height: 4),
                                ],
                                Text(
                                  _capturedCoordinates ?? 'No coordinates captured',
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                    color: widget.textColor,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  _capturedAddress ?? 'No address retrieved',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: widget.subtextColor,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),

            const SizedBox(height: 32),

            // Submit Button
            ElevatedButton(
              onPressed: _isValid && !_isSubmitting ? _submit : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: _isValid && !_isSubmitting ? AppColors.primaryGlow : (widget.isDark ? Colors.white12 : Colors.grey[300]),
                disabledBackgroundColor: widget.isDark ? Colors.white12 : Colors.grey[300],
                padding: const EdgeInsets.symmetric(vertical: 18),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: _isSubmitting
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                    )
                  : Text(
                      'Submit Visit Report',
                      style: TextStyle(
                        color: _isValid && !_isSubmitting ? Colors.white : (widget.isDark ? Colors.white38 : Colors.grey[600]),
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
