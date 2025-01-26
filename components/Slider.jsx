import { View, Text, FlatList, Image,} from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, query, getDocs } from 'firebase/firestore'
import { db } from "../configs/FirebaseConfig"

const Slider = () => {

  const [SliderList, setSliderList] = useState([]);

  useEffect(() => {
    GetSlider();
  }, [])

  const GetSlider = async () => {
    setSliderList([]); 
    const q = query(collection(db, 'Slider'));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      setSliderList(prev => [...prev, doc.data()]); 
    })
  }

  return (
   
      <View style={{
        marginTop: 20,
        paddingHorizontal: 16,
      }}>
        <Text style={{
          fontFamily: 'Montserrat-Bold', 
          fontSize: 18,
          marginBottom: 15,
          color: '#000'
        }}>
          Marvel Rivals
        </Text>

        <FlatList
          data={SliderList}
          horizontal={true}
          style={{
            paddingLeft: 8,
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Image 
              source={{ uri: item.uri }} 
              style={{
                width: 300,
                height: 160,
                borderRadius: 10,
                marginRight: 15,
                resizeMode:'cover'
              }}
            />
          )}
          keyExtractor={(item, index) => index.toString()} 
        />
      </View>
  )
}

export default Slider;
