import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Image, TouchableOpacity, Alert } from 'react-native';
import SectionCard from '../../components/SectionCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../../App';
import { userAPI } from '../../apis/userAPI';
import { formatPhoneNumberForDisplay } from '../../utils/userUtils';


export default function ProfileScreen() {
  const [emergencyDataSharing, setEmergencyDataSharing] = useState(true);
  const [locationDataSharing, setLocationDataSharing] = useState(true);

  const [connectedWatch, setConnectedWatch] = useState(null);
  const { setIsAuthenticated, setAccessToken } = useContext(AuthContext);
  const [name, setName] = useState('한예원');
  const [birth, setBirth] = useState('1990-01-01');
  const [phoneNumber, setPhoneNumber] = useState('010-0000-0000');

  // 위치 추적 테스트 함수
  const testLocationTracking = async () => {
    Alert.alert(
      '🧪 위치 추적 테스트',
      '지금 즉시 현재 위치를 서버에 전송합니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '전송',
          onPress: async () => {
            try {
              await sendLocationNow();
              Alert.alert('✅ 성공', '위치가 성공적으로 전송되었습니다.');
            } catch (error) {
              Alert.alert('❌ 오류', '위치 전송 중 오류가 발생했습니다.');
            }
          }
        }
      ]
    );
  };

  // 추적 상태 확인
  const checkTrackingStatus = () => {
    const isActive = isLocationTrackingActive();
    Alert.alert(
      '📊 위치 추적 상태',
      `현재 상태: ${isActive ? '✅ 활성화됨 (5분 간격)' : '❌ 비활성화됨'}\n\n` +
      '• 로그인 시 자동으로 시작됩니다.\n' +
      '• 로그아웃 시 자동으로 중지됩니다.\n' +
      '• 앱이 실행 중일 때만 작동합니다.',
      [{ text: '확인' }]
    );
  };

  const handleLogout = async () => {
    try {
      // 위치 추적 중지
      stopLocationTracking();
      
      // 토큰 삭제
      await AsyncStorage.removeItem('accessToken');
      
      // 인증 상태 초기화
      setAccessToken(null);
      setIsAuthenticated(false);
      BackgroundFetch.stop();
      console.log('로그아웃 성공');
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      Alert.alert('오류', '로그아웃 중 문제가 발생했습니다.');
    }
  };
  const changeEmergencyToggle = async () => {
    if (emergencyDataSharing) {  
      Alert.alert(
        '알림',
        '동의하지 않을 경우 서비스 이용에 제약이 있을 수 있습니다.',
        [
          {
            text: '취소',
            style: 'cancel'
          },
          {
            text: '확인',
            onPress: async () => {
              try {
                const response = await userAPI.changeEmergencyToggle(false);
                setEmergencyDataSharing(false);
              } catch (error) {
                console.error('응급 상황 시 데이터 공유 변경 실패:', error);
                Alert.alert('오류', '설정 변경에 실패했습니다.');
              }
            }
          }
        ]
      );
    } else {  
      try {
        const response = await userAPI.changeEmergencyToggle(true);
        setEmergencyDataSharing(true);
      } catch (error) {
        console.error('응급 상황 시 데이터 공유 변경 실패:', error);
        Alert.alert('오류', '설정 변경에 실패했습니다.');
      }
    }
  };

  const changeLocationToggle = async () => {
    if (locationDataSharing) { 
      Alert.alert(
        '알림',
        '동의하지 않을 경우 서비스 이용에 제약이 있을 수 있습니다.',
        [
          {
            text: '취소',
            style: 'cancel'
          },
          {
            text: '확인',
            onPress: async () => {
              try {
                const response = await userAPI.changeLocationToggle(false);
                setLocationDataSharing(false);
              } catch (error) {
                console.error('위치 추적 허용 변경 실패:', error);
                Alert.alert('오류', '설정 변경에 실패했습니다.');
              }
            }
          }
        ]
      );
    } else {  
      try {
        const response = await userAPI.changeLocationToggle(true);
        setLocationDataSharing(true);
      } catch (error) {
        console.error('위치 추적 허용 변경 실패:', error);
        Alert.alert('오류', '설정 변경에 실패했습니다.');
      }
    }
  };


  // 연결된 워치 정보를 가져오는 함수
  const fetchConnectedWatchInfo = async () => {
    try {
      // TODO: 실제 워치 연동 API 호출
      // const response = await watchApi.getConnectedDevice();
      // setConnectedWatch(response.data);
      
      // dummy data
      const mockWatchData = {
        model: "Galaxy Watch Series 8",
        isConnected: true
      };
      setConnectedWatch(mockWatchData);
    } catch (error) {
      console.error('워치 정보 가져오기 실패:', error);
    }
  };

  const fetchUserInfo = async () => {
    const userInfo = await userAPI.getUserInfo();
    setPhoneNumber(userInfo.data.phoneNumber || '알수없음');
    setName(userInfo.data.name || '알수없음');
    setBirth(userInfo.data.birthdate || '알수없음');
  };

  useEffect(() => {
    fetchConnectedWatchInfo();
    fetchUserInfo();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* 프로필 헤더 섹션 */}
      <View style={styles.profileHeader}>
        <View style={styles.profileContent}>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{name}</Text>
            <Text style={styles.profileLocation}>서울, 대한민국</Text>
          </View>
        </View>
      </View>

      {/* 개인 정보 섹션 */}
      <SectionCard title="개인 정보" style={styles.section}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>생년월일</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.value}>{birth}</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>전화번호</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.value}>{formatPhoneNumberForDisplay(phoneNumber)}</Text>
          </View>
        </View>
      </SectionCard>

      {/* 개인 정보 보호 설정 섹션 */}
      <SectionCard title="개인 정보 보호 설정" style={styles.section}>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>응급 상황 시 데이터 공유</Text>
            <Text style={styles.settingDesc}>비상 시 개인정보 공유를 허용합니다.</Text>
          </View>
          <Switch
            value={emergencyDataSharing}
            onValueChange={changeEmergencyToggle}
            trackColor={{ false: '#ccc', true: '#2563EB' }}
            thumbColor="#fff"
          />
        </View>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>위치 추적 허용</Text>
            <Text style={styles.settingDesc}>주기적인 위치 추적을 허용합니다.</Text>
          </View>
          <Switch
            value={locationDataSharing}
            onValueChange={changeLocationToggle}
            trackColor={{ false: '#ccc', true: '#2563EB' }}
            thumbColor="#fff"
          />
        </View>
        <Text style={styles.warningText}>동의하지 않을 경우 서비스 이용에 제약이 있을 수 있습니다.</Text>
      </SectionCard>

      {/* 연결 기기 설정 섹션 */}
      <SectionCard title="연결 기기 설정" style={styles.section}>
        <View style={styles.deviceRow}>
          <View>
            <Text style={styles.deviceName}>
              {connectedWatch ? connectedWatch.model : '연결된 기기 없음'}
            </Text>
            <Text style={styles.deviceStatus}>
              {connectedWatch?.isConnected ? '연결 완료' : '연결 안됨'}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.disconnectBtn}
            onPress={async () => {
              // TODO: 실제 워치 연결 해제 API 호출
              // await watchApi.disconnect();
              setConnectedWatch(null);
            }}
          >
            <Text style={styles.disconnectBtnText}>연결 해제</Text>
          </TouchableOpacity>
        </View>
      </SectionCard>

      {/* 위치 추적 테스트 섹션 */}
      <SectionCard title="개발자 도구" style={styles.section}>
        <View style={styles.testContainer}>
          <TouchableOpacity style={styles.testButton} onPress={checkTrackingStatus}>
            <Text style={styles.testButtonText}>📊 추적 상태 확인</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.testButton, styles.sendButton]} onPress={testLocationTracking}>
            <Text style={[styles.testButtonText, styles.sendButtonText]}>🧪 즉시 위치 전송</Text>
          </TouchableOpacity>
        </View>
      
      </SectionCard>

      {/* 로그아웃 버튼 */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity 
          style={[styles.logoutButton, styles.section]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutBtnText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FA',
  },
  profileHeader: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 40,
  },
  editButton: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 6,
  },
  editIcon: {
    width: 16,
    height: 16,
    tintColor: '#fff',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    marginTop: 16,
  },
  infoContainer: {
    marginBottom: 16,
  },
  inputContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    color: '#1F2937',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingTitle: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  deviceName: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 4,
  },
  deviceStatus: {
    fontSize: 12,
    color: '#10B981',
  },
  disconnectBtn: {
    fontSize: 14,
    color: '#EF4444',
  },
  disconnectBtnText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
    borderRadius: 8,
    textDecorationLine: 'underline',
  },
  logoutContainer: {
    
    marginHorizontal: 16,
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  logoutBtnText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '500',
  },
  warningText: {    
    fontSize: 10,
    color: '#6B7280',
    marginTop: 12,
    textAlign: 'center',
  },    
  testContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  testButton: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    width: '50%',
  },
  testButtonText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  sendButton: {
    backgroundColor: '#2563EB',
  },
  sendButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  
});