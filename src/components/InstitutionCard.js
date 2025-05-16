import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const typeIcons = {
  hospital: require('../assets/icons/hospital.png'),
  embassy: require('../assets/icons/embassy.png'),
  // 필요시 추가
};

export default function InstitutionCard({ name, distance, type }) {
  return (
    <View style={styles.row}>
      <Image source={typeIcons[type]} style={styles.icon} resizeMode="contain" />
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.distance}>{distance} 거리</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    padding:5
  },
  icon: {
    width: 22,
    height: 20,
    marginRight: 15,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#1F2937',
  },
  distance: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 1,
  },
});