import { View, Text, Image, ImageBackground, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';

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
            width: '50%',
            position: 'absolute'
          }}>
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end',
              gap: 12,
              marginBottom: 24,
              paddingLeft: 20,
            }}>
              <Image
                source={require('../../assets/images/Strategist.png')} />
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: 'Montserrat-ExtraBoldItalic',
                  textAlign: 'center'
                }}
              >STRATEGIST</Text>
            </View>
            <Text
              style={{
                fontSize: 30,
                fontFamily: 'Montserrat-ExtraBoldItalic',
                lineHeight: 32,
                zIndex: 2,
                paddingLeft: 20,
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
                zIndex: 2,
                paddingLeft: 20,
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
                height: '95%',
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
            height: 60,
            position: 'absolute',
            bottom: -10,
          }}
          resizeMode='contain'
        />
      </View>
      <ImageBackground
        source={require('../Demoassets/Abilities_Bg.jpg')} style={{
          width: '100%',
          zIndex: 0,
          height: '100%'
        }}
        resizeMode='stretch'>
        <View
          style={{
            display: 'flex',
            gap: 8,
            marginTop: 6
          }}
        >
          <Text style={{
            fontSize: 30,
            fontFamily: 'Montserrat-ExtraBoldItalic',
            zIndex: 2,
            alignSelf: 'flex-start',
            color: Colors.ABILITIESBG,
            marginLeft: 8
          }}>ABILITIES</Text>
          <ScrollView>
            <View style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <View
                style={{
                  width: '90%',
                  zIndex: 2,
                  backgroundColor: Colors.ABILITIESBG
                }}
              >
                <Text
                  style={{
                    backgroundColor: Colors.ABILITIESTYPE,
                    fontFamily: "Montserrat-SemiBold",
                    paddingLeft: 8,
                    fontSize: 14,
                    paddingVertical: 4
                  }}
                >NORMAL ATTACK</Text>
                <View style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  paddingHorizontal:8
                }}>
                  <Image
                    source={require('../Demoassets/Left_Mouse.png')}

                  />

                  <View style={{
                    width: 1,
                    height: '100%',
                    backgroundColor: 'black',
                    marginHorizontal: 10,
                  }} />

                  <Image
                    source={require('../Demoassets/NATTACK.png')}
                  />

                  <View style={{
                    width: 1,
                    height:'100%',
                    backgroundColor: 'black',
                    marginHorizontal: 10,
                  }} />

                  <Text style={{
                    fontFamily: "Montserrat-SemiBold",
                  }}>QUANTUM MAGIC</Text>
                </View>

              </View>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  )
}

export default HeroDetail;