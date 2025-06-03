import { Platform } from 'react-native';
import * as Watch from 'react-native-watch-connectivity'; 
export const sendTokenToWatch = async (token) => {
    if (Platform.OS === 'ios') {
      try {        
        const isPaired = await Watch.getIsPaired();
        const isInstalled = await Watch.getIsWatchAppInstalled();
        const isReachable = await Watch.getReachability();
        
        if (!isPaired || !isInstalled || !isReachable) {
          console.log('❌ 워치 연결 상태 불량');
          return;
        }
        
        const response = await Watch.sendMessage({ accessToken: token });
        console.log('✅ 워치 응답:', response);
      } catch (error) {
        console.error('❌ 워치 전송 실패:', error);
      }
    }
  };
  