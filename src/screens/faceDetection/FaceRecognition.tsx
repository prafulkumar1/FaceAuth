import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, NativeModules, Alert } from "react-native";
import { RNCamera } from "react-native-camera";
import AsyncStorage from '@react-native-async-storage/async-storage';
const { TFLiteModule } = NativeModules;
interface FaceDetectionProps {
    navigation: { navigate: (arg: string) => void };
}
export default function FaceDetection({ navigation }: FaceDetectionProps) {
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
                recFace();
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

    // Define a matching threshold (adjust as needed)
    const MATCH_THRESHOLD = 0.60;

    // Utility function to compute cosine similarity between two vectors
    const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
        const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
        const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
        const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
        return dotProduct / (magnitudeA * magnitudeB);
    };

    const recFace = async () => {
        if (cameraRef.current) {
            const options = { quality: 0.8 };
            const data = await cameraRef.current.takePictureAsync(options);
            console.log(data,'picture taken');
            
            setCapturedImage(data.uri);

            try {
                console.log('hlc captures');
                
                // Get the new face embedding using your TFLite module
                const newFaceEmbedding = await TFLiteModule.runModelOnImage(data.uri);
                console.log(newFaceEmbedding,"--->debug")
                // Retrieve the stored face embedding from AsyncStorage
                const faceDataRes = await AsyncStorage.getItem('faceData');
                if (faceDataRes) {
                    const storedEmbedding = JSON.parse(faceDataRes);

                    // Compute the cosine similarity between the stored and new embedding
                    const similarity = cosineSimilarity(storedEmbedding, newFaceEmbedding);
                    console.log("Face similarity:", similarity);

                    // If similarity exceeds the threshold, the faces match
                    if (similarity > MATCH_THRESHOLD) {
                        console.log("Face match found, navigating to Home.");
                        Alert.alert(
                            "Face match found",
                            "",
                            [
                                {
                                    text: "OK",
                                    onPress: () => navigation.navigate('Home')
                                }
                            ]
                        );
                    } else {
                        Alert.alert("Face does not match. Please try again.");
                    }
                } else {
                    Alert.alert("No stored face data found. Please register your face first.");
                }
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