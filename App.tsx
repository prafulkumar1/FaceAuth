import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import StackNavigations from './src/navigation/StackNavigations'

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigations />
    </NavigationContainer>
  )
}