import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function HealthMetricsCard({ steps, bpm, temperature }) {
  return (
    <View style={styles.container}>
      {/* 걸음 수 */}
      <View style={styles.metric}>
        <Image source={require('../assets/icons/steps.png')} style={styles.icon} resizeMode="contain" />
        <Text style={styles.value}>{steps.toLocaleString()}</Text>
        <Text style={styles.label}>일일 걸음 수</Text>
      </View>
      {/* BPM */}
      <View style={styles.metric}>
        <Image source={require('../assets/icons/heart.png')} style={styles.icon} resizeMode="contain" />
        <Text style={styles.value}>{bpm}</Text>
        <Text style={styles.label}>BPM</Text>
      </View>
      {/* 체온 */}
      <View style={styles.metric}>
        <Image source={require('../assets/icons/temperature.png')} style={styles.icon} resizeMode="contain" />
        <Text style={styles.value}>{temperature}°C</Text>
        <Text style={styles.label}>체온</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 8,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginBottom: 2,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    color: '#8B95A1',
  },
});
