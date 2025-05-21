import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Button, Alert, TouchableOpacity } from 'react-native';
import SectionCard from '../../components/SectionCard';
import HealthMetricsCard from '../../components/HealthMetricsCard';
import AlertCard from '../../components/AlertCard';
import SwitchRow from '../../components/SwitchRow';
import  InstitutionList from '../../components/InstitutionList';
import ModalCard from '../../components/ModalCard';
// 워치 연동 관련 라이브러리
import { sendMessage, getReachability } from 'react-native-watch-connectivity';

export default function MonitoringScreen() {
  const [vibrationAlert, setVibrationAlert] = useState(true);
  const [noticeModal, setNoticeModal] = useState({ visible: false, message: '' });

  // Data
  const health = { steps: 12543, bpm: 82, temperature: 37.2 };
  const institutions = [
    { name: 'Newyork University Hospital', distance: '1.2km', type: 'hospital' },
    { name: '한국 대사관', distance: '2.5km', type: 'embassy' },
  ];

  // 토글 수정 후 안내 메시지 출력 + 더미 API 호출
  const handleToggle = async () => {
    const newVibrationAlert = !vibrationAlert;
    setVibrationAlert(newVibrationAlert);

    const message = newVibrationAlert
      ? '진동 경고 알림이 설정되었습니다.'
      : '진동 경고 알림이 해제되었습니다.';

    setNoticeModal({ visible: true, message });

    await updateVibrationAlertSettingAPI(newVibrationAlert);
    setTimeout(() => setNoticeModal({ visible: false, message: '' }), 1500);
  };

  // 진동 경고 설정용 더미 API 함수 (API 파일로 따로 분리 예정)
  const updateVibrationAlertSettingAPI = async (newVibrationAlert) => {
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500));
  };

  // 워치로 데모 알림 보내기
  const sendDemoMessageToWatch = async () => {
    try {
      const isReachable = await getReachability();
      if (isReachable) {
        sendMessage(
          { message: '테스트로 메시지를 보냈어요! 5월 21일' },
          (replyObj) => {
            Alert.alert('성공', '워치로 메시지 전송 성공!');
            console.log('워치 응답:', replyObj);
          },
          (error) => {
            Alert.alert('실패', '워치로 메시지 전송 실패');
            console.log('워치 전송 오류:', error);
          }
        );
      } else {
        Alert.alert('연결 안 됨', '워치가 연결되어 있지 않습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '메시지 전송 중 오류 발생');
      console.error('워치 메시지 전송 오류:', error);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      {/* 워치 연결 데모용 버튼 */}
      <SectionCard title="워치 연결 테스트">
        <TouchableOpacity 
          style={styles.watchButton}
          onPress={sendDemoMessageToWatch}
        >
          <Text style={styles.watchButtonText}>워치로 알림보내기!</Text>
        </TouchableOpacity>
      </SectionCard>

      {/* 건강 모니터링 */}
      <SectionCard title="건강 모니터링">
        <HealthMetricsCard {...health} />
        <AlertCard
          type="dehydration" 
          timeAgo="2시간 전" 
        />
        <SwitchRow
          label="진동 경고 알림"
          value={vibrationAlert}
          onValueChange={handleToggle}
        />
      </SectionCard>

      {/* 지역별 안전 경보 */}
      <SectionCard title="지역 별 안전 경보">
        <AlertCard
          type="earthquake" 
          timeAgo="2시간 전" 
        />
        <AlertCard
          type="rainstorm" 
          timeAgo="2시간 전" 
        />
        <View style={{ backgroundColor: '#F1F2F4',  borderRadius: 10, padding: 10, marginTop: 5 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#222B3A'}}>근처 응급 기관 정보</Text>
          <InstitutionList institutions={institutions} />
        </View>
      </SectionCard>

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

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  watchButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  watchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
