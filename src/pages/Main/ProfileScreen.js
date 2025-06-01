import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Image, TouchableOpacity, Alert } from 'react-native';
import SectionCard from '../../components/SectionCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../../App';
import { userAPI } from '../../apis/userAPI';
import { formatPhoneNumberForDisplay } from '../../utils/userUtils';

export default function ProfileScreen() {
  const [locationDataSharing, setLocationDataSharing] = useState(true);
  const [healthDataSharing, setHealthDataSharing] = useState(true);
  const [connectedWatch, setConnectedWatch] = useState(null);
  const { setIsAuthenticated, setAccessToken } = useContext(AuthContext);
  const [name, setName] = useState('한예원');
  const [birth, setBirth] = useState('1990-01-01');
  const [phoneNumber, setPhoneNumber] = useState('010-0000-0000');

  const handleLogout = async () => {
    try {
      // 토큰 삭제
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      
      // 인증 상태 초기화
      setAccessToken(null);
      setIsAuthenticated(false);
      
      console.log('로그아웃 성공');
    } catch (error) {
      console.error('로그아웃 중 오류:', error);
      Alert.alert('오류', '로그아웃 중 문제가 발생했습니다.');
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
            value={locationDataSharing}
            onValueChange={setLocationDataSharing}
            trackColor={{ false: '#ccc', true: '#2563EB' }}
            thumbColor="#fff"
            disabled={true}
          />
        </View>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingTitle}>위치 추적 허용</Text>
            <Text style={styles.settingDesc}>주기적인 위치 추적을 허용합니다.</Text>
          </View>
          <Switch
            value={healthDataSharing}
            onValueChange={setHealthDataSharing}
            trackColor={{ false: '#ccc', true: '#2563EB' }}
            thumbColor="#fff"
            disabled={true}
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
});
