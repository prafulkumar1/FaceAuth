import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
interface SplashscreenProps {
  navigation: { replace: (screen: string) => void }
}
const Splashscreen = ({ navigation }: SplashscreenProps) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Splash Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Splashscreen;