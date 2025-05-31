import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import SectionCard from '../../components/SectionCard'
import HealthMetricsCard from '../../components/HealthMetricsCard'
import InstitutionList from '../../components/InstitutionList';
import LocationCard from '../../components/LocationCard';
import TimeCard from '../../components/TimeCard';
import EmergencyAidCard from '../../components/EmergencyAidCard';
import PersonalInfoCard from '../../components/PersonalInfoCard';
import { requestLocationPermission, getCurrentLocation, getLocationInfo } from '../../utils/locationUtils';
import { getFormattedTimes } from '../../utils/timeUtils';

const institutions = [
  { name: 'Newyork University Hospital', distance: '1.2km', type: 'hospital' },
  { name: 'New York City Police Department (NYPD)', distance: '2.5km', type: 'embassy' },
];

export default function HomeScreen() {
  const [localTime, setLocalTime] = useState('--:--');
  const [homeTime, setHomeTime] = useState('--:--');
  const [timezone, setTimezone] = useState(null);
  const [city, setCity] = useState(null);
  const [country, setCountry] = useState(null);

  const updateTimes = () => {
    const times = getFormattedTimes(timezone);
    setLocalTime(times.localTime);
    setHomeTime(times.homeTime);
  };

  const initializeLocation = async () => {
    const granted = await requestLocationPermission();
    if (!granted) {
      console.log('위치 권한을 허용해주세요.');
      return;
    }

    try {
      const { latitude, longitude } = await getCurrentLocation();
      const locationInfo = getLocationInfo(latitude, longitude);
      
      if (locationInfo) {
        const { timezone: newTimezone, city: newCity, country: newCountry } = locationInfo;
        setTimezone(newTimezone);
        setCity(newCity);
        setCountry(newCountry);
      }
    } catch (error) {
      console.error('위치 정보 초기화 오류:', error);
    }
  };

  useEffect(() => {
    initializeLocation();

    const timeInterval = setInterval(updateTimes, 1000);
    return () => clearInterval(timeInterval);
  }, [timezone]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F5', padding: 2 }}>
      <SectionCard>
        <LocationCard city={city} country={country} />
      </SectionCard>

      <SectionCard>
        <TimeCard
          localTime={localTime}
          localCity={city}
          homeTime={homeTime}
          homeCity="Seoul"
        />
      </SectionCard>

      <SectionCard title="건강 모니터링">
        <View>
          <HealthMetricsCard steps={12543} bpm={82} temperature={37.2} />
        </View>
      </SectionCard>

      <SectionCard title="근처 응급 기관 정보">
        <InstitutionList institutions={institutions} city={city}/>
      </SectionCard>

      <SectionCard title="긴급 구조 설정">
        <View>
          <EmergencyAidCard />
          <PersonalInfoCard name="김영원" nationality="대한민국" age={32} />
        </View>
      </SectionCard>  
    </ScrollView>
  );
}
