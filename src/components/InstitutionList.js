import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InstitutionCard from './InstitutionCard';

export default function InstitutionList({ institutions }) {
  if (!institutions || institutions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>주변에 응급 기관이 없습니다.</Text>
      </View>
    );
  }

  return (
    <View>
      {institutions.map((item, idx) => (
        <InstitutionCard
          key={item.name + idx}
          name={item.name}
          distance={item.distance}
          type={item.type}
          city={item.city}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 14,
  },
});