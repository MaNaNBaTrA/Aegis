import React, { useEffect } from 'react';
import { Colors } from '@/constants/Colors';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import { Redirect, router } from 'expo-router';
import { Image, Text, View, TouchableOpacity } from 'react-native';
import Loader from '../components/Loader';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const AuthButton = ({ onPress, title, backgroundColor, textColor = 'black' }) => (
  <TouchableOpacity
    style={{
      backgroundColor,
      width: '90%',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      borderRadius: 20,
    }}
    onPress={onPress}
  >
    <Text
      style={{
        fontFamily: 'Montserrat-Medium',
        color: textColor,
      }}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

export default function Page() {
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    async function prepare() {
      try {
        if (isLoaded) {
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.error("Error during app loading:", error);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [isLoaded]);

  if (!isLoaded) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Loader/>
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/home" />;
  }

  return (
    <View style={{
      flex: 1,
    }}>
      <SignedIn>
        <Redirect href="/home" />
      </SignedIn>
      <SignedOut>
        <Image
          source={require('../assets/images/Main_BG.png')}
          resizeMode='contain'
          style={{
            width: '100%',
            height: '65%',
          }}
        />
        <View style={{
          width: '100%',
          height: '35%',
          alignItems: 'center',
          gap: 14,
          paddingTop: 20,
        }}>
          <View style={{
            width: '90%',
          }}>
            <Text style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: 36,
            }}>
              Let's
            </Text>
            <Text style={{
              fontFamily: 'Montserrat-Bold',
              fontSize: 36,
              lineHeight: 36,
            }}>
              get started
            </Text>
          </View>
          
          <View style={{
            width: '90%',
          }}>
            <Text style={{
              fontFamily: 'Montserrat-SemiBold',
              fontSize: 14,
            }}>
              Everything starts from here
            </Text>
          </View>

          <AuthButton
            title="Log In"
            backgroundColor={Colors.PRIMARY}
            onPress={() => router.push('/(auth)/sign-in')}
          />
          
          <AuthButton
            title="Sign up"
            backgroundColor="#000"
            textColor="white"
            onPress={() => router.push('/(auth)/sign-up')}
          />
        </View>
      </SignedOut>
    </View>
  );
}