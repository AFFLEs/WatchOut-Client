import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [phone, setPhone] = useState('');

  const handleBack = () => {
    navigation.navigate('Login');
  };
  const handleSignUp = () => {
    navigation.navigate('Terms');
  };
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image source={require('../../assets/icons/logo.png')} style={styles.logo} />
        <Text style={styles.description}>여행자들을 위한 스마트 워치 안전 관리 서비스</Text>
      </View>
      <View style={styles.inputContainer}>
          <Text style={styles.inputText}>이름</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName} 
          />
          <Text style={styles.inputText}>생년월일</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={birthday}
            onChangeText={setBirthday}
          />
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
          />
          <Text style={styles.inputText}>비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
          />
          <Text style={styles.inputText}>연락처</Text>
          <TextInput
            style={styles.input}
            placeholder="010-1234-5678"
            value={phone}
            onChangeText={setPhone}
          />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
          <Text style={styles.signupButtonText}>회원가입 진행하기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={handleBack}>
          <Text style={styles.loginButtonText}>로그인하기</Text>
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
    marginTop: 20,
    marginLeft: 29,
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
  },
  loginButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#2563EB',
    width: '90%',
  },
  loginButtonText: {
    color: '#2563EB',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
    width: '90%',
    marginBottom: 15,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignItems: 'center',
  },
});
