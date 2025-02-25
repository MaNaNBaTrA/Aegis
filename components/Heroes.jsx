import { View, Text, FlatList, Image, TouchableOpacity, } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@configs/FirebaseConfig';
import { useRouter } from 'expo-router';

const Heroes = () => {

  const [HeroesList, setHeroesList] = useState([]);
  const router = useRouter();

  useEffect(() => {
    GetSlider();
  }, [])

  const GetSlider = async () => {
    setHeroesList([]);
    const q = query(collection(db, 'Heroes'));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      setHeroesList(prev => [...prev, doc.data()]);
    })
  }

  return (
    <View style={{
      marginTop: 8,
      paddingHorizontal: 16,
    }}>
      <Text style={{
        fontFamily: 'Montserrat-Bold',
        fontSize: 18,
        marginBottom: 10,
        color: '#000',
        zIndex: 1
      }}>
        Heroes
      </Text>
      <Image
        source={require('../assets/images/Bg1.png')}
        style={{
          position: 'absolute',
          height: 100,
          top: -65,
          resizeMode: 'cover',
        }} />

      <FlatList
        data={HeroesList}
        horizontal={true}
        style={{
          paddingLeft: 8,
        }}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/HeroDetail/${item.name.toUpperCase()}`)}>
            <Image
              source={{ uri: item.uri }}
              style={{
                borderRadius: 10,
                marginRight: 15,
                resizeMode: 'contain',
                width: 150,
                height: 300,
                zIndex: 1
              }}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  )
}

export default Heroes