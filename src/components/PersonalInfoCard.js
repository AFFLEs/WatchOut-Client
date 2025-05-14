import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PersonalInfoCard({ name, nationality, age }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>개인 정보</Text>
      <View style={styles.infoRow}>
        <Text style={styles.label}>이름:</Text>
        <Text style={styles.value}>{name}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>국적:</Text>
        <Text style={styles.value}>{nationality}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>나이:</Text>
        <Text style={styles.value}>{age}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F7F9FA',
    borderRadius: 8,
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#222B3A',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: '#222B3A',
  },
  value: {
    fontSize: 14,
    color: '#222B3A',
    fontWeight: '500',
  },
});
