import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

export default function AddTravelButton({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.button}
    >
      <Image
        source={require('../assets/icons/edit.png')}
        style={styles.icon}
      />
      <Text style={styles.text}>일정 등록하기</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  icon: {
    width: 12,
    height: 12,
    marginRight: 4,
    tintColor: '#2563EB',
  },
  text: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'right',
  },
}); 