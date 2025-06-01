import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { alertTemplates } from '../datas/alertTemplates';
import { AlertCircle, X } from 'lucide-react-native'; // X는 닫기 아이콘

const AlertCard = ({ type, magnitude, distance, timeAgo, showCloseButton, onClose }) => {
  const template = alertTemplates[type];

  if (!template) return null;

  const description = template.getDescription({ magnitude, distance });

  return (
    <View style={[styles.container, { backgroundColor: template.backgroundColor }]}>
      <View style={styles.header}>
        <AlertCircle color={template.iconColor} size={20} />
        <Text style={styles.title}>{template.title}</Text>
        {showCloseButton && (
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X color="#888" size={18} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.description}>{description}</Text>
      {timeAgo ? <Text style={styles.time}>{timeAgo}</Text> : null}
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
