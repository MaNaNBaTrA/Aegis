import { View, Text, FlatList, Image } from 'react-native'
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
      // console.log(doc.data());
      setSliderList(prev => [...prev, doc.data()]);
    })
  }
  return (
    <View style={{
      marginTop:16,
      paddingHorizontal:16
    }}>
      <Text style={{
        fontFamily:'Monsterrat-SemiBold',
        fontSize:18,
        marginBottom:10
      }}>Marvel Rivals</Text>

      <FlatList
      data={SliderList}
      horizontal={true}
      style={{
        paddingLeft:8
      }}
      showsHorizontalScrollIndicator={false}
      renderItem={({item,index})=>(
        <Image source={{uri:item.uri}}
        style={{
          width:300,
          height:160,
          borderRadius:10,
          marginRight:15
        }}
        />
      )}
      />
    </View>
  )
}

export default Slider