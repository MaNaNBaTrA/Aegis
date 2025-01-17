import { View, Text, FlatList, Image,} from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, query, getDocs } from 'firebase/firestore'
import { db } from "../configs/FirebaseConfig"

const Teams = () => {

     const [TeamsList, setTeamsList] = useState([]);
    
      useEffect(() => {
        GetSlider();
      }, [])
    
      const GetSlider = async () => {
        setTeamsList([]); 
        const q = query(collection(db, 'Team-Ups'));
        const querySnapshot = await getDocs(q);
    
        querySnapshot.forEach((doc) => {
          setTeamsList(prev => [...prev, doc.data()]); 
        })
      }

  return (
     <View style={{
            marginTop: 8,
            paddingHorizontal: 16,
          }}>
            <Text style={{
              fontFamily: 'Monsterrat-Bold', 
              fontSize: 18,
              marginBottom: 10,
              color: '#000',
              zIndex:1
            }}>
              Team-Ups
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
                      data={TeamsList}
                      horizontal={true}
                      style={{
                        paddingLeft: 8,
                      }}
                      showsHorizontalScrollIndicator={false}
                      renderItem={({ item }) => (
                        <Image 
                          source={{ uri: item.uri }} 
                          style={{
                            borderRadius: 10,
                            marginRight: 15,
                            resizeMode:'contain',
                            width:150,
                            height:300,
                            zIndex:1
                          }}
                        />
                      )}
                      keyExtractor={(item, index) => index.toString()} 
                    />
    </View>
  )
}

export default Teams;