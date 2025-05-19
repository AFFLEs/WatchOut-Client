import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import SectionCard from '../../components/SectionCard';

const dummyPhoto = require('../../assets/icons/edit.png'); 

export default function TravelRecordDetailScreen({ route }) {
  const { dateLabel, schedules, city, country, photo } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
        <SectionCard>
            <Image
            source={photo || dummyPhoto}
            style={styles.topImage}
            resizeMode="cover"
          />
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
});