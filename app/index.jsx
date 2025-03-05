import React from 'react';
import { Colors } from '@/constants/Colors';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-expo';
import { Redirect, router } from 'expo-router';
import { Image, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import Loader from '../components/Loader';

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

  if (!isLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <Loader />
      </View>
    );
  }

  if (isSignedIn) {
    return <Redirect href="/home" />;
  }

  return (
    <View style={styles.container}>
      <SignedIn>
        <Redirect href="/home" />
      </SignedIn>
      
      <SignedOut>
        <Image
          source={require('../assets/images/Main_BG.png')}
          resizeMode='contain'
          style={styles.backgroundImage}
        />
        
        <View style={styles.contentContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.titleText}>
              Let's
            </Text>
            <Text style={[styles.titleText, { lineHeight: 36 }]}>
              get started
            </Text>
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.subtitleText}>
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

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    width: '100%',
    height: '65%',
  },
  contentContainer: {
    width: '100%',
    height: '35%',
    alignItems: 'center',
    gap: 14,
    paddingTop: 20,
  },
  textContainer: {
    width: '90%',
  },
  titleText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 36,
  },
  subtitleText: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 14,
  },
});