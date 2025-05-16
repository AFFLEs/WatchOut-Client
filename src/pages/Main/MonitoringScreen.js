import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import SectionCard from '../../components/SectionCard';
import HealthMetricsCard from '../../components/HealthMetricsCard';
import AlertCard from '../../components/AlertCard';
import SwitchRow from '../../components/SwitchRow';
import  InstitutionList from '../../components/InstitutionList';

export default function MonitoringScreen() {
  const [vibrationAlert, setVibrationAlert] = useState(true);

  // Data
  const health = { steps: 12543, bpm: 82, temperature: 37.2 };
  const institutions = [
    { name: 'Newyork University Hospital', distance: '1.2km', type: 'hospital' },
    { name: '한국 대사관', distance: '2.5km', type: 'embassy' },
  ];

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
          onValueChange={setVibrationAlert}
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

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // 필요시 스타일 추가
});
