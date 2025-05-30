import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SectionCard from '../../components/SectionCard';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';


export default function TravelRecordDetailScreen({ route }) {
  const { dateLabel, schedules, city, country } = route.params;
  const [coordinates, setCoordinates] = useState([]);
  
  // 제주도 중심 좌표를 기본값으로 설정
  const [region, setRegion] = useState({
    latitude: 33.4890,  
    longitude: 126.4983,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });

  useEffect(() => {
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
  }, [schedules]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
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
              title={schedules[index]?.place}
              description={`${schedules[index]?.time} - ${schedules[index]?.address}`}
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
        <Text style={styles.title}>{dateLabel}</Text>
        <Text style={styles.subtitle}>{city}, {country}</Text>
        <Text style={styles.sectionTitle}>일정 목록</Text>
        {(!schedules || schedules.length === 0) ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>등록된 일정이 없습니다.</Text>
          </View>
        ) : (
          schedules.map((item, idx) => (
            <View key={idx} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.timeBadge}>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.place}>{item.place}</Text>
                  <Text style={styles.address}>{item.address}</Text>
                </View>
              </View>
            </View>
          ))
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
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222B3A',
    marginBottom: 10,
    marginLeft: 4,
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
    padding: 32,
    alignItems: 'center',
    marginTop: 32,
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
});