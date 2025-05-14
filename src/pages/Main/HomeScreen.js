import React from 'react';
import { View } from 'react-native';
import SectionCard from '../../components/SectionCard'
import HealthMetricsCard from '../../components/HealthMetricsCard'
import InstitutionList from '../../components/InstitutionList';
import LocationCard from '../../components/LocationCard';
import TimeCard from '../../components/TimeCard';
import EmergencyAidCard from '../../components/EmergencyAidCard';
import PersonalInfoCard from '../../components/PersonalInfoCard';

const institutions = [
  { name: 'Newyork University Hospital', distance: '1.2km', type: 'hospital' },
  { name: '한국 대사관', distance: '2.5km', type: 'embassy' },
];

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5', padding: 2 }}>
      <SectionCard>
        <LocationCard city="뉴욕" country="미국" />
      </SectionCard>

      <SectionCard>
        <TimeCard
          localTime="14:30"
          localCity="New York"
          homeTime="00:30"
          homeCity="Seoul"
        />
      </SectionCard>

      <SectionCard title="건강 모니터링">
        <View>
          <HealthMetricsCard steps={12543} bpm={82} temperature={37.2} />
        </View>
      </SectionCard>

      <SectionCard title="근처 응급 기관 정보">
        <InstitutionList institutions={institutions} />
      </SectionCard>

      <SectionCard title="긴급 구조 설정">
        <View>
          <EmergencyAidCard />
          <PersonalInfoCard name="김영원" nationality="대한민국" age={32} />
        </View>
      </SectionCard>  
    </View>
  );
}
