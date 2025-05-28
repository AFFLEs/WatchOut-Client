import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleLogin = async () => {
    const userInfo = {
      email,
      password,
    };
    try {
      const response = await userAPI.loginUserInfo(userInfo);
      const { accessToken, refreshToken } = response.data.data;
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      console.log('로그인 성공:', userInfo);
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('로그인 실패', error.message || '알 수 없는 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image source={require('../../assets/icons/logo.png')} style={styles.logo} />
        <Text style={styles.description}>여행자들을 위한 스마트 워치 안전 관리 서비스</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputText}>이메일</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail} 
        />
        <Text style={styles.inputText}>비밀번호</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry 
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>
        <Text style={styles.signupText}>회원이 아니신가요?</Text>
        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
          <Text style={styles.signupButtonText}>회원가입</Text>
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
  contentContainer: {
    alignItems: 'left',
    marginTop: 103,
    marginLeft: 20,
  },
  logo: {
    resizeMode: 'contain',
  },
  description: {
    marginTop: 5,
    marginLeft: 20,
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 38,
  },
  inputContainer: {
    alignItems: 'center',
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  inputText: {
    marginBottom: 5,
    fontSize: 12,
    color: '#6B7280',
    width: '90%',
  },
  loginButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 10,
    marginTop: 29,
    width: '90%',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#2563EB',
    width: '90%',
  },
  signupButtonText: {
    color: '#2563EB',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  signupText: {
    marginTop: 54,
    marginBottom: 15,
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  
});
