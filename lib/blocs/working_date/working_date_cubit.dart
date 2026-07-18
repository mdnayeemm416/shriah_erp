import 'package:flutter_bloc/flutter_bloc.dart';

class WorkingDateCubit extends Cubit<DateTime> {
  WorkingDateCubit() : super(DateTime.now());

  void changeDate(DateTime newDate) {
    emit(newDate);
  }
}
