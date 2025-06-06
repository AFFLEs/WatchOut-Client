import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendTokenToWatch } from './watchUtils'; // 워치 전송 함수

export const updateAccessToken = async (newToken) => {
  try {
    await AsyncStorage.setItem('accessToken', newToken);
    await sendTokenToWatch(newToken); // 워치로 새 토큰 전송
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    throw error;
  }
};
