import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { STRINGS } from './strings'
import { requestMultiplePermissions, startBackgroundJob, stopBackgroundJob } from '../../utils/LiveLocationTracking';

export default function Home() {
  const [playing, setPlaying] = useState(false);

  const toggleBackground = async () => {
    setPlaying(!playing);

    if (!playing) {
      await startBackgroundJob();
    } else {
      await stopBackgroundJob();
    }
  };
  const checkPermissions = async () => {
    Alert.alert('Checking permissions')
    const result = await requestMultiplePermissions()
    console.log('Permissions result:', result)
    if (result) {
      toggleBackground()
    }
  }
  useEffect(() => {
    checkPermissions();
  }, [])
  return (
    <View>
      <Text style={{ color: "black" }}>{STRINGS.HOME_TEXT}</Text>
    </View>
  )
}