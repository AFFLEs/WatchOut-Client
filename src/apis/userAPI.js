import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';

export const userAPI = {
    createUserInfo: async (signUpInfo) => {
        try {
            const response = await apiClient.post(ENDPOINTS.USERS.SIGNUP, signUpInfo);
            return handleApiResponse(response);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    loginUserInfo: async (loginInfo) => {
        try {
            const response = await apiClient.post(ENDPOINTS.USERS.LOGIN, loginInfo);
            return handleApiResponse(response);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    getUserInfo: async () => {
        try {
            const response = await apiClient.get(ENDPOINTS.USERS.GET_USER_INFO);
            return handleApiResponse(response);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    updateEmergencySetting: async (newEnabled) => {
        try {
            const response = await apiClient.patch(ENDPOINTS.USERS.SETTINGS.WATCH_EMERGENCY, { enableWatchEmergencySignal: newEnabled });
            return handleApiResponse(response);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    updateGuardianPhone: async (newGuardianPhone) => {
        try {
            const response = await apiClient.patch(ENDPOINTS.USERS.SETTINGS.GUARDIAN_PHONE, { guardianPhone: newGuardianPhone });
            return handleApiResponse(response);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    changeEmergencyToggle: async (agreeEmergencyDataShare) => {
        try {
            const response = await apiClient.patch(ENDPOINTS.USERS.SETTINGS.EMERGENCY, {
                agreeEmergencyDataShare
            });
            return handleApiResponse(response);
        } catch (error) {
            throw handleApiError(error);
        }
    },

    changeLocationToggle: async (allowLocationTracking) => {
        try {
            const response = await apiClient.patch(ENDPOINTS.USERS.SETTINGS.LOCATION, {
                allowLocationTracking
            });
            return handleApiResponse(response);
        } catch (error) {
            throw handleApiError(error);
        }
    }
};
