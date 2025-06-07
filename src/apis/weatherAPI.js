import { CONFIG } from '../config/keys';

// 캐시 저장소
let weatherCache = {
  data: null,
  timestamp: null,
  location: null
};

// 캐시 유효성 검사
const isCacheValid = (latitude, longitude) => {
  if (!weatherCache.data || !weatherCache.timestamp || !weatherCache.location) {
    return false;
  }

  const now = Date.now();
  const isExpired = (now - weatherCache.timestamp) > CONFIG.WEATHER_API.CACHE_DURATION;
  const isSameLocation =
    Math.abs(weatherCache.location.lat - latitude) < 0.01 &&
    Math.abs(weatherCache.location.lng - longitude) < 0.01;

  return !isExpired && isSameLocation;
};

// 날씨 상태 타입을 한국어로 매핑
const weatherTypeToKorean = {
  CLEAR: '맑음',
  CLOUDY: '흐림',
  PARTLY_CLOUDY: '부분적으로 흐림',
  OVERCAST: '완전히 흐림',
  FOGGY: '안개',
  MISTY: '박무',
  HAZY: '연무',
  WINDY: '강풍',
  WIND_AND_RAIN: '강한 바람과 강우',
  LIGHT_RAIN_SHOWERS: '간헐적 약한 비',
  CHANCE_OF_SHOWERS: '소나기 가능성',
  SCATTERED_SHOWERS: '간헐적인 비',
  RAIN_SHOWERS: '소나기',
  HEAVY_RAIN_SHOWERS: '강한 소나기',
  LIGHT_TO_MODERATE_RAIN: '약한~보통 비',
  MODERATE_TO_HEAVY_RAIN: '보통~강한 비',
  RAIN: '비',
  LIGHT_RAIN: '약한 비',
  HEAVY_RAIN: '폭우',
  RAIN_PERIODICALLY_HEAVY: '간헐적 폭우',
  LIGHT_SNOW_SHOWERS: '약한 눈',
  CHANCE_OF_SNOW_SHOWERS: '눈 가능성',
  SCATTERED_SNOW_SHOWERS: '간헐적인 눈',
  SNOW_SHOWERS: '소낙눈',
  HEAVY_SNOW_SHOWERS: '강한 소낙눈',
  LIGHT_TO_MODERATE_SNOW: '약한~보통 눈',
  MODERATE_TO_HEAVY_SNOW: '보통~강한 눈',
  SNOW: '눈',
  LIGHT_SNOW: '약한 눈',
  HEAVY_SNOW: '폭설',
  SNOWSTORM: '눈보라',
  SNOW_PERIODICALLY_HEAVY: '간헐적 폭설',
  HEAVY_SNOW_STORM: '심한 눈보라',
  BLOWING_SNOW: '날리는 눈',
  RAIN_AND_SNOW: '비와 눈',
  HAIL: '우박',
  HAIL_SHOWERS: '우박 소나기',
  THUNDERSTORM: '뇌우',
  THUNDERSHOWER: '천둥번개 소나기',
  LIGHT_THUNDERSTORM_RAIN: '약한 뇌우',
  SCATTERED_THUNDERSTORMS: '간헐적 뇌우',
  HEAVY_THUNDERSTORM: '심한 뇌우'
};

// 날씨 상태에 따른 알림 메시지 생성
const getWeatherAlertMessage = (weatherType, temperature) => {

  const koreanType = weatherTypeToKorean[weatherType] || '일반';

  const dangerousWeather = [
    'HEAVY_RAIN', 'HEAVY_RAIN_SHOWERS', 'RAIN_PERIODICALLY_HEAVY',
    'HEAVY_SNOW', 'HEAVY_SNOW_SHOWERS', 'SNOWSTORM', 'HEAVY_SNOW_STORM',
    'THUNDERSTORM', 'HEAVY_THUNDERSTORM', 'HAIL', 'WINDY', 'WIND_AND_RAIN'
  ];

  if (dangerousWeather.includes(weatherType)) {
    return {
      title: `악천후 경보 - ${koreanType}`,
      description: `현재 기온 ${temperature}°C, 외출 시 각별한 주의가 필요합니다. 안전한 실내에 머물러 주세요.`,
      isWarning: true
    };
  }

  return {
    title: `현재 날씨 - ${koreanType}`,
    description: `현재 기온 ${temperature}°C입니다. 외출 시 날씨를 고려해주세요.`,
    isWarning: false
  };
};

export const weatherAPI = {
  getCurrentWeather: async (latitude, longitude) => {
    if (isCacheValid(latitude, longitude)) {
      console.log('날씨 정보 캐시에서 로드');
      return {
        success: true,
        data: weatherCache.data,
        fromCache: true
      };
    }

    try {
      const url = `${CONFIG.WEATHER_API.BASE_URL}/currentConditions:lookup?key=${CONFIG.GOOGLE_MAPS_API_KEY}&location.latitude=${35.2271}&location.longitude=${-80.8431}`; // 한국 지원 불가로 인한 하드 코딩
      console.log('[weatherAPI] 요청 URL:', url);

      const response = await fetch(url);
      const text = await response.text(); // ⚠️ 일단 텍스트로 받아서 확인
    
      if (!response.ok) {
        console.error('[weatherAPI] 응답 실패:', response.status, text);
        return null;
        // throw new Error(`Weather API Error: ${response.status}`);
      }
    
      const data = JSON.parse(text); // 텍스트를 직접 파싱

      const weatherData = {
        temperature: data.temperature?.degrees ?? 'N/A',
        weatherType: data.weatherCondition?.type || 'CLEAR',
        description: data.weatherCondition?.description?.text || '',
        iconUrl: data.weatherCondition?.iconBaseUri || null
      };

      weatherCache = {
        data: weatherData,
        timestamp: Date.now(),
        location: { lat: latitude, lng: longitude }
      };

      return {
        success: true,
        data: weatherData,
        fromCache: false
      };
    } catch (error) {
      console.error('날씨 정보 가져오기 실패:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  createWeatherAlert: async (latitude, longitude) => {
    if (!CONFIG.ALERTS.WEATHER_ENABLED) {
      return null;
    }

    try {
      const weatherResponse = await weatherAPI.getCurrentWeather(latitude, longitude);
      if (!weatherResponse.success) return null;

      const { temperature, weatherType } = weatherResponse.data;
      const alertData = getWeatherAlertMessage(weatherType, temperature);

      if (CONFIG.ALERTS.SEVERE_WEATHER_ONLY && !alertData.isWarning) {
        return null;
      }

      return {
        title: alertData.title,
        description: alertData.description,
        type: 'weather',
        isWarning: alertData.isWarning,
        timestamp: new Date().toISOString(),
        fromCache: weatherResponse.fromCache
      };
    } catch (error) {
      console.error('날씨 알림 생성 실패:', error);
      return null;
    }
  },

  clearCache: () => {
    weatherCache = {
      data: null,
      timestamp: null,
      location: null
    };
  }
};
