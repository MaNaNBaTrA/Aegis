import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';  
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';

const Heroes = () => {
  const router = useRouter();  // Initialize the router
  const [heroes, setHeroes] = useState([]);
  const [filteredHeroes, setFilteredHeroes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetching heroes from Firebase
  const fetchHeroes = async () => {
    try {
      const heroesCollection = collection(db, 'Heroes');
      const querySnapshot = await getDocs(heroesCollection);
      const heroesList = [];
      querySnapshot.forEach((doc) => {
        heroesList.push({ id: doc.id, ...doc.data() });
      });
      setHeroes(heroesList);
      setFilteredHeroes(heroesList);
    } catch (error) {
      console.error('Error fetching heroes: ', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = heroes.filter((hero) =>
        hero.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredHeroes(filtered);
    } else {
      setFilteredHeroes(heroes);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  const navigateToHeroDetail = (hero) => {
    // Ensuring hero detail is passed as a query parameter
    router.push(`/heroDetail?heroId=${hero.id}`);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          borderRadius: 5,
          marginBottom: 16,
        }}
        placeholder="Search for heroes"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredHeroes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              padding: 12,
              marginBottom: 10,
              backgroundColor: '#f8f8f8',
              borderRadius: 10,
              alignItems: 'center',
            }}
            onPress={() => navigateToHeroDetail(item)}
          >
            <Image
              source={{ uri: item.uri }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 12,
              }}
            />
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Heroes;
