import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, Platform, Alert } from 'react-native';

const typeIcons = {
  hospital: require('../assets/icons/hospital.png'),
  embassy: require('../assets/icons/embassy.png'),
  // 필요시 추가
};

export default function InstitutionCard({ name, distance, type, city }) {
  const handlePress = async () => {
    try {
      const query = encodeURIComponent(`${name} ${city}`);
      
      if (Platform.OS === 'ios') {
        // Google Maps 앱 > Apple Maps > 웹 순서로 시도
        const googleMapsUrl = `comgooglemaps://?q=${query}&zoom=15`;
        const appleMapsUrl = `maps://maps.apple.com/?q=${query}`;
        const webUrl = `https://www.google.com/maps/search/${query}`;

        const canOpenGoogleMaps = await Linking.canOpenURL(googleMapsUrl);
        
        if (canOpenGoogleMaps) {
          await Linking.openURL(googleMapsUrl);
        } else {
          const canOpenAppleMaps = await Linking.canOpenURL(appleMapsUrl);
          if (canOpenAppleMaps) {
            await Linking.openURL(appleMapsUrl);
          } else {
            await Linking.openURL(webUrl);
          }
        }
      } else {
        // Android: Google Maps 앱 > 웹
        const androidUrl = `google.navigation:q=${query}`;
        const webUrl = `https://www.google.com/maps/search/${query}`;

        try {
          await Linking.openURL(androidUrl);
        } catch {
          await Linking.openURL(webUrl);
        }
      }
    } catch (error) {
      console.error('Error opening maps:', error);
      Alert.alert(
        '오류',
        '지도를 열 수 없습니다. 잠시 후 다시 시도해주세요.',
        [{ text: '확인' }]
      );
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.row}>
      <Image source={typeIcons[type]} style={styles.icon} resizeMode="contain" />
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.distance}>{distance} 거리</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  icon: {
    width: 22,
    height: 20,
    marginRight: 15,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#1F2937',
  },
  distance: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 1,
  },
});