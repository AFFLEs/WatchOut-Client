import { GOOGLE_MAPS_API_KEY } from '../config/keys';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

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

export async function fetchNearbyInstitutions(lat, lng, type, keyword = '') {
  if (!lat || !lng) {
    console.error('🚨 위도/경도가 제공되지 않았습니다:', { lat, lng });
    return [];
  }

  const radius = 5000; // 5km 반경 내의 기관 검색

  try {
    console.log('📍 Places 검색 시작:', {
      location: `${lat},${lng}`,
      type,
      keyword,
    });

    // Google Places API 요청 URL 구성
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    const params = {
      location: `${lat},${lng}`,
      radius,
      type: typeMapping[type] || type,
      keyword,
      language: 'ko',
      key: GOOGLE_MAPS_API_KEY,
    };

    // URL에 파라미터 추가
    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');

    // XMLHttpRequest 사용
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;

        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (!response.results) {
              console.error('🚨 응답 데이터가 올바르지 않습니다:', response);
              resolve([]);
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
            resolve(places);
          } catch (error) {
            console.error('🚨 응답 파싱 에러:', error);
            resolve([]);
          }
        } else {
          console.error('🚨 API 요청 실패:', xhr.status, xhr.statusText);
          resolve([]);
        }
      };

      xhr.onerror = function () {
        console.error('🚨 네트워크 에러');
        resolve([]);
      };

      xhr.open('GET', `${url}?${queryString}`, true);
      xhr.send();
    });
  } catch (error) {
    console.error('🚨 Places API 요청 에러:', error);
    return [];
  }
}

export const fetchAllNearbyInstitutions = async (lat, lng) => {
  if (!lat || !lng) {
    console.error('🚨 위치 정보가 없습니다.');
    return [];
  }

  let allResults = [];
  const origin = { lat, lng };

  for (const { type, keyword } of categories) {
    try {
      const results = await fetchNearbyInstitutions(lat, lng, type, keyword);
      
      const resultsWithDistance = results.map((place) => ({
        ...place,
        distance: haversineDistance(origin, {
          lat: place.location.lat,
          lng: place.location.lng,
        }),
      }));

      allResults = [...allResults, ...resultsWithDistance];
    } catch (error) {
      console.error(`🚨 ${type} 정보 가져오기 실패:`, error);
      continue;
    }
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

  return uniqueByType;
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
  