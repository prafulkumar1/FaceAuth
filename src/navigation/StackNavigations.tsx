import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Splashscreen from '../screens/splashscreen/Splashscreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import Login from '../screens/login/Login';
import Home from '../screens/home/Home';
import ForgotPassword from '../screens/forgotPassword/ForgotPassword';
import Register from '../screens/register/Register';
import FaceDetection from '../screens/faceDetection/FaceDetection';
import FaceRecognition from '../screens/faceDetection/FaceRecognition';

const Stack = createStackNavigator();
export default function StackNavigations() {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splashscreen" component={Splashscreen} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                <Stack.Screen name="Register" component={Register} />
                <Stack.Screen name="FaceDetection" component={FaceDetection} />
                <Stack.Screen name="FaceRecognition" component={FaceRecognition} />
            </Stack.Navigator>
        </SafeAreaView>
    )
}