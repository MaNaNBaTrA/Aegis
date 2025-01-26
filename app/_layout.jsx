import { Stack } from "expo-router";
import {useFonts} from "expo-font"

export default function RootLayout() 
{

  useFonts({
    'Montserrat-Bold':require('../assets/fonts/Monserrat/Montserrat-Bold.ttf'),
    'Montserrat-ExtraBold':require('../assets/fonts/Monserrat/Montserrat-ExtraBold.ttf'),
    'Montserrat-Light':require('../assets/fonts/Monserrat/Montserrat-Light.ttf'),
    'Montserrat-Medium':require('../assets/fonts/Monserrat/Montserrat-Medium.ttf'),
    'Montserrat-Regular':require('../assets/fonts/Monserrat/Montserrat-Regular.ttf'),
    'Montserrat-SemiBold':require('../assets/fonts/Monserrat/Montserrat-SemiBold.ttf'),
    'Montserrat-BoldItalic':require('../assets/fonts/Monserrat/Montserrat-BoldItalic.ttf'),
    'Montserrat-ExtraBoldItalic':require('../assets/fonts/Monserrat/Montserrat-ExtraBoldItalic.ttf'),
    'Montserrat-SemiBoldItalic':require('../assets/fonts/Monserrat/Montserrat-SemiBoldItalic.ttf')
  })
  
  return <Stack screenOptions={{
    headerShown:false
  }}/>;
}
