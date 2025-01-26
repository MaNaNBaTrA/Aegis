import { View, Text, Image } from 'react-native'
import React from 'react'

const Updates = () => {
  return (
    <View style={{
      marginTop: 20,
      paddingHorizontal: 18,
      position:'relative'
    }}>
      <Text style={{
        fontFamily: 'Montserrat-Bold',
        fontSize: 18,
        marginBottom: 15,
        color: '#000',
        zIndex:2
      }}>
        Updates
      </Text>
      <Image source={require('../assets/images/Home2.png')}
        style={{
          width: '100%',
          resizeMode: 'contain',
          height:220,
        }}
      />
      <Image
        source={require('../assets/images/Bg1.png')}
        style={{
          position: 'absolute',
          height: 100,
          top: -65,
          resizeMode: 'cover',
          zIndex:1
        }} />

    </View>

  )
}

export default Updates;