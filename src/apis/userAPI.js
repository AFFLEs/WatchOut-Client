import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';

export const userAPI = {
    createUserInfo: async (userInfo) => {
        try {
            const response = await apiClient.post(ENDPOINTS.USERS.SIGNUP,userInfo);
            return handleApiResponse(response);
        } catch (error) {
            throw handleApiError(error);
        }
    }
}; 
