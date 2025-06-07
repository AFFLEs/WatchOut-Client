import { GOOGLE_MAPS_API_KEY } from '../config/keys';
import AsyncStorage from '@react-native-async-storage/async-storage';

const typeMapping = {
  hospital: 'hospital',
  police: 'police',
  fire_station: 'fire_station',
  embassy: 'embassy', 
};

const categories = [
  { type: 'hospital', keyword: '종합병원' },
  { type: 'police', keyword: '경찰서' },
  { type: 'fire_station', keyword: '소방서' },
  { type: 'embassy', keyword: '대한민국 대사관' }, 
];

const CACHE_PREFIX = '@nearby_institutions_';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24시간

const getCacheKey = (type, lat, lng) => {
  return `${CACHE_PREFIX}${type}_${lat.toFixed(4)}_${lng.toFixed(4)}`;
};

const saveToCache = async (type, lat, lng, data) => {
  const cacheKey = getCacheKey(type, lat, lng);
  const cacheData = {
    data,
    timestamp: Date.now(),
  };
  try {
    await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log('캐시 저장 완료:', cacheKey);
  } catch (error) {
    console.warn('캐시 저장 실패:', error);
  }
};

const getFromCache = async (type, lat, lng, allowExpired = false, ignoreExpiry = false) => {
  const cacheKey = getCacheKey(type, lat, lng);
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;

    // ignoreExpiry가 true면 만료 체크 완전히 무시
    if (ignoreExpiry) {
      return {
        data,
        timestamp,
        isCache: true,
        expired: age > CACHE_EXPIRY
      };
    }

    // 캐시가 만료되었으면 null 반환 (allowExpired가 false일 때만)
    if (age > CACHE_EXPIRY && !allowExpired) {
      AsyncStorage.removeItem(cacheKey);
      return null;
    }

    return {
      data,
      timestamp,
      isCache: true,
      expired: age > CACHE_EXPIRY
    };
  } catch (error) {
    console.warn('캐시 조회 실패:', error);
    return null;
  }
};

export async function fetchNearbyInstitutions(lat, lng, type, keyword = '') {
  if (!lat || !lng) {
    console.log('🚨 위치 정보가 없습니다.');
    return { data: [], isCache: false };
  }

  try {
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    const params = {
      location: `${lat},${lng}`,
      radius: 5000,
      type: typeMapping[type] || type,
      keyword,
      language: 'ko',
      key: GOOGLE_MAPS_API_KEY,
    };

    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');

    const response = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.timeout = 10000; // 10초 타임아웃 설정
      
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            console.log(`🌐 API 응답 (${type}):`, response.status);
            
            if (!response.results || response.status !== 'OK') {
              console.log(`⚠️ API 응답 없음 (${type})`);
              reject(new Error('API 응답 없음'));
              return;
            }

            const places = response.results.map(place => ({
              name: place.name,
              type,
              placeId: place.place_id,
              location: {
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng,
              },
              city: place.vicinity,
            }));

            console.log(`✅ 데이터 수신 성공 (${type}):`, places.length);
            // 성공적으로 데이터를 받아오면 캐시에 저장
            saveToCache(type, lat, lng, places);
            resolve({ data: places, isCache: false });
          } catch (error) {
            console.log(`🚨 응답 파싱 에러 (${type}):`, error);
            reject(error);
          }
        } else {
          console.log(`🚨 API 요청 실패 (${type}): ${xhr.status}`);
          reject(new Error(`HTTP Error: ${xhr.status}`));
        }
      };

      xhr.onerror = function () {
        console.log(`🚨 네트워크 에러 (${type})`);
        reject(new Error('Network Error'));
      };

      xhr.ontimeout = function () {
        console.log(`🚨 요청 시간 초과 (${type})`);
        reject(new Error('Timeout'));
      };

      console.log(`🔍 API 요청 시작 (${type}):`, url);
      xhr.open('GET', `${url}?${queryString}`, true);
      xhr.send();
    });

    return response;
  } catch (error) {
    console.log(`🚨 API 요청 실패, 캐시 확인 (${type}):`, error.message);
    // API 요청 실패 시에만 캐시 확인 (만료 여부 완전히 무시)
    const cachedAfterError = await getFromCache(type, lat, lng, false, true);
    if (cachedAfterError) {
      console.log(`📦 API 실패 후 캐시 사용 (${type})${cachedAfterError.expired ? ' (만료됨)' : ''}`);
      return { data: cachedAfterError.data, isCache: true, timestamp: cachedAfterError.timestamp };
    }
    console.log(`❌ 캐시도 없음 (${type})`);
    return { data: [], isCache: false };
  }
}

export const fetchAllNearbyInstitutions = async (lat, lng) => {
  if (!lat || !lng) {
    console.log('🚨 위치 정보가 없습니다.');
    return { data: [], isCache: false };
  }

  let allResults = [];
  const origin = { lat, lng };
  let hasNetworkError = false;
  let isCached = false;
  let latestTimestamp = null;

  for (const { type, keyword } of categories) {
    try {
      const result = await fetchNearbyInstitutions(lat, lng, type, keyword);
      
      if (result.data.length === 0 && !hasNetworkError) {
        hasNetworkError = true;
      }

      if (result.data.length > 0) {
        const resultsWithDistance = result.data.map((place) => ({
          ...place,
          distance: haversineDistance(origin, {
            lat: place.location.lat,
            lng: place.location.lng,
          }),
          isCache: result.isCache,
          timestamp: result.timestamp
        }));

        allResults = [...allResults, ...resultsWithDistance];
        
        // 캐시된 데이터가 하나라도 있으면 전체를 캐시된 것으로 표시
        if (result.isCache) {
          isCached = true;
          // 가장 최근 캐시 타임스탬프 저장
          if (!latestTimestamp || result.timestamp > latestTimestamp) {
            latestTimestamp = result.timestamp;
          }
        }
      }
    } catch (error) {
      hasNetworkError = true;
      continue;
    }
  }

  if (allResults.length === 0) {
    return { 
      data: [], 
      isCache: false 
    };
  }

  allResults.sort((a, b) => a.distance - b.distance);

  const seenTypes = new Set();
  const uniqueByType = [];

  for (const item of allResults) {
    if (!seenTypes.has(item.type)) {
      seenTypes.add(item.type);
      uniqueByType.push(item);
    }
  }

  return { 
    data: uniqueByType, 
    isCache: isCached,
    timestamp: latestTimestamp,
    lastUpdated: isCached ? new Date(latestTimestamp).toLocaleString() : '방금 전'
  };
};

function haversineDistance(coord1, coord2) {
  const toRad = (deg) => deg * Math.PI / 180;
  const R = 6371; // 지구 반지름 (km)

  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);

  const lat1 = toRad(coord1.lat);
  const lat2 = toRad(coord2.lat);

  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2)); // 거리 (km)
}
  