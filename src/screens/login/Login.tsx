import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { applogo } from './assets';
import STRINGS from '../login/strings';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginProps { 
  navigation: {
    navigate: (screen: string) => void;
  };
}
const Login = ({ navigation }: LoginProps) => {
  const navigateTo = (screen: string) => {
    navigation.navigate(screen);
  }
  const [faceData, setFaceData] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchFaceData = async () => {
      try {
        const faceData = await AsyncStorage.getItem('faceData');
        if (faceData) {
          setFaceData(faceData);
        }
      } catch (error) {
        console.error('Failed to fetch face data from storage', error);
      }
    };

    fetchFaceData();
  }, []);
  const clearStorage = async () => {
    await AsyncStorage.removeItem('faceData');
    setFaceData(null)
  }
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Image source={applogo} style={styles.logo} />
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
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText} onPress={() => navigateTo('ForgotPassword')}>{STRINGS.forgotPassword}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={() => navigateTo('Home')}>
          <Text style={styles.loginButtonText}>{STRINGS.loginButton}</Text>
        </TouchableOpacity>
        {faceData && <TouchableOpacity style={styles.faceIdButton} onPress={() => navigateTo('FaceRecognition')}>
          <Text style={styles.faceIdButtonText}>{STRINGS.faceIdLogin}</Text>
        </TouchableOpacity>}
        {faceData && <TouchableOpacity style={styles.newButton} onPress={clearStorage}>
          <Text style={styles.newButtonText}>{STRINGS.removeBtn}</Text>
        </TouchableOpacity>}
        <TouchableOpacity style={styles.register} onPress={() => navigateTo('Register')}>
          <Text style={styles.registerText}>{STRINGS.signUp}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  newButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#6c757d',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 16,
  },
  newButtonText: {
    color: '#fff',
    fontSize: 16,
  },
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
  register: {
    marginTop: 16,
  },
  registerText: {
    color: '#007BFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#007BFF',
  },
  loginButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Login;