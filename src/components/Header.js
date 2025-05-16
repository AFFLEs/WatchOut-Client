import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
{/* npm install react-native-safe-area-context 필요 */}
export default function Header() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Image
          source={require('../assets/icons/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
    flex: 0,
  },
  container: {
    height: 60,
    backgroundColor: '#fff',
//    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  logo: {
    height: '100%',
  }
});
