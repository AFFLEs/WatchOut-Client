import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function HealthMetricsCard({ steps, bpm, kcal }) {
  return (
    <View style={styles.container}>
      {/* 걸음 수 */}
      <View style={styles.metric}>
        <Image source={require('../assets/icons/steps.png')} style={styles.icon} resizeMode="contain" />
        <Text style={styles.value}>
        {steps != null && !isNaN(steps) ? Number(steps).toLocaleString() : '-'}
        </Text>

        <Text style={styles.label}>일일 걸음 수</Text>
      </View>
      {/* BPM */}
      <View style={styles.metric}>
        <Image source={require('../assets/icons/heart.png')} style={styles.icon} resizeMode="contain" />
        <Text style={styles.value}>
        {bpm != null && !isNaN(bpm) ? Number(bpm).toLocaleString() : '-'}
        </Text>
        <Text style={styles.label}>BPM</Text>
      </View>
      {/* 체온 */}
      <View style={styles.metric}>
        <Image source={require('../assets/icons/calIcon.png')} style={styles.icon} resizeMode="contain" />
        <Text style={styles.value}>
        {kcal != null && !isNaN(kcal) ? Number(kcal).toLocaleString() : '-'}
        </Text>
        <Text style={styles.label}>활동량</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 6,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    width: 15,
    height: 15,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    color: '#8B95A1',
  },
});
