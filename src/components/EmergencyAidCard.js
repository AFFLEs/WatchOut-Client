import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, Image, Modal, TextInput, Button } from 'react-native';
import ModalButton from './ModalButton';
import ModalCard from './ModalCard';

export default function EmergencyAidCard() {
  const [enabled, setEnabled] = useState(false);
  const [guardianPhone, setGuardianPhone] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [inputPhone, setInputPhone] = useState('');
  const [noticeModal, setNoticeModal] = useState({ visible: false, message: '' });

  const fetchInitialSettings = async () => {
    // 초기 설정용 API 호출
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

  // 토글 수정 후 안내 메시지 출력 + 더미 API 호출
  const handleToggle = async () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);

    const message = newEnabled
      ? '긴급 구조 요청이 설정되었습니다.'
      : '긴급 구조 요청이 해제되었습니다.';

    setNoticeModal({ visible: true, message });

    await updateEmergencySettingAPI(newEnabled);
    setTimeout(() => setNoticeModal({ visible: false, message: '' }), 1500);
  };

  // 긴급 구조 설정용 더미 API 함수 (API 파일로 따로 분리 예정)
  const updateEmergencySettingAPI = async (newEnabled) => {
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500));
  };

  // 보호자 전화번호 수정 모달 창 열기
  const handleEditPhone = () => {
    setInputPhone(guardianPhone); 
    setModalVisible(true);
  };

  // 보호자 전화번호 수정용 더미 API 함수 (API 파일로 따로 분리 예정)
  const updatePhoneAPI = async (newPhone) => {
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500));
  };

  // 보호자 전화번호 수정 모달 창 닫기
  const handlePhoneSubmit = async () => {
    const res = await updatePhoneAPI(inputPhone);
    if (res.success) {
      setGuardianPhone(inputPhone);
      setModalVisible(false);
      setNoticeModal({ visible: true, message: '전화번호가 수정되었습니다.' });
      setTimeout(() => setNoticeModal({ visible: false, message: '' }), 1500);
    } else {
      setNoticeModal({ visible: true, message: '전화번호 수정에 실패했습니다.' });
      setTimeout(() => setNoticeModal({ visible: false, message: '' }), 1500);
    }
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

      {/* 보호자 전화번호 수정 모달 */}
      <ModalCard
        visible={modalVisible}
        title="보호자 전화번호 수정하기"
        onRequestClose={() => setModalVisible(false)}
        buttons={[
          <ModalButton title="취소" onPress={() => setModalVisible(false)} />,
          <ModalButton title="완료" onPress={handlePhoneSubmit} />,
        ]}
      >
        <TextInput
          value={inputPhone}
          onChangeText={setInputPhone}
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="전화번호 입력"
        />
      </ModalCard>

      {/* 긴급 구조 요청 안내 모달 */}
      <ModalCard
        visible={noticeModal.visible}
        onRequestClose={() => setNoticeModal({ visible: false, message: '' })}
        width={240}
        buttons={[]} 
      >
        <Text style={{ color: '#222B3A', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }}>
          {noticeModal.message}
        </Text>
      </ModalCard>
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
    tintColor: '#2563EB', 
  },
  editBtn: {
    color: '#2563EB',
    fontWeight: 'bold',
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 8,
    width: '100%',
    fontSize: 15,
    marginBottom: 16,
  },
});
