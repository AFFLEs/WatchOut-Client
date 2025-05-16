import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function TravelRecordNotice() {
  return (
    <View style={styles.noticeBox}>
      <Image source={require('../assets/icons/time-notification.png')} style={{ marginRight: 4 }} />
      <Text style={styles.noticeText}>여행 기록은 사용자의 여행이 종료 후 3일 뒤 삭제됩니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FA',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    margin: 12,
  },
  noticeText: {
    color: '#8B95A1',
    fontSize: 12,
  },
}); 