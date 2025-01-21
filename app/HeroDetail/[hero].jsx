import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'

const HeroDetail = () => {

  const navigation = useNavigation();
  const {hero} = useLocalSearchParams();

  useEffect(()=>{
    navigation.setOptions({
      headerShown:true,
      headerTitle:hero
    })
  },[])


  return (
    <View>
      <Text>Heello</Text>
    </View>
  )
}

export default HeroDetail;