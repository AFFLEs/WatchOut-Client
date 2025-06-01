
import React, { useState, useCallback, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, Button, Alert, TouchableOpacity } from 'react-native';
import SectionCard from '../../components/SectionCard';
import HealthMetricsCard from '../../components/HealthMetricsCard';
import AlertCard from '../../components/AlertCard';
import SwitchRow from '../../components/SwitchRow';
import ModalCard from '../../components/ModalCard';
import InstitutionList from '../../components/InstitutionList';
import { fetchAllNearbyInstitutions } from '../../utils/mapUtils';
import { useLocation } from '../../contexts/LocationContext';
import { userAPI } from '../../apis/userAPI';
// 워치 연동 관련 라이브러리
import { sendMessage, getReachability } from 'react-native-watch-connectivity';

export default function MonitoringScreen() {
  const [vibrationAlert, setVibrationAlert] = useState(true);
  const [institutions, setInstitutions] = useState([]);
  const [institutionsCache, setInstitutionsCache] = useState({
    isCache: false,
    lastUpdated: null
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { locationInfo } = useLocation();

  // Data
  const health = { steps: 12543, bpm: 82, temperature: 37.2 };

  // 초기 설정 가져오기
  const fetchUserSettings = async () => {
    try {
      const userInfo = await userAPI.getUserInfo();
      setVibrationAlert(userInfo.data.enableVibrationAlert ?? true);
    } catch (error) {
      console.error('사용자 설정 가져오기 실패:', error);
      setVibrationAlert(true); 
    }
  };

  useEffect(() => {
    fetchUserSettings();
  }, []);

  // 기관 정보 새로고침 함수
  const refreshInstitutions = useCallback(async () => {
    if (!locationInfo?.latitude || !locationInfo?.longitude) return;
    
    setIsRefreshing(true);
    try {
      const { data, isCache, lastUpdated } = await fetchAllNearbyInstitutions(
        locationInfo.latitude,
        locationInfo.longitude
      );
      setInstitutions(data);
      setInstitutionsCache({ isCache, lastUpdated });
    } catch (error) {
      console.error('기관 정보 새로고침 실패:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [locationInfo]);

  // 위치 정보가 변경될 때마다 기관 정보 가져오기
  useEffect(() => {
    refreshInstitutions();
  }, [locationInfo?.latitude, locationInfo?.longitude]);

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
          disabled={true}
          isTop={true}
        />
      </SectionCard>

      {/* 지역별 안전 경보 */}
      <SectionCard 
        title="지역 별 안전 경보"
      >
        <AlertCard
          type="earthquake" 
          timeAgo="2시간 전" 
        />
        <AlertCard
          type="rainstorm" 
          timeAgo="2시간 전" 
        />
        <View style={styles.institutionContainer}>
          <Text style={styles.institutionTitle}>근처 응급 기관 정보</Text>
          <Text style={styles.institutionSubtitle}>{institutionsCache.isCache ? `마지막 업데이트: ${institutionsCache.lastUpdated}` : '방금 전'}</Text>
          <InstitutionList 
            institutions={institutions} 
            isRefreshing={isRefreshing}
          />
        </View>
      </SectionCard>
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

  institutionContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginTop: 5
  },
  institutionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222B3A',
    marginBottom: 5
  },
  institutionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 5
  }
});
