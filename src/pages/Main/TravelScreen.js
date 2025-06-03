import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import TravelScheduleCard from '../../components/TravelScheduleCard';
import TravelRecordCard from '../../components/TravelRecordCard';
import SectionCard from '../../components/SectionCard';
import AddTravelButton from '../../components/AddTravelButton';
import TravelRecordNotice from '../../components/TravelRecordNotice';
import ExportTravelRecord from '../../components/ExportTravelRecord';
import ScheduleInputModal from '../../components/ScheduleInputModal';
import { useNavigation } from '@react-navigation/native';
import { travelAPI } from '../../apis/travelAPI';
import { useLocation } from '../../contexts/LocationContext';
import { formatDate, formatDatewithYear, formatTime } from '../../utils/timeUtils';

export default function TravelScreen() {
  const [scheduleByDate, setScheduleByDate] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [travelDates, setTravelDates] = useState({
    departDate: '',
    arriveDate: ''
  });
  const { locationInfo } = useLocation();
  const navigation = useNavigation();

  // 저장 핸들러
  const handleSaveSchedule = (newData) => {
    setScheduleByDate(newData);
    setModalVisible(false);
  };

  const fetchLatestTravelSpot = async () => {
    try {
      const response = await travelAPI.getLatestTravelSpot();
      setScheduleByDate(response.data);
    } catch (error) {
      console.error('Failed to fetch latest travel spot:', error);
    }
  };

  const fetchTravelDates = async () => {
    try {
      const response = await travelAPI.getTravelDate();
      
      if (!response?.data) {
        console.error('Invalid travel dates response:', response);
        return;
      }

      const { departDate, arriveDate } = response.data;
      
      setTravelDates({
        departDate: departDate || '',
        arriveDate: arriveDate || ''
      });
    } catch (error) {
      console.error('Failed to fetch travel dates:', error);
      setTravelDates({
        departDate: '',
        arriveDate: ''
      });
    }
  };

  // 화면에 포커스될 때마다 데이터 새로 불러오기
  useFocusEffect(
    React.useCallback(() => {
      fetchTravelDates();
      fetchLatestTravelSpot();
    }, [])
  );

  // 모든 일정 렌더링
  const renderTravelRecords = () => {
    console.log('Current scheduleByDate:', scheduleByDate);
    
    if (!scheduleByDate || typeof scheduleByDate !== 'object') {
      console.warn('Invalid scheduleByDate:', scheduleByDate);
      return null;
    }

    return Object.entries(scheduleByDate)
      .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
      .map(([dateLabel, schedules]) => {
      
        if (!Array.isArray(schedules)) {
          console.warn(`❌ Invalid schedules for date ${dateLabel}:`, schedules);
          return null;
        }

        const lastSchedule = schedules[schedules.length - 1];

        // YYYY-MM-DD 형식의 날짜를 Date 객체로 변환
        const dateObj = new Date(dateLabel);
        
        return (
          <TravelRecordCard
            key={dateLabel}
            dateLabel={formatDate(dateObj)}
            city={lastSchedule?.city || locationInfo?.city}
            country={lastSchedule?.country || locationInfo?.country}
            schedules={schedules.map(schedule => ({
              time: schedule.spotTime ? formatTime(schedule.spotTime) : 'PLAN',
              place: schedule.spotName,
              address: schedule.spotDetail,
              latitude: schedule.latitude,
              longitude: schedule.longitude
            }))}
            onCheckSchedule={() => navigation.navigate('TravelRecordDetail', {
              dateLabel: dateLabel,
              city: lastSchedule?.city || locationInfo?.city,
              country: lastSchedule?.country || locationInfo?.country,
            })}
          />
        );
      })
      .filter(Boolean); // null 값 제거
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5', padding: 2 }}>
      <SectionCard title="여행 일정">
        <TravelScheduleCard 
          departureDate={formatDate(travelDates.departDate)} 
          returnDate={formatDate(travelDates.arriveDate)}
        />
      </SectionCard>
      <SectionCard title="여행 기록 카드">
        <AddTravelButton onPress={() => setModalVisible(true)} />
        {renderTravelRecords()}
        <TravelRecordNotice />
        <ExportTravelRecord scheduleByDate={scheduleByDate} />
        <ScheduleInputModal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          onSave={handleSaveSchedule}
          initialData={scheduleByDate}
          departureDate={formatDatewithYear(travelDates.departDate)}
          returnDate={formatDatewithYear(travelDates.arriveDate)}
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
