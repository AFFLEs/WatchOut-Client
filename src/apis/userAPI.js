import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';

export const userAPI = {
    createUserInfo: async (signUpInfo) => {
        try {
            const response = await apiClient.post(ENDPOINTS.USERS.SIGNUP,signUpInfo);
            return handleApiResponse(response);
        } catch (error) {
            throw handleApiError(error);
        }
    },
    loginUserInfo: async (loginInfo) => {
        try {
            const response = await apiClient.post(ENDPOINTS.USERS.LOGIN,loginInfo);
            return handleApiResponse(response);
        } catch (error) {
            throw handleApiError(error);
        }
    }
}; 
