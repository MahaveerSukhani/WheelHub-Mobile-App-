import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { firestore } from '../../firebase';  
import { collection, query, where, getDocs } from 'firebase/firestore';

const ChatListScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const userEmail = "user@example.com";  
  const mechanicEmail = "mechanic@example.com";  

  useEffect(() => {
    const fetchChats = async () => {
      const chatRef = collection(firestore, 'chats');
      const q = query(chatRef, where('userEmail', '==', userEmail), where('mechanicEmail', '==', mechanicEmail));
      const snapshot = await getDocs(q);
      const chatsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChats(chatsData);
    };

    fetchChats();
  }, [userEmail, mechanicEmail]);

  const openChat = (chatId) => {
    navigation.navigate('ChatScreen', { chatId });
  };

  return (
    <View>
      <Text>HEllo</Text>
      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openChat(item.id)}>
            <Text>{item.userEmail} - {item.mechanicEmail}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ChatListScreen;




