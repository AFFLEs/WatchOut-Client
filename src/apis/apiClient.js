import axios from 'axios';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const authNotRequired = ['/signup', '/login'];

// 요청 인터셉터
apiClient.interceptors.request.use(
    async config => {
        const token = await AsyncStorage.getItem('authToken');

        if (token && !authNotRequired.includes(config.url || '')) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(
            `📤 요청: [${(config.method || '').toUpperCase()}] ${config.baseURL}${config.url}`,
            {
                data: config.data,
            }
        );

        return config;
    },
    error => {
        console.error('요청 인터셉터 오류:', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
    response => {
        console.log(
            `✅ 응답: [${(response.config.method || '').toUpperCase()}] ${response.config.baseURL}${response.config.url}`,
            {
                status: response.status,
                data: response.data,
            }
        );
        return response;
    },
    error => {
        console.error(
            `❌ 오류: [${error.config?.method?.toUpperCase() || 'Unknown Method'}] ${error.config?.baseURL || ''}${error.config?.url || 'Unknown URL'}`,
            {
                status: error.response?.status || 'Unknown Status',
                data: error.response?.data || error.message,
            }
        );
        return Promise.reject(error);
    }
);

export default apiClient;
