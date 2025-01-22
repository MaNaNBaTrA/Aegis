import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ImageBackground, Dimensions, Button } from 'react-native';
import { collection, getDocs } from 'firebase/firestore'; 
import { db } from '../../configs/FirebaseConfig'; 
import { useRouter } from 'expo-router';

const Heroes = () => {
  const router = useRouter();
  const [heroes, setHeroes] = useState([]);
  const [filteredHeroes, setFilteredHeroes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const fetchHeroes = async () => {
    try {
      const heroesCollection = collection(db, 'Search');
      const querySnapshot = await getDocs(heroesCollection);
      const heroesList = [];
      querySnapshot.forEach((doc) => {
        heroesList.push({ id: doc.id, ...doc.data() });
      });
      setHeroes(heroesList);
      setFilteredHeroes(heroesList);
    } catch (error) {
      console.error('Error fetching heroes: ', error);
      setError('Failed to fetch heroes.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterHeroes(query, selectedType);
  };

  const handleFilterByType = (type) => {
    setSelectedType(type);
    filterHeroes(searchQuery, type);
  };

  const filterHeroes = (query, type) => {
    let filtered = heroes;

    if (query) {
      filtered = filtered.filter((hero) =>
        hero.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (type) {
      filtered = filtered.filter((hero) => hero.type === type);
    }

    setFilteredHeroes(filtered);
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  const getTypeImage = (type) => {
    switch (type) {
      case 'Duelist':
        return require('../../assets/images/Duelist.png');
      case 'Strategist':
        return require('../../assets/images/Strategist.png');
      case 'Vanguard':
        return require('../../assets/images/Vanguard.png');
      default:
        return null;
    }
  };

  const { height } = Dimensions.get('window'); 
  const numberOfImages = Math.ceil(height / 50);

  const renderHeroName = (name) => {
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return (
        <Text
          style={{
            color: '#fff',
            fontSize: 30,
            fontFamily: 'Monsterrat-ExtraBoldItalic',
            textAlign: 'center',
            lineHeight: 32,
            top:14
          }}
        >
          {name}
        </Text>
      );
    } else if (nameParts.length === 2) {
      return (
        <>
          <Text
            style={{
              color: '#fff',
              fontSize: 30,
              fontFamily: 'Monsterrat-ExtraBoldItalic',
              textAlign: 'center',
              lineHeight: 32,
            }}
          >
            {nameParts[0]}
          </Text>
          <Text
            style={{
              color: '#fff',
              fontSize: 30,
              fontFamily: 'Monsterrat-ExtraBoldItalic',
              textAlign: 'center',
              lineHeight: 32,
            }}
          >
            {nameParts[1]}
          </Text>
        </>
      );
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      <View style={{ flex: 1 }}>
        <View style={{ position: 'absolute', width: '100%', zIndex: 0 }}>
          {Array.from({ length: numberOfImages }).map((_, index) => (
            <ImageBackground
              key={index}
              source={require('../../assets/images/Home.png')}
              style={{
                width: '100%',
                height: 400,
              }}
              resizeMode="cover"
            />
          ))}
        </View>

        <View
          style={{
            width: '100%',
            backgroundColor: '#fece2f',
            borderBottomRightRadius: 50,
            padding: 16,
            paddingBottom: 18,
            zIndex: 1,
            borderBottomLeftRadius: 50,
            opacity: 0.95,
          }}
        >
          <Text style={{
            fontFamily: 'Monsterrat-Medium',
            fontSize: 14,
            color: '#444',
            marginTop: 8
          }}>
            {currentDate}
          </Text>

          <Text style={{
            fontFamily: 'Monsterrat-SemiBold',
            fontSize: 32,
            color: '#000',
            marginTop: 3
          }}>
            Hey, Manan!
          </Text>

          <Image source={require('../../assets/images/Marvel_Rival_Logo.png')} style={{ alignSelf: 'center' }} />

          <TextInput
            placeholder="Search for heroes"
            value={searchQuery}
            onChangeText={handleSearch}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              marginTop: 10,
              marginHorizontal: 10,
              borderRadius: 30,
              paddingLeft: 10,
              backgroundColor: '#FFF',
            }}
            placeholderTextColor={'#000'}
          />

          {/* Filter Buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
            <TouchableOpacity onPress={() => handleFilterByType('')}>
              <Text style={{ color: selectedType === '' ? '#000' : '#888' }}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilterByType('Duelist')}>
              <Text style={{ color: selectedType === 'Duelist' ? '#000' : '#888' }}>Duelist</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilterByType('Strategist')}>
              <Text style={{ color: selectedType === 'Strategist' ? '#000' : '#888' }}>Strategist</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilterByType('Vanguard')}>
              <Text style={{ color: selectedType === 'Vanguard' ? '#000' : '#888' }}>Vanguard</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ padding: 10 }}>
          {filteredHeroes.map((hero) => (
            <TouchableOpacity key={hero.id} style={{
              width: '100%',
              padding: 10,
              position: 'relative'
            }}>
              <Image
                source={{ uri: hero.uri }}
                style={{
                  width: '100%',
                  resizeMode: 'contain',
                  height: 100, 
                  borderRadius:200
                }}
              />

              <View
                style={{
                  position: 'absolute',
                  top: 30,
                  alignSelf: 'center',
                  width: '100%',
                }}
              >
                {renderHeroName(hero.name)}
                <Image
                  source={getTypeImage(hero.type)}
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: 7,
                    width: 40,
                    height: 40,
                  }}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default Heroes;
