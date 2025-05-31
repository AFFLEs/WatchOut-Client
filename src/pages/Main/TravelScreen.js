import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import TravelScheduleCard from '../../components/TravelScheduleCard';
import TravelRecordCard from '../../components/TravelRecordCard';
import SectionCard from '../../components/SectionCard';
import AddTravelButton from '../../components/AddTravelButton';
import TravelRecordNotice from '../../components/TravelRecordNotice';
import ExportTravelRecord from '../../components/ExportTravelRecord';
import ScheduleInputModal from '../../components/ScheduleInputModal';
import { useNavigation } from '@react-navigation/native';
import { travelAPI } from '../../apis/travelAPI';

export default function TravelScreen() {
  const [scheduleByDate, setScheduleByDate] = useState({
    '2025년 5월 19일 (월)': [
      {
        spotId: 4,
        spotTime: '10:00',
        spotName: 'Radio City',
        spotDetail: '1260 6th Ave, New York, NY 10020 미국',
        latitude: 40.7599,
        longitude: -73.9802
      },
      {
        spotId: 1,
        spotTime: '11:00',
        spotName: 'Disney Store',
        spotDetail: '1540 Broadway, New York, NY 10036 미국',
        latitude: 40.7566,
        longitude: -73.9863
      },
      {
        spotId: 5,
        spotTime: '12:30',
        spotName: 'Central Park',
        spotDetail: 'Central Park, New York, NY, 미국',
        latitude: 40.7829,
        longitude: -73.9654
      },
    ],
    '2025년 5월 20일 (화)': [
      {
        spotId: 1,
        spotTime: '13:00',
        spotName: 'Disney Store',
        spotDetail: '1540 Broadway, New York, NY 10036 미국',
        latitude: 40.7566,
        longitude: -73.9863
      },
      {
        spotId: 5,
        spotTime: '15:30',
        spotName: 'Central Park',
        spotDetail: 'Central Park, New York, NY, 미국',
        latitude: 40.7829,
        longitude: -73.9654
      },
    ],
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [travelDates, setTravelDates] = useState({
    departDate: '',
    arriveDate: ''
  });
  const navigation = useNavigation();

  // 저장 핸들러
  const handleSaveSchedule = (newData) => {
    setScheduleByDate(newData);
    setModalVisible(false);
  };

  useEffect(() => {
    const fetchTravelDates = async () => {
      try {
        const response = await travelAPI.getTravelDate();
        setTravelDates({
          departDate: response.data.data.departDate,
          arriveDate: response.data.data.arriveDate
        });
      } catch (error) {
        console.error('Failed to fetch travel dates:', error);
      }
    };

    fetchTravelDates();
  }, []);

  // 데이터 포맷팅
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekDay = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
    return `${month}월 ${day}일 (${weekDay})`;
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5', padding: 2 }}>
      <SectionCard title="여행 일정">
        <TravelScheduleCard 
          departureDate={travelDates.departDate ? formatDate(travelDates.departDate) : ' '} 
          returnDate={travelDates.arriveDate ? formatDate(travelDates.arriveDate) : ' '}
        />
      </SectionCard>
      <SectionCard title="여행 기록 카드">
        <AddTravelButton onPress={() => setModalVisible(true)} />
        {Object.entries(scheduleByDate).map(([dateLabel, schedules], idx) => (
          <TravelRecordCard
            key={dateLabel}
            dateLabel={dateLabel}
            city="New York"
            country="USA"
            schedules={schedules.map(schedule => ({
              time: schedule.spotTime,
              place: schedule.spotName,
              address: schedule.spotDetail,
              latitude: schedule.latitude,
              longitude: schedule.longitude
            }))}
            onCheckSchedule={() => navigation.navigate('TravelRecordDetail', {
              dateLabel,
              schedules: schedules.map(schedule => ({
                time: schedule.spotTime,
                place: schedule.spotName,
                address: schedule.spotDetail,
                latitude: schedule.latitude,
                longitude: schedule.longitude
              })),
              city: "New York",
              country: "USA",
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
          departureDate="2025년 5월 19일 (월)"
          returnDate="2025년 5월 23일 (금)"
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
