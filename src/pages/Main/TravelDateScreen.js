import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function TravelDateScreen({ navigation }) {
  const [selectedDates, setSelectedDates] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const onDayPress = (day) => {
    if (!startDate || (startDate && endDate)) {
      // 새로운 선택 시작
      setStartDate(day.dateString);
      setEndDate('');
      setSelectedDates({
        [day.dateString]: {
          selected: true,
          startingDay: true,
          color: '#2563EB'
        }
      });
    } else {
      // 종료일 선택
      if (day.dateString < startDate) {
        // 시작일보다 이전 날짜 선택 시
        setStartDate(day.dateString);
        setEndDate(startDate);
      } else {
        setEndDate(day.dateString);
      }

      let dates = {};
      let currentDate = new Date(startDate);
      const endDateObj = new Date(day.dateString > startDate ? day.dateString : startDate);

      while (currentDate <= endDateObj) {
        const dateString = currentDate.toISOString().split('T')[0];
        dates[dateString] = {
          selected: true,
          color: '#2563EB'
        };
        
        if (dateString === startDate || dateString === (day.dateString < startDate ? startDate : day.dateString)) {
          dates[dateString].startingDay = dateString === (day.dateString < startDate ? day.dateString : startDate);
          dates[dateString].endingDay = dateString === (day.dateString > startDate ? day.dateString : startDate);
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }
      setSelectedDates(dates);
    }
  };

  const handleNext = () => {
    if (startDate && endDate) {
      // 회원가입 완료 알림
      Alert.alert(
        '회원가입 완료',
        '회원가입이 성공적으로 완료되었습니다.',
        [
          {
            text: '확인',
            onPress: () => {
              // 로그인 화면으로 이동하면서 선택된 날짜 정보 전달
              navigation.navigate('Login', { startDate, endDate });
            }
          }
        ],
        { cancelable: false }
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Image source={require('../../assets/icons/location2.png')} style={styles.locationIcon} />
          <Text style={styles.title}>안전한 여행을 위해{'\n'}여행 일정을 입력해 볼까요?</Text>
        </View>
      </View>

      <View style={styles.dateTypeContainer}>
        <TouchableOpacity style={styles.dateTypeButton}>
          <Text style={styles.dateTypeButtonText}>출발일</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.dateTypeButton, styles.dateTypeButtonInactive]}>
          <Text style={[styles.dateTypeButtonText, styles.dateTypeButtonTextInactive]}>도착일</Text>
        </TouchableOpacity>
      </View>

      <Calendar
        style={styles.calendar}
        theme={{
          calendarBackground: 'white',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#2563EB',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#2563EB',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#2563EB',
          selectedDotColor: '#ffffff',
          arrowColor: '#2563EB',
          monthTextColor: '#2d4150',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 14
        }}
        markingType={'period'}
        markedDates={selectedDates}
        onDayPress={onDayPress}
        enableSwipeMonths={true}
      />

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.nextButton, (!startDate || !endDate) && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!startDate || !endDate}
        >
          <Text style={styles.nextButtonText}>설정 완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    marginTop: 60,
    paddingHorizontal: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
    marginLeft: 20,
  },
  locationIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    marginTop: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  dateTypeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dateTypeButton: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  dateTypeButtonInactive: {
    backgroundColor: '#F3F4F6',
    borderColor: '#F3F4F6',
  },
  dateTypeButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  dateTypeButtonTextInactive: {
    color: '#6B7280',
  },
  calendar: {
    marginBottom: 20,
    borderRadius: 10,
  },
  footer: {
    padding: 20,
  },
  nextButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
}); 