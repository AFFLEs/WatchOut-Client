import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function SwitchRow({ label, value, onValueChange, isTop }) {
  return (
    <View style={[styles.row, { borderTopWidth: isTop ? 1 : 0 }]}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value} 
        onValueChange={onValueChange} 
        trackColor={{ false: '#ccc', true: '#2563EB' }}
        thumbColor={value ? '#fff' : '#fff'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopColor: '#E5E7EB',
    marginTop: 10,
  },
  label: {
    fontSize: 15,
    color: '#222B3A',
    fontWeight: '400',
  },
});