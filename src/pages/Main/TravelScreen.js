import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import TravelScheduleCard from '../../components/TravelScheduleCard';
import TravelRecordCard from '../../components/TravelRecordCard';
import SectionCard from '../../components/SectionCard';
import AddTravelButton from '../../components/AddTravelButton';
import TravelRecordNotice from '../../components/TravelRecordNotice';
import ExportTravelRecord from '../../components/ExportTravelRecord';
import ScheduleInputModal from '../../components/ScheduleInputModal';
import { useNavigation } from '@react-navigation/native';

export default function TravelScreen() {
  const [scheduleByDate, setScheduleByDate] = useState({
    '2025년 5월 4일 (일)': [
      { time: '10:00', place: 'Radio City, NewYork', address: '1260 6th Ave, New York, NY 10020 미국' },
      { time: '11:00', place: 'Disney Store, NewYork', address: '1540 Broadway, New York, NY 10036 미국' },
      { time: '12:30', place: 'Central Park, NewYork', address: 'Central Park, New York, NY, 미국' },
    ],
    '2025년 5월 3일 (토)': [
      { time: '10:00', place: 'Radio City, NewYork', address: '1260 6th Ave, New York, NY 10020 미국' },
      { time: '11:00', place: 'Disney Store, NewYork', address: '1540 Broadway, New York, NY 10036 미국' },
      { time: '12:30', place: 'Central Park, NewYork', address: 'Central Park, New York, NY, 미국' },
      { time: '13:00', place: 'Radio City, NewYork', address: '1260 6th Ave, New York, NY 10020 미국' },
      { time: '14:00', place: 'Disney Store, NewYork', address: '1540 Broadway, New York, NY 10036 미국' },
      { time: '15:30', place: 'Central Park, NewYork', address: 'Central Park, New York, NY, 미국' },
    ],
  });
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  // 등록/수정 가능한 날짜 리스트
  const dateList = Object.keys(scheduleByDate);

  // 저장 핸들러
  const handleSaveSchedule = (newData) => {
    setScheduleByDate(newData);
    setModalVisible(false);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5', padding: 2 }}>
      <SectionCard title="여행 일정">
        <TravelScheduleCard departureDate="05월 02일" returnDate="05월 06일" />
      </SectionCard>
      <SectionCard title="여행 기록 카드">
        <AddTravelButton onPress={() => setModalVisible(true)} />
        {Object.entries(scheduleByDate).map(([dateLabel, schedules], idx) => (
          <TravelRecordCard
            key={dateLabel}
            dateLabel={dateLabel}
            city="뉴욕"
            country="미국"
            mapImage={require('../../assets/icons/edit.png')}
            schedules={schedules.slice(-3)}
            onCheckSchedule={() => navigation.navigate('TravelRecordDetail', {
              dateLabel,
              schedules,
              city: "뉴욕",
              country: "미국",
            })}
          />
        ))}
        
        <TravelRecordNotice />
        <ExportTravelRecord scheduleByDate={scheduleByDate} />
        <ScheduleInputModal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          onSave={handleSaveSchedule}
          initialData={scheduleByDate}
          departureDate="2025년 5월 2일 (금)"
          returnDate="2025년 5월 20일 (화)"
        />
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
