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
import { getLocationTimes } from '../../utils/timeUtils';
import { fetchAllNearbyInstitutions } from '../../utils/mapUtils';
import { userAPI } from '../../apis/userAPI';
import { useLocation } from '../../contexts/LocationContext';


export default function HomeScreen() {
  const [localTime, setLocalTime] = useState('--:--');
  const [homeTime, setHomeTime] = useState('--:--');
  const [timezone, setTimezone] = useState(null);
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [enableWatchEmergencySignal, setEnableWatchEmergencySignal] = useState(false);
  const [guardianPhone, setGuardianPhone] = useState('보호자 전화번호를 설정해주세요.');
  const [name, setName] = useState('알수없음');
  const [birth, setBirth] = useState('알수없음');
  const { locationInfo, setLocationInfo } = useLocation();
  

  const updateTimes = () => {
    const times = getLocationTimes(timezone);
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
      const locationInfo = await getLocationInfo(latitude, longitude);
      
      if (locationInfo) {
        const { timezone: newTimezone, city: newCity, country: newCountry } = locationInfo;
        setLocationInfo({ city: newCity, country: newCountry, latitude, longitude }); 
        setTimezone(newTimezone);
        setCity(newCity);
        setCountry(newCountry);
      }
    } catch (error) {
      console.error('위치 정보 초기화 오류:', error);
    }
  };

  const updateGuardianPhone = (newPhone) => {
    setGuardianPhone(newPhone);
  };

  // 위치 정보 및 시간 초기화
  useEffect(() => {
    const setup = async () => {
      try {
        await initializeLocation();
      } catch (error) {
        console.error('위치 정보 초기화 오류:', error);
      }
    };
    
    setup();
  }, []);

  // 주변 기관 정보 가져오기
  useEffect(() => {
    const fetchInstitutions = async () => {
      if (locationInfo?.latitude && locationInfo?.longitude) {
        try {
          const nearbyInstitutions = await fetchAllNearbyInstitutions(
            locationInfo.latitude,
            locationInfo.longitude
          );
          setInstitutions(nearbyInstitutions);
        } catch (error) {
          console.error('주변 기관 정보 가져오기 오류:', error);
        }
      }
    };

    fetchInstitutions();
  }, [locationInfo?.latitude, locationInfo?.longitude]);

  // 시간 업데이트
  useEffect(() => {
    if (!timezone) return;

    const timeInterval = setInterval(updateTimes, 1000);
    return () => clearInterval(timeInterval);
  }, [timezone]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await userAPI.getUserInfo();
      console.log(userInfo.data);
      setGuardianPhone(userInfo.data.guardianPhone || '010-0000-0000');
      setName(userInfo.data.name || '한예원');
      setBirth(userInfo.data.birthdate || '1990-01-01');
    };
    fetchUserInfo();
  }, []);

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
        <InstitutionList institutions={institutions}/>
      </SectionCard>

      <SectionCard title="긴급 구조 설정">
        <View>
          <EmergencyAidCard 
            enableWatchEmergencySignal={true} 
            guardianPhone={guardianPhone} 
            onPhoneUpdate={updateGuardianPhone}
          />
          <PersonalInfoCard name={name} nationality="대한민국" birth={birth} />
        </View>
      </SectionCard>  
    </ScrollView>
  );
}
