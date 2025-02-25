import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ImageBackground, Dimensions} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig.js';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUser } from '@clerk/clerk-expo';
import LoadingScreen from '../../components/Loader'

const Heroes = () => {
  const router = useRouter();
  const [heroes, setHeroes] = useState([]);
  const [filteredHeroes, setFilteredHeroes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isLoaded } = useUser();
  const [imageLoadErrors, setImageLoadErrors] = useState({});

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
    let isMounted = true;

    const loadHeroes = async () => {
      try {
        await fetchHeroes();
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      }
    };

    loadHeroes();

    return () => {
      isMounted = false;
    };
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
  const numberOfImages = React.useMemo(() => Math.ceil(height / 50), [height]);

  const renderHeroName = (name) => {
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return (
        <Text
          style={{
            color: '#fff',
            fontSize: 25,
            fontFamily: 'Montserrat-ExtraBoldItalic',
            textAlign: 'center',
            lineHeight: 32,
            top: 14
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
              fontSize: 25,
              fontFamily: 'Montserrat-ExtraBoldItalic',
              textAlign: 'center',
              lineHeight: 28,
            }}
          >
            {nameParts[0]}
          </Text>
          <Text
            style={{
              color: '#fff',
              fontSize: 25,
              fontFamily: 'Montserrat-ExtraBoldItalic',
              textAlign: 'center',
              lineHeight: 28,
            }}
          >
            {nameParts[1]}
          </Text>
        </>
      );
    }
    return null; 
  };

  const handleImageError = (heroId) => {
    setImageLoadErrors(prev => ({
      ...prev,
      [heroId]: true
    }));
  };

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <>
      {(isLoading || !isLoaded) && <LoadingScreen />}
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
              fontFamily: 'Montserrat-Medium',
              fontSize: 14,
              color: '#444',
              marginTop: 8
            }}>
              {currentDate}
            </Text>

            <Text style={{
              fontFamily: 'Montserrat-SemiBold',
              fontSize: 32,
              color: '#000',
              marginTop: 3
            }}>
              Hey, {user?.firstName || 'User'}!
            </Text>

            <Image 
              source={require('../../assets/images/Marvel_Rival_Logo.png')} 
              style={{ alignSelf: 'center' }}
              defaultSource={require('../../assets/images/Marvel_Rival_Logo.png')}
            />
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 30,
              paddingHorizontal: 10,
              backgroundColor: '#FFF',
              marginTop: 10,
              marginHorizontal: 10
            }}>

              <TextInput
                placeholder="Search for heroes"
                value={searchQuery}
                onChangeText={handleSearch}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  paddingLeft: 10,
                  fontSize: 16,
                  color: '#000'
                }}
                placeholderTextColor="#999"
              />
              <Ionicons
                name="search"
                size={24}
                color="black"
                style={{ marginRight: 10 }}
              />
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 20
            }}>
              <TouchableOpacity onPress={() => handleFilterByType('')}>
                <Text style={{
                  color: selectedType === '' ? '#DC143C' : '#000',
                  fontSize: 14,
                  fontFamily: 'Montserrat-Medium'
                }}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFilterByType('Duelist')}>
                <Text style={{
                  color: selectedType === 'Duelist' ? '#DC143C' : '#000',
                  fontSize: 14,
                  fontFamily: 'Montserrat-Medium'
                }}>Duelist</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFilterByType('Strategist')}>
                <Text style={{
                  color: selectedType === 'Strategist' ? '#DC143C' : '#000',
                  fontSize: 14,
                  fontFamily: 'Montserrat-Medium'
                }}>Strategist</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleFilterByType('Vanguard')}>
                <Text style={{
                  color: selectedType === 'Vanguard' ? '#DC143C' : '#000',
                  fontSize: 14,
                  fontFamily: 'Montserrat-Medium'
                }}>Vanguard</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ padding: 10 }}>
            {filteredHeroes.map((hero) => (
              <TouchableOpacity
                key={hero.id}
                style={{
                  width: '100%',
                  padding: 10,
                  position: 'relative'
                }}
                onPress={() => router.push(`/HeroDetail/${hero.name}`)}
              >
                <Image
                  source={{ uri: hero.uri }}
                  style={{
                    width: '100%',
                    resizeMode: 'contain',
                    height: 90,
                    borderRadius: 200
                  }}
                  onError={() => handleImageError(hero.id)}
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
                    defaultSource={getTypeImage(hero.type)}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Heroes;