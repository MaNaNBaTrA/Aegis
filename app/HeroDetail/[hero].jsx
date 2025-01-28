import { View, Text, Image, ImageBackground, ScrollView, TouchableOpacity,ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Colors } from '../../constants/Colors';

const renderShortcut = (shortcut) => {
  if (shortcut === 'PASSIVE') {
    return (
      <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 13 }}>PASSIVE</Text>
    );
  } else if (typeof shortcut === 'string' && shortcut.includes('.')) {
    return <Image source={{ uri: shortcut }} style={{ width: 24, height: 24 }} />;
  } else if (typeof shortcut === 'number') {
    return <Image source={shortcut} />;
  } else {
    return <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 16 }}>{shortcut}</Text>;
  }
};

const AbilitiesSection = ({ sectionTitle, data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View style={{ width: '90%', zIndex: 2, backgroundColor: Colors.ABILITIESBG }}>
      <Text
        style={{
          backgroundColor: Colors.ABILITIESTYPE,
          fontFamily: 'Montserrat-SemiBold',
          paddingLeft: 8,
          fontSize: 14,
          paddingVertical: 4,
        }}
      >
        {sectionTitle}
      </Text>

      {data.map((item, index) => (
        <TouchableOpacity key={index}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 8,
              borderBottomWidth: index < data.length - 1 ? 1 : 0,
              borderBottomColor: Colors.ABILITIES
            }}
          >
            <View style={{ width: '15%', alignItems: 'center' }}>
              {renderShortcut(item.Key)}
            </View>

            <View style={{ width: 1, height: '80%', backgroundColor: Colors.ABILITIES, marginHorizontal: 10 }} />

            <View style={{ width: '40%', alignItems: 'center' }}>
              <Image source={{ uri: item.Image }} style={{
                width: 200,
                height: 50
              }}
                resizeMode='contain'
              />
            </View>

            <View style={{ width: 1, height: '80%', backgroundColor: Colors.ABILITIES, marginHorizontal: 10 }} />

            <View style={{ width: '35%', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Montserrat-SemiBold', textAlign: 'center' }}>{item.Attack_Name}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const HeroDetail = () => {
  const { hero } = useLocalSearchParams();
  const [heroDetails, setHeroDetails] = useState(null);
  const [loading, setLoading] = useState(true);  
  const [noData, setNoData] = useState(false); 

  useEffect(() => {
    const fetchHeroDetails = async () => {
      const db = getFirestore();
      const abilitiesRef = collection(db, 'Abilities');
      const q = query(abilitiesRef, where('name', '==', hero));

      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0].data();
          setHeroDetails(docData);
          setNoData(false); 
        } else {
          setNoData(true); 
        }
      } catch (error) {
        console.error("Error getting documents: ", error);
        setNoData(true); 
      } finally {
        setLoading(false);
      }
    };

    fetchHeroDetails();
  }, [hero]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.ABILITIESBG} />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (noData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No Data Found</Text>
      </View>
    );
  }

  const { Normal_Attack, ABILITIES, 'TEAM-UP ABILITIES': TEAM_UP_ABILITIES } = heroDetails;


  return (
    <View style={{ width: '100%', height: '100%', display: 'flex' }}>
      <View style={{ display: 'flex', width: '100%', height: '50%', position: 'relative' }}>
        <ImageBackground
          source={{ uri: heroDetails.Character_Bg }}
          style={{ width: '100%', height: '100%', zIndex: 0 }}
        >
          <View style={{ marginTop: '20%', display: 'flex', gap: 4, width: '50%', position: 'absolute' }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginBottom: 24, paddingLeft: 20 }}>
              <Image source={{ uri: heroDetails.Character }} />
              <Text style={{ fontSize: 24, fontFamily: 'Montserrat-ExtraBoldItalic', textAlign: 'center' }}>
                {heroDetails.type}
              </Text>
            </View>
            <Text style={{ fontSize: 30, fontFamily: 'Montserrat-ExtraBoldItalic', lineHeight: 32, zIndex: 2, paddingLeft: 20 }}>
              {heroDetails.name}
            </Text>
          </View>
          <ImageBackground
            source={{ uri: heroDetails.Character_Bg }}
            style={{ width: '100%', height: '100%', zIndex: 1, display: 'flex', alignItems: 'flex-end' }}
          >
            <Image
              source={{ uri: heroDetails.Character }}
              resizeMode="cover"
              style={{ width: 230, height: '95%', marginRight: 30, zIndex: 1 }}
            />
          </ImageBackground>
        </ImageBackground>
      </View>
      <ImageBackground
        source={require('../Demoassets/Abilities_Bg.jpg')}
        style={{ width: '100%', zIndex: 0, height: '100%', flex: 1 }}
        resizeMode="stretch"
      >
        <View style={{ display: 'flex', gap: 8, marginTop: 6, flex: 1 }}>
          <Text
            style={{
              fontSize: 30,
              fontFamily: 'Montserrat-ExtraBoldItalic',
              zIndex: 2,
              alignSelf: 'flex-start',
              color: Colors.ABILITIESBG,
              marginLeft: 8,
            }}
          >
            ABILITIES
          </Text>

          <ScrollView>
            <View style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8 }}>
              <AbilitiesSection sectionTitle="NORMAL ATTACK" data={Normal_Attack} />
              <AbilitiesSection sectionTitle="ABILITIES" data={ABILITIES} />
              <AbilitiesSection sectionTitle="TEAM-UP ABILITIES" data={TEAM_UP_ABILITIES} />
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
};

export default HeroDetail;
