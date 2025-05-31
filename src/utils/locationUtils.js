import { Platform } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import tzlookup from 'tz-lookup';


export const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    console.log('위치 권한 요청 결과:', result);
    return result === RESULTS.GRANTED;
  }
  return false;
};

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        console.error('위치 에러:', error);
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  });
};

export const getLocationInfo = (latitude, longitude) => {
  try {
    const timezone = tzlookup(latitude, longitude);
    const city = timezone.split('/')[1].replace('_', ' ');
    const country = timezone.split('/')[0];
    
    return {
      timezone,
      city,
      country
    };
  } catch (e) {
    console.error('시간대 추출 오류:', e);
    return null;
  }
}; 