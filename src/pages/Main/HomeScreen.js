import React from 'react';
import { View, Text } from 'react-native';
import AlertCard from '../../components/AlertCard'
import SectionCard from '../../components/SectionCard'
import HealthMetricsCard from '../../components/HealthMetricsCard'
import InstitutionList from '../../components/InstitutionList';

const institutions = [
  { name: 'Newyork University Hospital', distance: '1.2km', type: 'hospital' },
  { name: '한국 대사관', distance: '2.5km', type: 'embassy' },
];

export default function HomeScreen() {
  return (
    <View>
      <Text>홈 UI 구현</Text>
      <AlertCard
        type="earthquake"
        magnitude={3.2}
        distance={50}
        timeAgo="2시간 전"
        showCloseButton={true}
        onClose={() => { /* 닫기 동작 */ }}
      />
      <AlertCard type="dehydration" />
      <AlertCard type="heatwave" />
      <AlertCard type="rainstorm" />
      <SectionCard title="하루 요약">
        <View>
          <AlertCard
            type="earthquake"
            magnitude={3.2}
            distance={50}
            timeAgo="2시간 전"
            showCloseButton={true}
            onClose={() => { /* 닫기 동작 */ }}
          />
        </View>
      </SectionCard>
      <SectionCard title="근처 응급 기관 정보">
        <InstitutionList institutions={institutions} />
      </SectionCard>
      <SectionCard title="건강 모니터링">
        <View>
          <HealthMetricsCard steps={12543} bpm={82} temperature={37.2} />
        </View>
      </SectionCard>

    </View>
  );
}
