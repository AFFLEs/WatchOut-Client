import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import SectionCard from '../../components/SectionCard';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import { travelAPI } from '../../apis/travelAPI';
import { formatDate, formatTime } from '../../utils/timeUtils';

export default function TravelRecordDetailScreen({ route }) {
  const { dateLabel, city, country } = route.params;
  const [coordinates, setCoordinates] = useState([]);
  const [schedules, setSchedules] = useState(null);
  const [timeSchedules, setTimeSchedules] = useState([]);
  const [planSchedules, setPlanSchedules] = useState([]);
  
  
  // 제주도 중심 좌표를 기본값으로 설정
  const [region, setRegion] = useState({
    latitude: 33.4890,  
    longitude: 126.4983,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });

  const fetchDetailTravelSpot = async () => {
    try {
      const response = await travelAPI.getDetailTravelSpot(dateLabel);
      setSchedules(response.data);
      setTimeSchedules(response.data.filter(item => item.isPlan === false));
      setPlanSchedules(response.data.filter(item => item.isPlan === true));
      console.log("planSchedules", planSchedules);

      if (schedules && schedules.length > 0) {
        const sortedSchedules = [...schedules].sort((a, b) => {
          const timeA = new Date(`2000/01/01 ${a.time}`).getTime();
          const timeB = new Date(`2000/01/01 ${b.time}`).getTime();
          return timeA - timeB;
        });
  
        const coords = sortedSchedules
          .filter(schedule => schedule.latitude && schedule.longitude)
          .map(schedule => ({
            latitude: schedule.latitude,
            longitude: schedule.longitude
          }));
  
        setCoordinates(coords);
  
        // 모든 마커가 보이도록 지도 중심과 줌 레벨 조정
        if (coords.length > 0) {
          const latitudes = coords.map(coord => coord.latitude);
          const longitudes = coords.map(coord => coord.longitude);
          const minLat = Math.min(...latitudes);
          const maxLat = Math.max(...latitudes);
          const minLng = Math.min(...longitudes);
          const maxLng = Math.max(...longitudes);
  
          setRegion({
            latitude: (minLat + maxLat) / 2,
            longitude: (minLng + maxLng) / 2,
            latitudeDelta: (maxLat - minLat) * 1.5 || 0.02,
            longitudeDelta: (maxLng - minLng) * 1.5 || 0.02,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch detail travel spot:', error);
    }
  };

  useEffect(() => {
    fetchDetailTravelSpot();
  }, []);

  const handleDeleteSpot = async (spotId) => {
    try {
      await travelAPI.deleteTravelSpot(spotId);
      // 삭제 후 목록 업데이트
      setPlanSchedules(prevSchedules => 
        prevSchedules.filter(schedule => schedule.id !== spotId)
      );
      // 전체 schedules도 업데이트
      setSchedules(prevSchedules =>
        prevSchedules.filter(schedule => schedule.id !== spotId)
      );
      // coordinates 업데이트
      updateCoordinatesAfterDelete();
      fetchDetailTravelSpot()
    } catch (error) {
      console.error('Failed to delete travel spot:', error);
      Alert.alert('오류', '삭제 중 오류가 발생했습니다.');
    }
  };

  const updateCoordinatesAfterDelete = () => {
    if (schedules) {
      const updatedCoords = schedules
        .filter(schedule => schedule.latitude && schedule.longitude)
        .map(schedule => ({
          latitude: schedule.latitude,
          longitude: schedule.longitude
        }));
      setCoordinates(updatedCoords);
    }
  };

  const renderHiddenItem = (data) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => {
          Alert.alert(
            '일정 삭제',
            '이 일정을 삭제하시겠습니까?',
            [
              { text: '취소', style: 'cancel' },
              { 
                text: '삭제', 
                onPress: () => handleDeleteSpot(data.item.spotId),
                style: 'destructive'
              },
            ]
          );
        }}
      >
        <Text style={styles.backTextWhite}>삭제</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPlanItem = (data) => (
    <View style={[styles.card, styles.planCard]}>
      <View style={styles.row}>
        <View style={[styles.timeBadge, styles.planBadge]}>
          <Text style={[styles.timeText, styles.planText]}>PLAN</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.place}>{data.item.spotName}</Text>
          <Text style={styles.address}>{data.item.spotDetail}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={{ paddingBottom: 32 }}
      scrollEventThrottle={16}
      removeClippedSubviews={true}
    >
      <SectionCard>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
        >
          {coordinates.map((coord, index) => (
            <Marker
              key={index}
              coordinate={coord}
              title={schedules[index]?.spotName}
              description={schedules[index]?.spotDetail}
            />
          ))}
          {coordinates.length > 1 && (
            <Polyline
              coordinates={coordinates}
              strokeColor="#2563EB"
              strokeWidth={3}
            />
          )}
        </MapView>
        <Text style={styles.title}>{formatDate(dateLabel)}</Text>
        <Text style={styles.subtitle}>{city}, {country}</Text>
        
        <Text style={styles.sectionTitle}>방문 기록</Text>
        {timeSchedules.length > 0 ? (
          timeSchedules.map((item, idx) => (
            <View key={`time-${idx}`} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.timeBadge}>
                  <Text style={styles.timeText}>{formatTime(item.spotTime)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.place}>{item.spotName}</Text>
                  <Text style={styles.address}>{item.spotDetail}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>현재 측정된 방문 장소가 없습니다.</Text>
          </View>
        )}

        {planSchedules.length > 0 && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>방문 예정</Text>
            <View>
              {planSchedules.map((item, index) => (
                <View key={`plan-${item.spotId}`} style={{ backgroundColor: '#fff' }}>
                  <SwipeListView
                    data={[item]}
                    renderItem={renderPlanItem}
                    renderHiddenItem={renderHiddenItem}
                    rightOpenValue={-75}
                    disableRightSwipe
                    keyExtractor={(item) => item.spotId.toString()}
                    recalculateHiddenLayout
                    useNativeDriver={false}
                    scrollEnabled={false}
                    style={[styles.card, styles.planCard, { marginBottom: index === planSchedules.length - 1 ? 0 : 12 }]}
                  />
                </View>
              ))}
            </View>
          </>
        )}
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FA',
  },
  topImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    marginBottom: 18,
    backgroundColor: '#eee',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 2,
    color: '#222B3A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#8B95A1',
    marginBottom: 18,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeBadge: {
    backgroundColor: '#2563EB22',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 12,
    minWidth: 54,
    alignItems: 'center',
  },
  timeText: {
    color: '#2563EB',
    fontWeight: 'bold',
    fontSize: 14,
  },
  place: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222B3A',
    marginBottom: 2,
  },
  address: {
    fontSize: 13,
    color: '#8B95A1',
  },
  emptyBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  emptyText: {
    color: '#8B95A1',
    fontSize: 15,
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  planCard: {
    backgroundColor: '#F9FAFB',
    marginBottom: 3,
  },
  planBadge: {
    backgroundColor: '#E5E7EB',
  },
  planText: {
    color: '#4B5563',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingLeft: 15,
    marginBottom: 12,
    marginHorizontal: 2,
    borderRadius: 12,
    height: '100%',
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    height: '100%',
  },
  backRightBtnRight: {
    backgroundColor: '#EF4444',
    right: 0,
  },
  backTextWhite: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});