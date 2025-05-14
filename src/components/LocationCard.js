import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function LocationCard({ city, country }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={require('../assets/icons/location.png')} style={styles.icon} />
        <View>
          <Text style={styles.location}>{city}, {country}</Text>
          <Text style={styles.subText}>현재 위치</Text>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 12,
    height: 16,
    marginRight: 10,
    tintColor: '#2563EB', // 필요시 색상
  },
  location: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#222B3A',
  },
  subText: {
    fontSize: 12,
    color: '#8B95A1',
    marginTop: 2,
  },
});
