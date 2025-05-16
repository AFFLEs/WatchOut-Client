import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TravelScheduleCard({ departureDate, returnDate }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>출국일</Text>
          <Text style={styles.date}>{departureDate}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.col}>
          <Text style={styles.label}>귀국일</Text>
          <Text style={styles.date}>{returnDate}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginVertical: 6,
    marginHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  col: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#8B95A1',
    marginBottom: 4,
  },
  date: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222B3A',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
});
