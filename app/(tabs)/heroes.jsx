import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';  
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';

const Heroes = () => {
  const router = useRouter();
  const [heroes, setHeroes] = useState([]);
  const [filteredHeroes, setFilteredHeroes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError('Failed to fetch heroes.');
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading heroes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for heroes"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filteredHeroes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.heroItem}
            onPress={() => router.push(`../HeroDetail/${item.name}`)}
          >
            <Image
              source={{ uri: item.uri || 'https://via.placeholder.com/50' }}
              style={styles.heroImage}
            />
            <Text style={styles.heroName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No heroes found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 5,
    marginBottom: 16,
  },
  heroItem: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    alignItems: 'center',
  },
  heroImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  heroName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Heroes;
