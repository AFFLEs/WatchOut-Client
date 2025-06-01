import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, Image, Modal, TextInput, Button } from 'react-native';
import ModalButton from './ModalButton';
import ModalCard from './ModalCard';
import SwitchRow from './SwitchRow';
import { userAPI } from '../apis/userAPI';
import { formatPhoneNumberForDisplay, formatPhoneNumberForAPI } from '../utils/userUtils';

export default function EmergencyAidCard({ 
  enableWatchEmergencySignal, 
  guardianPhone,
  onPhoneUpdate,
  onEmergencySignalToggle 
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputPhone, setInputPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isEnabled, setIsEnabled] = useState(enableWatchEmergencySignal);
  const [noticeModal, setNoticeModal] = useState({ visible: false, message: '' });

  // enableWatchEmergencySignal prop이 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    setIsEnabled(enableWatchEmergencySignal);
  }, [enableWatchEmergencySignal]);

  const toggleSwitch = async () => {
    const newValue = !isEnabled;
    
    // 즉각적인 UI 피드백을 위해 먼저 상태 업데이트
    setIsEnabled(newValue);
    setNoticeModal({
      visible: true,
      message: '설정 변경 중...'
    });

    try {
      if (onEmergencySignalToggle) {
        const success = await onEmergencySignalToggle(newValue);
        if (!success) {
          // API 호출 실패 시 상태 복구
          setIsEnabled(!newValue);
          setNoticeModal({
            visible: true,
            message: '설정 변경에 실패했습니다.'
          });
        } else {
          setNoticeModal({
            visible: true,
            message: `긴급 구조 요청이 ${newValue ? '활성화' : '비활성화'}되었습니다.`
          });
        }
      }
    } catch (error) {
      console.error('긴급 신호 설정 변경 실패:', error);
      // 에러 발생 시 상태 복구
      setIsEnabled(!newValue);
      setNoticeModal({
        visible: true,
        message: '설정 변경에 실패했습니다. 다시 시도해주세요.'
      });
    } finally {
      // 모든 처리가 끝난 후 일정 시간 후에 모달 닫기
      setTimeout(() => setNoticeModal({ visible: false, message: '' }), 1500);
    }
  };

  // 전화번호 유효성 검사
  const validatePhoneNumber = (phone) => {
    const cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.length === 0) {
      return '전화번호를 입력해주세요.';
    }
    if (cleaned.length !== 11) {
      return '전화번호는 11자리여야 합니다.';
    }
    return '';
  };

  // 전화번호 입력 처리
  const handlePhoneChange = (text) => {
    setInputPhone(text);
    setPhoneError(validatePhoneNumber(text));
  };

  // 보호자 전화번호 수정 모달 창 열기
  const handleEditPhone = () => {
    setInputPhone(guardianPhone);
    setPhoneError('');
    setModalVisible(true);
  };

  const handlePhoneSubmit = async () => {
    const error = validatePhoneNumber(inputPhone);
    if (error) {
      setPhoneError(error);
      return;
    }

    try {
      const formattedPhone = formatPhoneNumberForAPI(inputPhone);
      await userAPI.updateGuardianPhone(formattedPhone);
      setModalVisible(false);
      onPhoneUpdate(formattedPhone);
      setNoticeModal({
        visible: true,
        message: '전화번호가 성공적으로 수정되었습니다.'
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || '전화번호 수정에 실패했습니다. 다시 시도해주세요.';
      setNoticeModal({
        visible: true,
        message: errorMessage
      });
    } finally {
      setTimeout(() => setNoticeModal({ visible: false, message: '' }), 1500);
    }
  };

  return (
    <View style={styles.card}>
      <SwitchRow
        label="스마트 워치 긴급 구조 요청 전송 켜기"
        value={isEnabled}
        onValueChange={toggleSwitch}
        isTop={false}
      />
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
        <Text style={styles.phoneNumber}>{formatPhoneNumberForDisplay(guardianPhone)}</Text>
        <TouchableOpacity onPress={handleEditPhone} style={styles.editBtnRow}>
          <Image source={require('../assets/icons/edit.png')} style={styles.editIcon} />
          <Text style={styles.editBtn}>수정하기</Text>
        </TouchableOpacity>
      </View>

      {/* 보호자 전화번호 수정 모달 */}
      <ModalCard
        visible={modalVisible}
        title="보호자 전화번호 수정하기"
        onRequestClose={() => {
          setModalVisible(false);
          setPhoneError('');
        }}
        buttons={[
          <ModalButton 
            title="취소" 
            onPress={() => {
              setModalVisible(false);
              setPhoneError('');
            }} 
          />,
          <ModalButton 
            title="완료" 
            onPress={handlePhoneSubmit}
            disabled={!!phoneError} 
          />,
        ]}
      >
        <View>
          <TextInput
            value={inputPhone}
            onChangeText={handlePhoneChange}
            style={[
              styles.input,
              phoneError ? styles.inputError : null,
              phoneError ? { marginBottom: 4 } : { marginBottom: 16 }
            ]}
            keyboardType="phone-pad"
            placeholder="전화번호 입력 (예: 01012345678)"
            maxLength={11}
          />
          {phoneError ? (
            <Text style={styles.errorText}>{phoneError}</Text>
          ) : null}
        </View>
      </ModalCard>

      {/* 긴급 구조 요청 안내 모달 */}
      <ModalCard
        visible={noticeModal.visible}
        onRequestClose={() => setNoticeModal({ visible: false, message: '' })}
        width={280}
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
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginBottom: 12,
  },
});
