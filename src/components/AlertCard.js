import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { alertTemplates } from '../datas/alertTemplates';
import { AlertCircle, X, Cloud, CloudRain, Sun } from 'lucide-react-native'; // 날씨 아이콘 추가

const AlertCard = ({ title, description, type, isWarning }) => {
  // 알림 타입에 따른 아이콘과 스타일 결정
  const getAlertStyle = () => {
    if (type === 'weather') {
      if (isWarning) {
        return {
          backgroundColor: '#FFF3CD', // 황색 경고
          icon: <CloudRain color={'#856404'} size={20} />,
          titleColor: '#856404'
        };
      } else {
        return {
          backgroundColor: '#E8F4FD', // 연한 파랑색
          icon: <Sun color={'#0066CC'} size={20} />,
          titleColor: '#0066CC'
        };
      }
    }
    
    // 기본 경고 스타일 (기존 재해/안전 경보)
    return {
      backgroundColor: '#FFEAEA',
      icon: <AlertCircle color={'#D32F2F'} size={20} />,
      titleColor: '#D32F2F'
    };
  };

  const alertStyle = getAlertStyle();

  return (
    <View style={[styles.container, { backgroundColor: alertStyle.backgroundColor }]}>
      <View style={styles.header}>
        {alertStyle.icon}
        <Text style={[styles.title, { color: alertStyle.titleColor }]}>{title}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    marginLeft: 8,
    marginBottom: 4,
    fontWeight: 'bold',
    fontSize: 15,
    flex: 1,
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
  description: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },
  time: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
  },
});

export default AlertCard;
