import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';

export default function TermsScreen({ navigation }) {
  const handleBack = () => {
    navigation.goBack();
  };

  const handleAgree = () => {
    // 동의 후 다음 단계로 이동
    navigation.navigate('TermsScreen2');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Image source={require('../../assets/icons/info.png')} style={styles.infoIcon} />
          <Text style={styles.title}>WatchOut 서비스 이용을 위해 아래의{'\n'}이용 약관을 읽고 개인 정보 동의를 설정해주세요.</Text>
        </View>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. 응급상황 시 데이터 공유</Text>
          <Text style={styles.sectionContent}>
            본인은 응급상황 발생 시, 생체 정보(심박수, 움직임 등), 위치 정보 및 기타 필요한 건강 데이터를 WatchOut 서비스가 보호자, 의료기관 또는 관할 구조기관과 공유하는 것에 동의합니다.
            이 데이터는 오직 응급상황 대응 목적으로만 사용되며, 해당 상황 종료 후에는 관련 법령에 따라 안전하게 삭제 또는 보관됩니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. 위치 추적 허용</Text>
          <Text style={styles.sectionContent}>
            본인은 WatchOut 서비스의 정상적인 이용을 위해, 실시간 위치 정보가 수집·이용되는 것에 동의합니다.
            수집된 위치 정보는 사용자의 안전 확보와 응급 상황 시 정확한 대응을 위한 목적으로만 활용되며, 동의 철회 시 즉시 위치 정보 수집이 중단됩니다.          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>동의하지 않을 경우 서비스 이용에 제약이 있을 수 있습니다.</Text>
        <TouchableOpacity style={styles.agreeButton} onPress={handleAgree}>
          <Text style={styles.agreeButtonText}>동의하기</Text>
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
  sectionTitle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  sectionContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
  },
  footer: {
    padding: 20,
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
}); 