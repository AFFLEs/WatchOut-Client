import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, Image } from 'react-native';

export default function EmergencyAidCard() {
  const [enabled, setEnabled] = useState(false);
  const [guardianPhone, setGuardianPhone] = useState('');

  const fetchInitialSettings = async () => {
    // API 호출
    return {
      enabled: true,
      guardianPhone: '010-9225-0234',
    };
  };

  useEffect(() => {
    fetchInitialSettings().then(data => {
      setEnabled(data.enabled);
      setGuardianPhone(data.guardianPhone);
    });
  }, []);

  const handleToggle = () => setEnabled(prev => !prev);

  const handleEditPhone = () => {
    Alert.alert('전화번호 수정', '전화번호 수정 후 API 호출 예정.');
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>스마트 워치 긴급 구조 요청 전송 켜기</Text>
        <Switch
          value={enabled}
          onValueChange={handleToggle}
          trackColor={{ false: '#ccc', true: '#2563EB' }}
          thumbColor={enabled ? '#fff' : '#fff'}
        />
      </View>
      <Text style={styles.desc}>
        스마트 워치의 화면을 5초 이상 누를 경우, 현지 경찰서와 설정한 보호자에게 현재 상황 전달 및 긴급 구조 요청이 전송됩니다.
      </Text>
      <View style={styles.phoneRow}>
        <Text style={styles.phoneLabel}>
          <Text>보호자 전화번호</Text>
          <Text style={styles.phoneDesc}> (설정된 전화번호로 구조 요청이 전송됩니다.)</Text>
        </Text>
      </View>
      <View style={styles.phoneEditRow}>
        <Text style={styles.phoneNumber}>{guardianPhone}</Text>
        <TouchableOpacity onPress={handleEditPhone} style={styles.editBtnRow}>
          <Image source={require('../assets/icons/edit.png')} style={styles.editIcon} />
          <Text style={styles.editBtn}>수정하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    color: '#222B3A',
  },
  desc: {
    fontSize: 12,
    color: '#8B95A1',
    marginTop: 6,
    marginBottom: 5,
    lineHeight: 18,
  },
  phoneRow: {
    marginTop: 5,
    marginBottom: 2,
  },
  phoneLabel: {
    fontSize: 14,
    color: '#222B3A',
  },
  phoneDesc: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#8B95A1',
  },
  phoneEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
    marginBottom: 10,
  },
  phoneNumber: {
    fontSize: 15,
    color: '#222B3A',
    fontWeight: '500',
  },
  editBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editIcon: {
    width: 12,
    height: 12,
    marginRight: 3,
    tintColor: '#2563EB', // 필요시 색상
  },
  editBtn: {
    color: '#2563EB',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
