import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SectionCard from '../../components/SectionCard';
import HealthMetricsCard from '../../components/HealthMetricsCard';
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

const USER_INFO_KEY = 'USER_INFO_CACHE';

export default function HomeScreen() {
  const [localTime, setLocalTime] = useState('--:--');
  const [homeTime, setHomeTime] = useState('--:--');
  const [timezone, setTimezone] = useState(null);
  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [institutionsCache, setInstitutionsCache] = useState({ isCache: false, lastUpdated: null });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [enableWatchEmergencySignal, setEnableWatchEmergencySignal] = useState(true);
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
      console.log('위치 정보 초기화 오류:', error);
    }
  };

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
      console.log('기관 정보 새로고침 실패:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [locationInfo]);

  useEffect(() => {
    refreshInstitutions();
  }, [locationInfo?.latitude, locationInfo?.longitude]);

  const updateGuardianPhone = async (newPhone) => {
    try {
      const userInfo = await userAPI.getUserInfo();
      if (userInfo.data.guardianPhone === newPhone) {
        setGuardianPhone(newPhone);
      } else {
        setGuardianPhone(userInfo.data.guardianPhone || '보호자 전화번호를 설정해주세요.');
      }
    } catch (error) {
      console.log('전화번호 업데이트 실패:', error);
      await fetchUserInfo();
    }
  };

  const handleEmergencySignalToggle = async (newValue) => {
    try {
      const response = await userAPI.updateEmergencySetting(newValue);
      if (response.data?.enableWatchEmergencySignal !== undefined) {
        setEnableWatchEmergencySignal(response.data.enableWatchEmergencySignal);
        return response.data.enableWatchEmergencySignal === newValue;
      }
      return false;
    } catch (error) {
      console.log('긴급 신호 설정 변경 실패:', error);
      return false;
    }
  };

  const fetchUserInfo = async () => {
    try {
      const userInfo = await userAPI.getUserInfo();

      const parsedUserInfo = {
        guardianPhone: userInfo.data.guardianPhone || '보호자 전화번호를 설정해주세요.',
        name: userInfo.data.name || '알수없음',
        birth: userInfo.data.birthdate || '알수없음',
        enableWatchEmergencySignal: userInfo.data.enableWatchEmergencySignal ?? true,
      };

      setGuardianPhone(parsedUserInfo.guardianPhone);
      setName(parsedUserInfo.name);
      setBirth(parsedUserInfo.birth);
      setEnableWatchEmergencySignal(parsedUserInfo.enableWatchEmergencySignal);

      // AsyncStorage에 저장
      await AsyncStorage.setItem(USER_INFO_KEY, JSON.stringify(parsedUserInfo));
    } catch (error) {
      console.log('사용자 정보 가져오기 실패:', error);

      // AsyncStorage에서 fallback
      const cached = await AsyncStorage.getItem(USER_INFO_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        console.log('📦 캐시된 사용자 정보 로드');
        setGuardianPhone(parsed.guardianPhone);
        setName(parsed.name);
        setBirth(parsed.birth);
        setEnableWatchEmergencySignal(parsed.enableWatchEmergencySignal);
      } else {
        setGuardianPhone('보호자 전화번호를 설정해주세요.');
        setName('알수없음');
        setBirth('알수없음');
        setEnableWatchEmergencySignal(true);
      }
    }
  };

  useEffect(() => {
    const setup = async () => {
      try {
        await initializeLocation();
      } catch (error) {
          console.log('위치 정보 초기화 오류:', error);
      }
    };
    setup();
  }, []);

  useEffect(() => {
    if (!timezone) return;
    const timeInterval = setInterval(updateTimes, 1000);
    return () => clearInterval(timeInterval);
  }, [timezone]);

  useEffect(() => {
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

      <SectionCard
        title="근처 응급 기관 정보"
        subtitle={
          isRefreshing
            ? '새로고침 중...'
            : institutionsCache.isCache
            ? `마지막 업데이트: ${institutionsCache.lastUpdated}`
            : '방금 전'
        }
      >
        <InstitutionList institutions={institutions || []} isRefreshing={isRefreshing} />
      </SectionCard>

      <SectionCard title="긴급 구조 설정">
        <View>
          <EmergencyAidCard
            enableWatchEmergencySignal={enableWatchEmergencySignal}
            guardianPhone={guardianPhone}
            onPhoneUpdate={updateGuardianPhone}
            onEmergencySignalToggle={handleEmergencySignalToggle}
          />
          <PersonalInfoCard name={name} nationality="대한민국" birth={birth} />
        </View>
      </SectionCard>
    </ScrollView>
  );
}
