import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';

export const disastersAPI = {
    getAlert: async (lat, lng) => {
        const response = await apiClient.get(ENDPOINTS.DISASTERS.GET_ALERT(lat, lng));
        return response.data;
    }
}; 