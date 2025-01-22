import { Stack } from "expo-router";
import {useFonts} from "expo-font"

export default function RootLayout() 
{

  useFonts({
    'Monsterrat-Bold':require('../assets/fonts/Monserrat/Montserrat-Bold.ttf'),
    'Monsterrat-ExtraBold':require('../assets/fonts/Monserrat/Montserrat-ExtraBold.ttf'),
    'Monsterrat-Light':require('../assets/fonts/Monserrat/Montserrat-Light.ttf'),
    'Monsterrat-Medium':require('../assets/fonts/Monserrat/Montserrat-Medium.ttf'),
    'Monsterrat-Regular':require('../assets/fonts/Monserrat/Montserrat-Regular.ttf'),
    'Monsterrat-SemiBold':require('../assets/fonts/Monserrat/Montserrat-SemiBold.ttf'),
    'Monsterrat-BoldItalic':require('../assets/fonts/Monserrat/Montserrat-BoldItalic.ttf'),
    'Monsterrat-ExtraBoldItalic':require('../assets/fonts/Monserrat/Montserrat-ExtraBoldItalic.ttf'),
    'Monsterrat-SemiBoldItalic':require('../assets/fonts/Monserrat/Montserrat-SemiBoldItalic.ttf')
  })
  
  return <Stack screenOptions={{
    headerShown:false
  }}/>;
}
