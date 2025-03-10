import React, { useState, useRef } from "react";
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, Platform, NativeModules } from "react-native";
import { RNCamera } from "react-native-camera";
import AsyncStorage from '@react-native-async-storage/async-storage';
const { TFLiteModule } = NativeModules;
interface FaceDetectionProps {
    navigation: { navigate: (arg: string) => void };
}
export default function FaceDetection({navigation}: FaceDetectionProps) {
    const cameraRef = useRef<RNCamera | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [faceAligned, setFaceAligned] = useState(false);
    const [multipleFaces, setMultipleFaces] = useState(false);
    const [countdown, setCountdown] = useState<number | string | null>(null);
    const [captureTimeout, setCaptureTimeout] = useState<NodeJS.Timeout | null>(null);

    const isFaceAligned = (face: any) => {
        const { yawAngle, rollAngle } = face;
        const YAW_THRESHOLD = 10;
        const ROLL_THRESHOLD = 10;

        return Math.abs(yawAngle) <= YAW_THRESHOLD && Math.abs(rollAngle) <= ROLL_THRESHOLD;
    };

    const handleFacesDetected = ({ faces }: { faces: any[] }) => {
        if (faces.length === 1) {
            setMultipleFaces(false);

            const face = faces[0];

            if (isFaceAligned(face)) {
                if (!faceAligned) {
                    setFaceAligned(true);
                    startCountdown();
                }
            } else {
                resetCaptureState();
            }
        } else if (faces.length > 1) {
            setMultipleFaces(true);
            resetCaptureState();
        } else {
            setMultipleFaces(false);
            resetCaptureState();
        }
    };

    const startCountdown = () => {
        let counter = 3;
        setCountdown(counter);

        const interval = setInterval(() => {
            counter -= 1;
            if (counter > 0) {
                setCountdown(counter);
            } else {
                clearInterval(interval);
                setCountdown("Captured!");
                captureImage();
            }
        }, 1000);

        setCaptureTimeout(interval);
    };

    const resetCaptureState = () => {
        setFaceAligned(false);
        setCountdown(null);
        if (captureTimeout) {
            clearInterval(captureTimeout);
            setCaptureTimeout(null);
        }
    };

    const captureImage = async () => {
        if (cameraRef.current) {
            const options = { quality: 0.8 };
            const data = await cameraRef.current.takePictureAsync(options);
            setCapturedImage(data.uri);

            // Store the captured image and face data in AsyncStorage
            try {
                const result = await TFLiteModule.runModelOnImage(data.uri);
                console.log(result,'res0------->');
                await AsyncStorage.removeItem('faceData');
                await AsyncStorage.setItem('faceData', JSON.stringify(result));
                navigation.navigate('Login');
            } catch (error) {
                console.error('Error storing data', error);
            }
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.container}>
                <RNCamera
                    ref={cameraRef}
                    style={styles.camera}
                    type={RNCamera.Constants.Type.front}
                    onFacesDetected={handleFacesDetected}
                    faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
                    faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
                    faceDetectionClassifications={RNCamera.Constants.FaceDetection.Classifications.all}
                />

                {!faceAligned && !multipleFaces && <Text style={styles.alignText}>Align your face properly</Text>}
                {multipleFaces && <Text style={styles.alignText}>Only one face allowed!</Text>}
                {faceAligned && countdown !== null && (
                    <Text style={styles.countdownText}>{countdown}</Text>
                )}
                {/* {capturedImage && (
                    <Image source={{ uri: capturedImage }} style={styles.previewImage} />
                )} */}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    camera: { flex: 1 },
    alignText: {
        position: "absolute",
        top: 50,
        alignSelf: "center",
        color: "red",
        fontSize: 18,
        fontWeight: "bold",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        padding: 10,
        borderRadius: 5,
    },
    warningText: {
        position: "absolute",
        top: 50,
        alignSelf: "center",
        color: "red",
        fontSize: 20,
        fontWeight: "bold",
        backgroundColor: "rgba(255, 0, 0, 0.8)",
        padding: 10,
        borderRadius: 5,
    },
    countdownText: {
        position: "absolute",
        top: 50,
        alignSelf: "center",
        fontSize: 40,
        fontWeight: "bold",
        color: "white",
        backgroundColor: "rgba(0,0,0,0.7)",
        padding: 10,
        borderRadius: 5,
    },
    previewImage: {
        position: "absolute",
        top: 100,
        alignSelf: "center",
        width: 200,
        height: 200,
        borderRadius: 10,
    },
});