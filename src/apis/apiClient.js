import axios from 'axios';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APIError, API_STATUS, API_CODE } from '../utils/apiUtils';

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
        const token = await AsyncStorage.getItem('accessToken');

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
        return Promise.reject(APIError.fromAxiosError(error));
    }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
    response => {
        const { status, message, code } = response.data;
        
        console.log(
            `✅ 응답: [${(response.config.method || '').toUpperCase()}] ${response.config.baseURL}${response.config.url}`,
            {
                status: response.status,
                apiStatus: status,
                message,
                code,
                data: response.data,
            }
        );
        return response;
    },
    error => {
        const apiError = APIError.fromAxiosError(error);
        
        // API 에러 응답 처리
        if (error.response) {
            console.error(
                `❌ API 에러: [${error.config?.method?.toUpperCase() || 'Unknown Method'}] ${error.config?.baseURL || ''}${error.config?.url || 'Unknown URL'}`,
                {
                    httpStatus: error.response.status,
                    apiStatus: apiError.status,
                    code: apiError.code,
                    message: apiError.message,
                    data: error.response.data,
                }
            );
        }
        // 네트워크 에러 처리
        else if (error.request) {
            console.error(
                `❌ 네트워크 에러: [${error.config?.method?.toUpperCase() || 'Unknown Method'}] ${error.config?.baseURL || ''}${error.config?.url || 'Unknown URL'}`,
                {
                    name: error.name,
                    message: apiError.message,
                    code: apiError.code,
                }
            );
        }
        // 기타 에러 처리
        else {
            console.error(
                `❌ 기타 에러:`,
                {
                    name: error.name,
                    message: apiError.message,
                    stack: error.stack,
                }
            );
        }

        return Promise.reject(apiError);
    }
);

export default apiClient;
