import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
import { fetchUsersAndMechanics } from '../../firebase';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ChatScreen = () => {
  const [users, setUsers] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [selectedTab, setSelectedTab] = useState('users');
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchUsersAndMechanics();
      console.log('Fetched Users:', data.users);
      console.log('Fetched Mechanics:', data.mechanics);
      setUsers((data.users || []).filter((user) => user.name));
      setMechanics((data.mechanics || []).filter((mechanic) => mechanic.name));
    };

    loadData();
  }, []);

  const handleChatClick = (item) => {
    navigation.navigate('ChatDetail', { user: item });
  };

  const filteredContacts =
    selectedTab === 'users'
      ? users.filter((item) =>
          item.name?.toLowerCase().includes(searchText.toLowerCase())
        )
      : mechanics.filter((item) =>
          item.name?.toLowerCase().includes(searchText.toLowerCase())
        );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleChatClick(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.avatar || 'https://via.placeholder.com/150' }}
        style={styles.avatar}
      />
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name || 'Unnamed Contact'}</Text>
        <Text style={styles.lastMessage}>
          {item.lastMessage || 'Tap to start a conversation'}
        </Text>
      </View>
      <Ionicons
        name="chatbubble-ellipses-outline"
        size={24}
        color="#075E54"
        style={styles.chatIcon}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      
      <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#777" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'users' && styles.activeTab,
          ]}
          onPress={() => setSelectedTab('users')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'users' && styles.activeTabText,
            ]}
          >
            Users
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            selectedTab === 'mechanics' && styles.activeTab,
          ]}
          onPress={() => setSelectedTab('mechanics')}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === 'mechanics' && styles.activeTabText,
            ]}
          >
            Mechanics
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredContacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.email || item.id || Math.random().toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 5,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#00796B',
  },
  tabText: {
    fontSize: 16,
    color: '#777',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  lastMessage: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  chatIcon: {
    marginLeft: 10,
  },
});

export default ChatScreen;


