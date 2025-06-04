import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { travelAPI } from '../apis/travelAPI';
import { GOOGLE_MAPS_API_KEY } from '../config/keys';
import { getLocationInfo } from './locationUtils';
import tzlookup from 'tz-lookup';

let locationTrackingInterval = null;
let isTrackingActive = false;

// Geolocation 설정 (iOS에서 권한 자동 요청 활성화)
if (Platform.OS === 'ios') {
  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'whenInUse',
  });
}

// 위치 권한 체크 (모던 API 사용)
const checkLocationPermission = async () => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      
      if (!granted) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '위치 권한 필요',
            message: '위치 추적을 위해 위치 권한이 필요합니다.',
            buttonNeutral: '나중에',
            buttonNegative: '취소',
            buttonPositive: '확인',
          }
        );
        return result === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } else {
      // iOS - 권한 자동 요청 설정으로 간단하게 처리
      return new Promise((resolve) => {
        Geolocation.getCurrentPosition(
          () => {
            console.log('✅ iOS 위치 권한 확인됨');
            resolve(true);
          },
          (error) => {
            console.log(`⚠️ iOS 위치 오류 (코드: ${error.code}): ${error.message}`);
            // PERMISSION_DENIED(1)만 권한 문제, 나머지는 다른 오류
            if (error.code === 1) {
              console.log('❌ 위치 권한이 거부됨');
              resolve(false);
            } else {
              console.log('ℹ️ 권한 외 오류 - 권한은 있는 것으로 간주');
              resolve(true);
            }
          },
          { 
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 300000,
          }
        );
      });
    }
  } catch (error) {
    console.error('위치 권한 체크 오류:', error);
    return false;
  }
};

// 구글 역지오코딩으로 주소 정보 가져오기
const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}&language=ko`
    );
    const data = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      const result = data.results[0];
      const addressComponents = result.address_components;
      
      // ScheduleInputModal과 동일한 방식으로 데이터 추출
      const spotName = addressComponents[0]?.long_name || '현재 위치';
      const spotDetail = result.formatted_address || '';
      const city = addressComponents.find(c => c.types.includes('administrative_area_level_1'))?.long_name || 'Not Found';
      const country = addressComponents.find(c => c.types.includes('country'))?.long_name || 'Not Found';
      
      return { spotName, spotDetail, city, country };
    } else {
      console.warn('주소 정보를 가져올 수 없습니다:', data.status);
      return {
        spotName: '알 수 없는 위치',
        spotDetail: '',
        city: 'Not Found',
        country: 'Not Found'
      };
    }
  } catch (error) {
    console.error('역지오코딩 오류:', error);
    return {
      spotName: '위치 오류',
      spotDetail: '',
      city: 'Not Found',
      country: 'Not Found'
    };
  }
};

// 정확한 현지 시간 포맷팅 함수 (tzlookup 사용)
const formatDateTimeForTimezone = (latitude, longitude) => {
  try {
    // tzlookup을 사용해서 정확한 timezone 가져오기
    const timezone = tzlookup(latitude, longitude);
    console.log(`🌍 위치 (${latitude}, ${longitude})의 timezone: ${timezone}`);
    
    // 현재 시간을 해당 timezone으로 변환
    const now = new Date();
    const localTime = now.toLocaleString('sv-SE', { 
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    console.log(`⏰ ${timezone} 현지 시간: ${localTime}`);
    
    // 'YYYY-MM-DD HH:MM:SS' 형식을 분리
    const [datePart, timePart] = localTime.split(' ');
    
    return { 
      spotDate: datePart,     // YYYY-MM-DD
      spotTime: timePart      // HH:MM:SS
    };
  } catch (error) {
    console.error('Timezone 처리 오류:', error);
    // 오류 시 UTC 시간 사용
    const now = new Date();
    const utcTime = now.toISOString();
    const spotDate = utcTime.split('T')[0];
    const spotTime = utcTime.split('T')[1].split('.')[0];
    
    console.log(`⚠️ Fallback UTC 시간 사용: ${spotDate} ${spotTime}`);
    return { spotDate, spotTime };
  }
};

// 현재 위치 가져오기 및 서버에 전송
const trackAndSendLocation = async () => {
  try {
    console.log('🔄 위치 추적 시작...');
    
    // 토큰 확인
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      console.log('❌ 토큰이 없어서 위치 추적을 건너뜁니다.');
      return;
    }

    // 위치 권한 확인
    const hasPermission = await checkLocationPermission();
    if (!hasPermission) {
      console.log('❌ 위치 권한이 없어서 위치 추적을 건너뜁니다.');
      return;
    }

    // 현재 위치 가져오기
    Geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          console.log(`📍 위치 획득: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);

          // 주소 정보 가져오기
          const { spotName, spotDetail, city, country } = await getAddressFromCoordinates(latitude, longitude);

          // 안전한 날짜/시간 포맷팅
          const { spotDate, spotTime } = formatDateTimeForTimezone(latitude, longitude);

          // ScheduleInputModal과 동일한 데이터 구조로 생성
          const locationData = {
            spotDate,
            spotTime,
            spotName,
            spotDetail,
            latitude,
            longitude,
            city,
            country,
            isPlan: false // 실제 위치 추적이므로 false
          };

          console.log('🚀 위치 데이터 전송:', spotName, `(${spotDate} ${spotTime})`);

          // API 호출
          await travelAPI.postTravelSpot(locationData);
          console.log('✅ 위치 전송 성공');

        } catch (apiError) {
          console.error('❌ API 전송 실패:', apiError);
        }
      },
      (error) => {
        console.error('❌ 위치 획득 실패:', error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 60000,
      }
    );
  } catch (error) {
    console.error('❌ 위치 추적 중 오류:', error);
  }
};

// 위치 추적 시작 (5분 간격)
export const startLocationTracking = async () => {
  if (isTrackingActive) {
    console.log('⚠️ 위치 추적이 이미 활성화되어 있습니다.');
    return;
  }

  console.log('🎯 위치 추적 시작 (5분 간격)');
  isTrackingActive = true;

  // 즉시 한 번 실행
  await trackAndSendLocation();

  // 5분(300,000ms) 간격으로 반복 실행
  locationTrackingInterval = setInterval(async () => {
    await trackAndSendLocation();
  }, 5 * 60 * 1000);
};

// 위치 추적 중지
export const stopLocationTracking = () => {
  if (locationTrackingInterval) {
    clearInterval(locationTrackingInterval);
    locationTrackingInterval = null;
    isTrackingActive = false;
    console.log('🛑 위치 추적 중지됨');
  }
};

// 현재 추적 상태 확인
export const isLocationTrackingActive = () => {
  return isTrackingActive;
};

// 수동으로 위치 전송 (테스트용)
export const sendLocationNow = async () => {
  console.log('🧪 수동 위치 전송 테스트');
  await trackAndSendLocation();
}; 