import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { alertTemplates } from '../datas/alertTemplates';
import { AlertCircle, X } from 'lucide-react-native'; // X는 닫기 아이콘

const AlertCard = ({ title, description }) => {

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AlertCircle color={'#D32F2F'} size={20} />
        <Text style={styles.title}>{title}</Text>
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
    backgroundColor: '#FFEAEA',
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
