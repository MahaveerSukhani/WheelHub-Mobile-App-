import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { sendMessage } from '../../firebase';
import moment from 'moment'; 

const ChatDetailScreen = ({ route }) => {
  const { user } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'messages'),
        where('senderEmail', 'in', [auth.currentUser?.email, user.email]),
        where('recipientEmail', 'in', [auth.currentUser?.email, user.email]),
        orderBy('timestamp', 'asc')
      ),
      (snapshot) => {
        const fetchedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(fetchedMessages);
        setLoading(false); 
      },
      (err) => {
        setError('Failed to load messages. Please try again later.');
        console.error(err);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleSendMessage = async () => {
    if (messageText.trim()) {
      try {
        const senderEmail = auth.currentUser?.email;
        if (senderEmail) {
          await sendMessage(messageText, senderEmail, user.email);
          setMessageText('');
        }
      } catch (err) {
        setError('Failed to send message. Please try again.');
        console.error(err);
      }
    }
  };

  const handleTyping = (text) => {
    setMessageText(text);
    setIsTyping(text.trim().length > 0);
  };

  const renderMessageItem = ({ item }) => {
    const isSentByCurrentUser = item.senderEmail === auth.currentUser?.email;

    return (
      <View
        style={[
          styles.messageContainer,
          isSentByCurrentUser ? styles.messageSent : styles.messageReceived,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>
          {moment(item.timestamp?.toDate()).format('h:mm A')}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{user.name}</Text>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
        ListEmptyComponent={() =>
          !loading && <Text style={styles.emptyText}>No messages yet. Start the conversation!</Text>
        }
      />
      {loading && <ActivityIndicator size="large" color="#075E54" style={styles.loader} />}
      {isTyping && <Text style={styles.typingText}>Typing...</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          value={messageText}
          onChangeText={handleTyping}
          placeholder="Type your message..."
          placeholderTextColor="#888"
          style={styles.input}
        />
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA', 
  },
  header: {
    height: 90,
    backgroundColor: '#075E54', 
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backIcon: {
    marginRight: 15,
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  chatContainer: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messageContainer: {
    maxWidth: '75%',
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'relative',
  },
  messageSent: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
  },
  messageReceived: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 10,
    elevation: 4,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#075E54',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
    fontSize: 16,
  },
  typingText: {
    textAlign: 'center',
    color: '#075E54',
    marginBottom: 5,
    fontSize: 14,
  },
  loader: {
    marginVertical: 20,
  },
});

export default ChatDetailScreen;


