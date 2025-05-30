import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Switch, TextInput } from 'react-native';

export default function TermsScreen({ navigation, route }) {
  const [vibrationAlert, setVibrationAlert] = useState(false);
  const [enableWatchEmergencySignal, setEnableWatchEmergencySignal] = useState(false);
  const [guardianContact, setGuardianContact] = useState(''); 
  const { userInfo, termsAgreement1 } = route.params;
  const handleBack = () => {
    navigation.goBack();
  };

  const handleAgree = () => {
    if (vibrationAlert && enableWatchEmergencySignal && guardianContact.trim()) {
      // 모든 항목에 동의한 경우에만 진행
      navigation.navigate('TravelDate', { 
        userInfo,
        termsAgreement1,
        termsAgreement2: {
          vibrationAlert,
          enableWatchEmergencySignal,
          guardianContact,
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Image source={require('../../assets/icons/info.png')} style={styles.infoIcon} />
          <Text style={styles.title}>WatchOut 서비스 이용을 위한{'\n'}아래의 설정을 확인해주세요.</Text>
        </View>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>진동 경고 알림</Text>
            <Switch
              trackColor={{ false: "#E5E7EB", true: "#2563EB" }}
              thumbColor={vibrationAlert ? "#ffffff" : "#ffffff"}
              ios_backgroundColor="#E5E7EB"
              onValueChange={setVibrationAlert}
              value={vibrationAlert}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>스마트 위치 긴급 구조 요청 전송 켜기</Text>
            <Switch
              trackColor={{ false: "#E5E7EB", true: "#EF4444" }}
              thumbColor={enableWatchEmergencySignal ? "#ffffff" : "#ffffff"}
              ios_backgroundColor="#E5E7EB"
              onValueChange={setEnableWatchEmergencySignal}
              value={enableWatchEmergencySignal}
            />
          </View>
          <Text style={styles.sectionSubtext}>
            스마트 워치의 위면을 5초 이상 누를 경우,{'\n'}현지 경찰서와 설정한 보호자에게 현재 상황 전달 및{'\n'}긴급 구조 요청이 전송됩니다.
          </Text>
        </View>

        {/* 보호자 연락처 입력 필드 추가 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>보호자 연락처</Text>
          <TextInput
            style={styles.input}
            placeholder="010-1234-5678"
            value={guardianContact}
            onChangeText={setGuardianContact}
            keyboardType="phone-pad"
            maxLength={13}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>동의하지 않을 경우 서비스 이용에 제약이 있을 수 있습니다.</Text>
        <TouchableOpacity 
          style={[styles.agreeButton, (!vibrationAlert || !enableWatchEmergencySignal) && styles.agreeButtonDisabled]} 
          onPress={handleAgree}
          disabled={!vibrationAlert || !enableWatchEmergencySignal || !guardianContact.trim()}
        >
          <Text style={styles.agreeButtonText}>다음으로</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.disagreeButton} onPress={handleBack}>
          <Text style={styles.disagreeButtonText}>뒤로가기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    marginTop: 100,
    paddingHorizontal: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
    marginLeft: 20,
  },
  infoIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    marginTop: 3,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 42,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  sectionSubtext: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
    marginTop: 8,
  },
  footer: {
    padding: 20,
    paddingBottom: 34,
    marginBottom: 50,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 15,
  },
  agreeButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  agreeButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  agreeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  disagreeButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  disagreeButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginTop: 10,
    backgroundColor: '#F9FAFB',
  },
}); 