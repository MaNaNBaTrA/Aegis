import { useFonts } from "expo-font";
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { tokenCache } from '@/cache';
import { Slot } from 'expo-router';
import Loader from '../components/Loader'; 

export default function RootLayout() {


  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
    )
  }

  const [fontsLoaded] = useFonts({
    "Montserrat-Bold": require("../assets/fonts/Monserrat/Montserrat-Bold.ttf"),
    "Montserrat-ExtraBold": require("../assets/fonts/Monserrat/Montserrat-ExtraBold.ttf"),
    "Montserrat-Light": require("../assets/fonts/Monserrat/Montserrat-Light.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Monserrat/Montserrat-Medium.ttf"),
    "Montserrat-Regular": require("../assets/fonts/Monserrat/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Monserrat/Montserrat-SemiBold.ttf"),
    "Montserrat-BoldItalic": require("../assets/fonts/Monserrat/Montserrat-BoldItalic.ttf"),
    "Montserrat-ExtraBoldItalic": require("../assets/fonts/Monserrat/Montserrat-ExtraBoldItalic.ttf"),
    "Montserrat-SemiBoldItalic": require("../assets/fonts/Monserrat/Montserrat-SemiBoldItalic.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <Loader/>
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <Slot />
      </ClerkLoaded>
    </ClerkProvider>
  );
}
