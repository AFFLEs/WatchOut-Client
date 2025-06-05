import axios from 'axios';
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APIError } from '../utils/apiUtils';
import { Platform } from 'react-native';
import * as Watch from 'react-native-watch-connectivity'; 

console.log('✅ API_BASE_URL:', API_BASE_URL);

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    withCredentials: true,
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
            
            // iOS 워치 앱으로 토큰 전달
            if (Platform.OS === 'ios') {
                try {
                    const isPaired = await Watch.getIsPaired();
                    const isWatchAppInstalled = await Watch.getIsWatchAppInstalled();
                    const isReachable = await Watch.getReachability();
                    
                    if (!isPaired || !isWatchAppInstalled || !isReachable) {
                        console.log('❌ 워치가 페어링되지 않았거나 앱이 설치되지 않음');
                        return;
                    }

                    const response = await Watch.sendMessage({ 
                        accessToken: token 
                    });
                } catch (error) {
                    console.error('❌ 워치 통신 실패:', error);
                }
            }

        }

        console.log(
            `📤 요청: [${(config.method || '').toUpperCase()}] ${config.baseURL}${config.url}`,
            {
                data: config.data,
                //디버깅용 0602
                headers: config.headers,
                url: config.url,
                method: config.method
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
            console.log("📦 전체 error.response 객체:", error.response);
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
