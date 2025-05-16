import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import TravelScheduleCard from '../../components/TravelScheduleCard';
import TravelRecordCard from '../../components/TravelRecordCard';
import SectionCard from '../../components/SectionCard';
import AddTravelButton from '../../components/AddTravelButton';
import TravelRecordNotice from '../../components/TravelRecordNotice';

export default function TravelScreen() {
  const scheduleByDate = {
    '2025년 5월 4일 (일)': [
      { time: '10:00', place: 'Radio City, NewYork', address: '1260 6th Ave, New York, NY 10020 미국' },
      { time: '11:00', place: 'Disney Store, NewYork', address: '1540 Broadway, New York, NY 10036 미국' },
      { time: '12:30', place: 'Central Park, NewYork', address: 'Central Park, New York, NY, 미국' },
    ],
    '2025년 5월 3일 (토)': [
      { time: '10:00', place: 'Radio City, NewYork', address: '1260 6th Ave, New York, NY 10020 미국' },
      { time: '11:00', place: 'Disney Store, NewYork', address: '1540 Broadway, New York, NY 10036 미국' },
      { time: '12:30', place: 'Central Park, NewYork', address: 'Central Park, New York, NY, 미국' },
    ],
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5', padding: 2 }}>
      <SectionCard title="여행 일정">
        <TravelScheduleCard departureDate="05월 02일" returnDate="05월 06일" />
      </SectionCard>
      <SectionCard title="여행 기록 카드">
        <AddTravelButton onPress={() => {/* 일정 등록 동작 */}} />
        {Object.entries(scheduleByDate).map(([dateLabel, schedules], idx) => (
        <TravelRecordCard
          key={dateLabel}
          dateLabel={dateLabel}
          city="뉴욕"
          country="미국"
          mapImage={require('/Users/han-yewon/WebstormProjects/WatchOut-Client/src/assets/icons/edit.png')}
          schedules={schedules}
          isToday={idx === 0}
          onAddSchedule={() => {/* 일정 추가 동작 */}}
        />
      ))}
        <TravelRecordNotice />
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222B3A',
  },
  download: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  write: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FA',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    margin: 12,
  },
  noticeText: {
    color: '#8B95A1',
    fontSize: 14,
  },
});
