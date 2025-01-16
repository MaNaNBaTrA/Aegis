import { View, Text, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import React from 'react';
import Slider from '../../components/Slider';
import Updates from '../../components/Updates';

const Home = () => {
  return (
    <ScrollView>
      <ImageBackground
        source={require('../../assets/images/Home.png')}
        style={{
          flex: 1,
          resizeMode: 'cover',
        }}
      >
        <View
          style={{
            flex: 1,
            position: 'relative',
          }}
        >
          <View
            style={{
              width: '100%',
              backgroundColor: '#fece2f',
              borderBottomRightRadius: 50,
              padding: 16,
              paddingBottom: 18,
              zIndex: 10,
            }}
          >
            <Text
              style={{
                fontFamily: 'Monsterrat-Medium',
                fontSize: 14,
                color: '#444',
                marginTop: 8,
              }}
            >
              8 Dec 2025
            </Text>

            <Text
              style={{
                fontFamily: 'Monsterrat-SemiBold',
                fontSize: 32,
                color: '#000',
                marginTop: 3,
              }}
            >
              Hey, Manan!
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                marginTop: 3,
                position: 'relative',
              }}
            >
              <Text
                style={{
                  fontFamily: 'Monsterrat-Bold',
                  fontSize: 40,
                  position: 'absolute',
                  left: 0,
                  top: 18,
                }}
              >
                “
              </Text>

              <TouchableOpacity
                style={{
                  backgroundColor: '#000',
                  borderRadius: 25,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Monsterrat-SemiBold',
                    fontSize: 16,
                    color: '#FFF',
                    textAlign: 'center',
                  }}
                >
                  Choose a Hero
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              style={{
                fontFamily: 'Monsterrat-Medium',
                fontSize: 18,
                marginTop: 14,
              }}
            >
              I choose to run toward my problems, and not away from them.
            </Text>

            <Text
              style={{
                fontFamily: 'Monsterrat-Bold',
                fontSize: 20,
                color: '#000',
                marginTop: 3,
                textAlign: 'right',
              }}
            >
              ⁓ Thor
            </Text>
          </View>
          <Slider />
          <Updates />
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

export default Home;
