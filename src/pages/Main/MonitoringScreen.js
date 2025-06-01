import React, { useState, useCallback, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import SectionCard from '../../components/SectionCard';
import HealthMetricsCard from '../../components/HealthMetricsCard';
import AlertCard from '../../components/AlertCard';
import SwitchRow from '../../components/SwitchRow';
import InstitutionList from '../../components/InstitutionList';
import { fetchAllNearbyInstitutions } from '../../utils/mapUtils';
import { useLocation } from '../../contexts/LocationContext';
import { userAPI } from '../../apis/userAPI';

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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
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
