// src/components/TravelRecordCard.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';

export default function TravelRecordCard({
  dateLabel,
  city,
  country,
  mapImage,
  schedules,
  onDownload,
}) {
  return (
    <View style={styles.card}>
      <Image source={mapImage} style={styles.map} />
      <View style={styles.dateRow}>
        <Text style={styles.dateLabel}>{dateLabel}</Text>
        <Text style={styles.cityCountry}>{city}, {country}</Text>
      </View>
      {schedules.map((item, idx) => (
        <View key={idx} style={styles.scheduleRow}>
          <Text style={styles.time}>{item.time}</Text>
          <View>
            <Text style={styles.place}>{item.place}</Text>
            <Text style={styles.address}>{item.address}</Text>
          </View>
        </View>
      ))}
    </View>
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
    fontSize: 16,
    color: '#222B3A',
  },
  download: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: 'bold',
  },
  map: {
    width: '100%',
    height: 120,
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
    fontSize: 14,
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