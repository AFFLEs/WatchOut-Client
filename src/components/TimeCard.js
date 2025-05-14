import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TimeCard({ localTime, localCity, homeTime, homeCity }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {/* 현지 시간 (좌측 정렬) */}
        <View style={[styles.timeBlock, styles.leftBlock]}>
          <Text style={styles.label}>현지 시간</Text>
          <Text style={styles.time}>{localTime}</Text>
          <Text style={styles.city}>{localCity}</Text>
        </View>
        {/* 구분선 */}
        <View style={styles.divider} />
        {/* 국내 시간 (우측 정렬) */}
        <View style={[styles.timeBlock, styles.rightBlock]}>
          <Text style={styles.label}>국내 시간</Text>
          <Text style={styles.time}>{homeTime}</Text>
          <Text style={styles.city}>{homeCity}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeBlock: {
    flex: 1,
  },
  leftBlock: {
    alignItems: 'flex-start',
  },
  rightBlock: {
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 13,
    color: '#8B95A1',
    marginBottom: 2,
    fontWeight: '500',
  },
  time: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222B3A',
  },
  city: {
    fontSize: 13,
    color: '#222B3A',
    fontWeight: '400',
  },
  divider: {
    width: 2,
    height: 60,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
    borderRadius: 1,
  },
});
