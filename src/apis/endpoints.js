export const ENDPOINTS = {
  USERS: {
    SIGNUP: '/api/users/signup',
    LOGIN: '/api/users/login',
    LOGOUT: '/api/users/logout',
    SETTINGS: {
      CONSENTS: '/api/users/settings/consents',
      EMERGENCY: '/api/users/settings/emergency',
      LOCATION: '/api/users/settings/location',
      ALERTS: '/api/users/settings/alerts',
      VIBRATION: '/api/users/settings/vibration',
      WATCH_EMERGENCY: '/api/users/settings/watch-emergency',
      GUARDIAN_PHONE: '/api/users/settings/guardian-phone'
    }
  },
  TRAVEL: {
    BASE: '/api/travels',
  },
  SPOT: {
    BASE: '/api/spots',
    LATEST: (date) => `/api/spots/latest?date=${date}`,
    DETAIL: (date) => `/api/spots/detail?date=${date}`,
    DELETE: (spotId) => `/api/spots/${spotId}`
  },
  EMERGENCY: {
    BASE: '/api/emergencies',
    DETAIL: (emergencyId) => `/api/emergencies/${emergencyId}`
  }
}; 