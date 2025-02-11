import { View, Text, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import Slider from '../../components/Slider';
import Updates from '../../components/Updates';
import Heroes from '../../components/Heroes';
import Teams from '../../components/Teams';
import Footer from '../../components/Footer';
import { collection, getDocs } from 'firebase/firestore';
import { db } from "../../configs/FirebaseConfig";
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';

const LoadingScreen = () => (
  <View style={{ 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999
  }}>
    <LottieView
      source={require('../../assets/Loader/Loader.json')} 
      autoPlay
      loop
      style={{ width: 200, height: 200 }}
      renderMode="AUTOMATIC"
      resizeMode="contain"
    />
  </View>
);

const Home = () => {
  const router = useRouter();
  const [quote, setQuote] = useState('');
  const [hero, setHero] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoaded } = useUser();

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const fetchRandomQuote = async () => {
    try {
      const quotesCollection = collection(db, 'Quotes');
      const querySnapshot = await getDocs(quotesCollection);
      const quotesList = [];
      
      querySnapshot.forEach((doc) => {
        quotesList.push(doc.data());
      });

      const randomQuote = quotesList[Math.floor(Math.random() * quotesList.length)];
      setQuote(randomQuote.Quote);
      setHero(randomQuote.name);
    } catch (error) {
      console.error("Error fetching quotes: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomQuote();
    const interval = setInterval(fetchRandomQuote, 3600000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {(isLoading || !isLoaded) && <LoadingScreen />}
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <ImageBackground
          source={require('../../assets/images/Home.png')}
          style={{
            flex: 1,
            resizeMode: 'cover',
          }}
        >
          <View style={{ flex: 1, position: 'relative' }}>
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
                  fontFamily: 'Montserrat-Medium',
                  fontSize: 14,
                  color: '#444',
                  marginTop: 8,
                }}
              >
                {currentDate}
              </Text>

              <Text
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 32,
                  color: '#000',
                  marginTop: 3,
                }}
              >
                Hey, {user.firstName}!
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
                    fontFamily: 'Montserrat-Bold',
                    fontSize: 40,
                    position: 'absolute',
                    left: 0,
                    top: 18,
                    zIndex: 1,
                    right: 2
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
                    zIndex: 20
                  }}
                  onPress={() => { router.push('/heroes') }}
                  hitSlop={{ top: 10, bottom: 20, left: 10, right: 10 }}
                >
                  <Text
                    style={{
                      fontFamily: 'Montserrat-semiBold',
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
                  fontFamily: 'Montserrat-Medium',
                  fontSize: 18,
                  marginTop: 14,
                }}
              >
                {quote}
              </Text>

              <Text
                style={{
                  fontFamily: 'Montserrat-Bold',
                  fontSize: 20,
                  color: '#000',
                  marginTop: 3,
                  textAlign: 'right',
                }}
              >
                ⁓ {hero}
              </Text>
            </View>
            <Slider />
            <Updates />
            <Heroes />
            <Teams />
            <Footer />
            </View>
        </ImageBackground>
      </ScrollView>
    </>
  );
};

export default Home;
