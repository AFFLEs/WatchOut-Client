import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function SwitchRow({ label, value, onValueChange }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 10,
  },
  label: {
    fontSize: 15,
    color: '#222B3A',
    fontWeight: '400',
  },
});