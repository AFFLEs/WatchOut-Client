import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';

export const travelAPI = {
  getTravelDate: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.TRAVEL.BASE);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },
}; 