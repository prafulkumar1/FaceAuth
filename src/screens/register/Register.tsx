import React, { FC } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageSourcePropType, KeyboardAvoidingView, Platform } from 'react-native';
import STRINGS from './strings';
import { applogo } from './assets';

interface RegisterProps {
  navigation: {
    navigate: (screen: string) => void;
    goBack: () => void;
  };
}

const Register: FC<RegisterProps> = ({ navigation }) => {
  const navigateTo = (screen: string) => {
    navigation.navigate(screen);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Image source={applogo as ImageSourcePropType} style={styles.logo} />
        <TextInput
          style={styles.input}
          placeholder={STRINGS.emailPlaceholder}
          keyboardType="email-address"
          placeholderTextColor={'#ccc'}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder={STRINGS.passwordPlaceholder}
          placeholderTextColor={'#ccc'}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder={STRINGS.confirmPasswordPlaceholder}
          placeholderTextColor={'#ccc'}
          secureTextEntry
        />
        <TouchableOpacity style={styles.signupButton} onPress={() => navigateTo('Home')}>
          <Text style={styles.signupButtonText}>{STRINGS.signupButton}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.faceIdButton} onPress={() => navigateTo('FaceDetection')}>
          <Text style={styles.faceIdButtonText}>{STRINGS.faceIdButton}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.login} onPress={() => navigation.goBack()}>
          <Text style={styles.loginText}>{STRINGS.login}</Text>
        </TouchableOpacity>
        
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  faceIdButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 16,
  },
  faceIdButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 32,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 16,
    color: '#000',
  },
  signupButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 16,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  login: {
    marginTop: 16,
  },
  loginText: {
    color: '#007BFF',
  },
});

export default Register;
