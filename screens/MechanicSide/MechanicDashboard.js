import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from '../../firebase';

const MechanicDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [mechanicProfile, setMechanicProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  // Fetch mechanic profile and messages
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        try {
          const docRef = doc(db, 'mechanics', userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setMechanicProfile(docSnap.data());
          } else {
            console.log('No such document!');
          }

          const messagesQuery = query(
            collection(db, 'messages'),
            where('mechanicId', '==', userId)
          );
          const messagesSnapshot = await getDocs(messagesQuery);
          const messagesData = messagesSnapshot.docs.map((doc) => doc.data());
          setMessages(messagesData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchData();
  }, [userId]);

  // Monitor authentication and fetch appointments
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchAppointments(currentUser.uid);
      } else {
        navigation.navigate('Login');
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch appointments with status "Accepted"
  const fetchAppointments = async (mechanicId) => {
    try {
      const appointmentQuery = query(
        collection(db, 'appointments'),
        where('mechanic_id', '==', mechanicId),
        where('status', '==', 'Accepted')
      );
      const snapshot = await getDocs(appointmentQuery);

      if (!snapshot.empty) {
        const fetchedAppointments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAppointments(fetchedAppointments);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      Alert.alert('Error', 'Could not fetch appointments. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  // Mark appointment as completed
  const markAppointmentAsCompleted = async (appointmentId) => {
    try {
      await updateDoc(doc(db, 'appointments', appointmentId), {
        status: 'Completed',
      });
      Alert.alert('Success', 'Appointment marked as completed.');
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment.id !== appointmentId)
      );
    } catch (error) {
      console.error('Error updating appointment status:', error);
      Alert.alert(
        'Error',
        'Unable to mark appointment as completed. Please try again.'
      );
    }
  };

  // Handle sign-out
  const handleSignOut = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              navigation.navigate('Login');
            } catch (error) {
              Alert.alert('Error', 'Unable to sign out. Please try again.');
              console.error('Sign out error:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleViewMessages = () => {
    navigation.navigate('Chat');
  };

  const handleUpdateProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.container}>
      {mechanicProfile && (
        <View style={styles.profileContainer}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out-outline" size={24} color="#333" />
          </TouchableOpacity>
          <Image
            source={require('../../assets/images/mech1.jpg')}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{mechanicProfile.name}</Text>
          <Text style={styles.profileSpecialty}>Professional</Text>
          <Text style={styles.profileRating}>Rating: ★★★★</Text>
          <TouchableOpacity
            onPress={handleUpdateProfile}
            style={styles.updateButton}
          >
            <Ionicons name="pencil" size={24} color="#fff" />
            <Text style={styles.updateButtonText}>Update Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Accepted Appointments</Text>
        <FlatList
          data={appointments}
          renderItem={({ item }) => (
            <View style={styles.appointmentItem}>
              <Text style={styles.appointmentText}>
                {item.user} - {item.date} at {item.time}
              </Text>
              <TouchableOpacity
                onPress={() => markAppointmentAsCompleted(item.id)}
                style={styles.completeButton}
              >
                <Text style={styles.completeButtonText}>Mark as Completed</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
          refreshing={refreshing}
          onRefresh={() => fetchAppointments(userId)}
        />

        <Text style={styles.sectionTitle}>Messages</Text>
        <TouchableOpacity
          onPress={handleViewMessages}
          style={styles.messagesButton}
        >
          <Ionicons name="chatbubbles" size={24} color="#075E54" />
          <Text style={styles.messagesButtonText}>View Messages</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
        flex: 1,
        backgroundColor: '#f4f7fa',
      },
      profileContainer: {
        marginTop: 30,
        marginHorizontal: 20,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 25,
        borderRadius: 15,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
      },
      signOutButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#e74c3c',
        padding: 8,
        borderRadius: 20,
      },
      profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#ddd',
      },
      profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
      },
      profileSpecialty: {
        fontSize: 16,
        color: '#777',
        marginBottom: 5,
      },
      profileRating: {
        fontSize: 16,
        color: '#f39c12',
        marginBottom: 15,
      },
      updateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#00796B',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 30,
        marginTop: 10,
      },
      updateButtonText: {
        color: '#fff',
        marginLeft: 10,
        fontWeight: 'bold',
        fontSize: 16,
      },
      body: {
        flex: 1,
        marginHorizontal: 20,
        marginBottom: 30,
      },
      sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        marginVertical: 15,
      },
      appointmentItem: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
      },
      appointmentText: {
        fontSize: 16,
        color: '#333',
      },
      messagesButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e8f7f0',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      messagesButtonText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#075E54',
        fontWeight: 'bold',
      },
  appointmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  appointmentText: {
    fontSize: 16,
    color: '#333',
  },
  completeButton: {
    backgroundColor: '#00796B',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MechanicDashboard;
