import 'package:hive/hive.dart';

part 'user_model.g.dart';

@HiveType(typeId: 6)
class UserModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String? email;

  @HiveField(2)
  final String? fullName;

  @HiveField(3)
  final String? mobile;

  @HiveField(4)
  final String? username;

  @HiveField(5)
  final String? landingPage;

  @HiveField(6)
  final bool isDisabled;

  @HiveField(7)
  final DateTime createdAt;

  UserModel({
    required this.id,
    this.email,
    this.fullName,
    this.mobile,
    this.username,
    this.landingPage,
    this.isDisabled = false,
    required this.createdAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      email: json['email'] as String?,
      fullName: json['full_name'] as String?,
      mobile: json['mobile'] as String?,
      username: json['username'] as String?,
      landingPage: json['landing_page'] as String?,
      isDisabled: json['is_disabled'] as bool? ?? false,
      createdAt: json['created_at'] != null 
          ? DateTime.parse(json['created_at'] as String) 
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'full_name': fullName,
      'mobile': mobile,
      'username': username,
      'landing_page': landingPage,
      'is_disabled': isDisabled,
      'created_at': createdAt.toIso8601String(),
    };
  }
}
