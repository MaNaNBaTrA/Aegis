import { View, Text, Image, ImageBackground } from 'react-native'
import React, { useEffect } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'

const HeroDetail = () => {


  const { hero } = useLocalSearchParams();



  return (
    <View style={{
      width: '100%',
      height: '100%',
      display: 'flex'
    }}>
      <View style={{
        display: 'flex',
        width: '100%',
        height: '50%',
        position: 'relative'
      }}>
        <ImageBackground
          source={require('../../assets/images/Home.png')} style={{
            width: '100%',
            height: '100%',
            zIndex: 0
          }}>
             <View style={{
              marginTop: '20%',
              display: 'flex',
              gap: 4,
              width:'50%',
              position: 'absolute',
              paddingLeft:20
            }}>
              <Text
                style={{
                  fontSize: 30,
                  fontFamily: 'Montserrat-ExtraBoldItalic',
                  lineHeight: 32,
                }}
              >
                ADAM
              </Text>
              <Text
                style={{
                  fontSize: 30,
                  fontFamily: 'Montserrat-ExtraBoldItalic',
                  textAlign: 'right',
                  lineHeight: 32,
                }}
              >
                WARLOCK
              </Text>
            </View>
          <ImageBackground
            source={require('../Demoassets/Adam_Warlock_Bg.png')}
            style={{
              width: '100%',
              height: '100%',
              zIndex: 1,
              display: 'flex',
              alignItems: 'flex-end'
            }}>
           
            <Image
              source={require('../Demoassets/Adam_Warlock.png')}
              resizeMode='cover'
              style={{
                width: 230,
                height: 440,
                marginRight: 30,
                zIndex: 1,
              }}
            />
          </ImageBackground>
        </ImageBackground>
        <Image
          source={require('../Demoassets/Bg_Component1.png')}
          style={{
            width: '100%',
            // backgroundColor:'#000',
            height: 60,
            position: 'absolute',
            bottom: -10
          }}
          resizeMode='contain'
        />

      </View>

    </View>
  )
}

export default HeroDetail;