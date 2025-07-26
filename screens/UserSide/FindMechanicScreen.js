import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

const FindMechanicScreen = ({ navigation }) => {
  const [mechanicsData, setMechanicsData] = useState([]);
  const [filteredMechanics, setFilteredMechanics] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'mechanics'));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMechanicsData(data);
        setFilteredMechanics(data);
      } catch (error) {
        console.error('Error fetching mechanics data:', error);
      }
    };
    fetchMechanics();
  }, []);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(new Set(JSON.parse(storedFavorites)));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = mechanicsData.filter((mechanic) =>
        mechanic.mechanicName && mechanic.mechanicName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMechanics(filtered);
    } else {
      setFilteredMechanics(mechanicsData);
    }
  }, [searchQuery, mechanicsData]);


  const toggleFavorite = async (mechanicId) => {
    const updatedFavorites = new Set(favorites);
    if (updatedFavorites.has(mechanicId)) {
      updatedFavorites.delete(mechanicId);
    } else {
      updatedFavorites.add(mechanicId);
    }
    setFavorites(updatedFavorites);
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(Array.from(updatedFavorites)));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const handleBookNow = (mechanic) => {
    navigation.navigate('Appointment', {
      mechanicId: mechanic.id,
      mechanicName: mechanic.name,
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleMechanicPress = (mechanic) => {
    navigation.navigate('MechanicDetails', { mechanicData: mechanic });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#777" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.ok}>
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          {filteredMechanics.length === 0 ? (
            <Text style={styles.noDataText}>No mechanics found</Text>
          ) : (
            filteredMechanics.map((mechanic) => (
              <View key={mechanic.id} style={styles.card}>
                <Image source={{ uri: mechanic.image || 'https://via.placeholder.com/150' }} style={styles.image} />
                <View style={styles.info}>
                  <Text style={styles.name}>{mechanic.name}</Text>
                  <Text style={styles.specialization}>{mechanic.specialization || 'General Repairs'}</Text>
                  {/* <Text style={styles.availability}>{mechanic.phoneNumber}</Text> */}
                  <Text style={styles.availability}>{mechanic.workingHoursFrom} - {mechanic.workingHoursTo}</Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.bookButton} onPress={() => handleBookNow(mechanic)}>
                    <Text style={styles.bookText}>Book Now</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.detailsButton} onPress={() => handleMechanicPress(mechanic)}>
                    <Text style={styles.detailsText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    margin: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  ok: {
    margin: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    flexDirection: 'row',
    elevation: 3,
    alignItems: 'center',
  },
  image: {
    width: 90,
    height: '100%',
    borderRadius: 5,
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  specialization: {
    fontSize: 15,
    color: '#666',
    marginVertical: 6,
  },
  availability: {
    fontSize: 14,
    color: '#00796B',
  },
  actions: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  favoriteButton: {
    marginBottom: 12,
  },
  bookButton: {
    backgroundColor: '#00796B',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  bookText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  detailsButton: {
    marginTop: 12,
  },
  detailsText: {
    color: '#00796B',
    fontSize: 14,
  },
  noDataText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 50,
    fontSize: 16,
  },
});

export default FindMechanicScreen;
