import { useFonts } from "expo-font";
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { tokenCache } from '@/cache';
import { Slot } from 'expo-router';
import Loader from '../components/Loader';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';



SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
    );
  }

  const [fontsLoaded, fontError] = useFonts({
    "Montserrat-Bold": require("../assets/fonts/Montserrat/Montserrat-Bold.ttf"),
    "Montserrat-ExtraBold": require("../assets/fonts/Montserrat/Montserrat-ExtraBold.ttf"),
    "Montserrat-Light": require("../assets/fonts/Montserrat/Montserrat-Light.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat/Montserrat-Medium.ttf"),
    "Montserrat-Regular": require("../assets/fonts/Montserrat/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat/Montserrat-SemiBold.ttf"),
    "Montserrat-BoldItalic": require("../assets/fonts/Montserrat/Montserrat-BoldItalic.ttf"),
    "Montserrat-ExtraBoldItalic": require("../assets/fonts/Montserrat/Montserrat-ExtraBoldItalic.ttf"),
    "Montserrat-SemiBoldItalic": require("../assets/fonts/Montserrat/Montserrat-SemiBoldItalic.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        if (fontError) {
          console.warn("Font loading error:", fontError);
        }
        
        if (fontsLoaded || fontError) {
          setAppIsReady(true);
          
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        console.warn("Error preparing app:", e);
        setAppIsReady(true);
      }
    }

    prepare();
  }, [fontsLoaded, fontError]);


  if (!appIsReady) {
    return <Loader />;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <Slot />
      </ClerkLoaded>
    </ClerkProvider>
  );
}