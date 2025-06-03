import apiClient from './apiClient';
import { ENDPOINTS } from './endpoints';
import { handleApiResponse, handleApiError } from '../utils/apiUtils';

export const travelAPI = {
  getTravelDate: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.TRAVEL.BASE);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getLatestTravelSpot: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.SPOT.LATEST);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  getDetailTravelSpot: async (date) => {
    try {
      const response = await apiClient.get(ENDPOINTS.SPOT.DETAIL(date));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  postTravelSpot: async (data) => {
    try {
      const response = await apiClient.post(ENDPOINTS.SPOT.BASE, data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
  deleteTravelSpot: async (spotId) => {
    try {
      const response = await apiClient.delete(ENDPOINTS.SPOT.DELETE(spotId));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 