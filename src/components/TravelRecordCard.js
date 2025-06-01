// src/components/TravelRecordCard.js
import React, { useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';

export default function TravelRecordCard({
  dateLabel,
  city,
  country,
  schedules,
  onCheckSchedule,
}) {
  // 정렬된 스케줄 계산
  const sortedSchedules = useMemo(() => {
    return schedules.sort((a, b) => {
      const timeA = new Date(`2000/01/01 ${a.time}`).getTime();
      const timeB = new Date(`2000/01/01 ${b.time}`).getTime();
      return timeA - timeB;
    });
  }, [schedules]);

  // 지도 region 계산
  const mapRegion = useMemo(() => {
    if (schedules.length === 0) {
      return {
        latitude: 40.7128,
        longitude: -74.0060,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
    }

    const validSchedules = schedules.filter(s => s.latitude && s.longitude);
    if (validSchedules.length === 0) {
      return {
        latitude: 40.7128,
        longitude: -74.0060,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
    }

    const latitudes = validSchedules.map(s => s.latitude);
    const longitudes = validSchedules.map(s => s.longitude);
    
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    // 위도/경도 차이 계산
    const latDelta = (maxLat - minLat) * 1.5 || 0.02;
    const lngDelta = (maxLng - minLng) * 1.5 || 0.02;

    // 중심점 계산
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;

    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: Math.max(latDelta, 0.02),
      longitudeDelta: Math.max(lngDelta, 0.02),
    };
  }, [schedules]);

  return (
    <ScrollView style={styles.card}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={mapRegion}
        mapPadding={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        {sortedSchedules.map((schedule, index) => (
          schedule.latitude && schedule.longitude && (
            <Marker
              key={index}
              coordinate={{
                latitude: schedule.latitude,
                longitude: schedule.longitude
              }}
              title={schedule.place}
              description={`${schedule.time} - ${schedule.address}`}
            />
          )
        ))}
        {sortedSchedules.length > 1 && (
          <Polyline
            coordinates={sortedSchedules
              .filter(schedule => schedule.latitude && schedule.longitude)
              .map(schedule => ({
                latitude: schedule.latitude,
                longitude: schedule.longitude
              }))}
            strokeColor="#2563EB"
            strokeWidth={3}
          />
        )}
      </MapView>
      <TouchableOpacity  onPress={onCheckSchedule}>
        <View style={styles.dateRow}>
          <Text style={styles.dateLabel}>{dateLabel}</Text>
          <Text style={styles.cityCountry}>{city}, {country}</Text>
        </View>
        {schedules.slice(0, 3).map((item, idx) => (
          <View key={idx} style={styles.scheduleRow}>
            <Text style={styles.time}>{item.time}</Text>
            <View>
              <Text style={styles.place}>{item.place}</Text>
              <Text style={styles.address}>{item.address}</Text>
            </View>
          </View>
        ))}
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
    marginHorizontal: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222B3A',
  },
  map: {
    width: '100%',
    height: 160,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#eee',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dateLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222B3A',
    marginBottom: 4,
  },
  cityCountry: {
    fontSize: 13,
    color: '#8B95A1',
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  time: {
    width: 50,
    fontSize: 13,
    color: '#8B95A1',
    marginRight: 8,
  },
  place: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#222B3A',
  },
  address: {
    fontSize: 12,
    color: '#8B95A1',
  },
});