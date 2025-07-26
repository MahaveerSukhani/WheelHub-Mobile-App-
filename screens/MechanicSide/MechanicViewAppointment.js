import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Icon from 'react-native-vector-icons/MaterialIcons'; 

const MechanicViewAppointment = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadNotifications, setUnreadNotifications] = useState(false); 
  const [refreshing, setRefreshing] = useState(false);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchAppointments(currentUser.uid);
        checkForUnreadNotifications(currentUser.uid);
      } else {
        navigation.navigate('Login');
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchAppointments = async (mechanicId) => {
    setLoading(true);
    try {
      const appointmentQuery = query(
        collection(db, 'appointments'),
        where('mechanic_id', '==', mechanicId)
      );
      const snapshot = await getDocs(appointmentQuery);

      if (!snapshot.empty) {
        const fetchedAppointments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const pendingAppointments = fetchedAppointments.filter(appointment => appointment.status === 'Pending');
        setAppointments(pendingAppointments);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      Alert.alert('Error', 'Could not fetch appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkForUnreadNotifications = async (userId) => {
    try {
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('seen', '==', false)
      );
      const snapshot = await getDocs(notificationsQuery);

      if (!snapshot.empty) {
        setUnreadNotifications(true); 
      } else {
        setUnreadNotifications(false); 
      }
    } catch (error) {
      console.error('Error checking notifications:', error);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus, name,) => {
    try {

      const mechanicName = user.displayName || "Mechanic"

      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, { status: newStatus });

      await addDoc(collection(db, 'notifications'), {
        mechanic_name: mechanicName,
        userId: name,
        message: `Your appointment has been ${newStatus.toLowerCase()} by the ${mechanicName}.`,
        seen: false,
      });

      Alert.alert(`Appointment ${newStatus}`);
      fetchAppointments(user.uid);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      Alert.alert('Error', `Could not ${newStatus.toLowerCase()} the appointment.`);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAppointments(user.uid);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#075E54" />
        <Text style={styles.loadingText}>Loading Appointments...</Text>
      </View>
    );
  }

  if (appointments.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noAppointments}>No Pending Appointments Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {appointments.map((appointment) => (
          <View key={appointment.id} style={styles.detailsContainer}>
            <Text style={styles.label}>User Name: <Text style={styles.value}>{appointment.user_name}</Text></Text>
            <Text style={styles.label}>Date: <Text style={styles.value}>{appointment.date}</Text></Text>
            <Text style={styles.label}>Time: <Text style={styles.value}>{appointment.time}</Text></Text>
            <Text style={styles.label}>Status: <Text style={styles.value}>{appointment.status || 'Pending'}</Text></Text>

            <View style={styles.buttonContainer}>
              {appointment.status === 'Pending' && (
                <>
                  <TouchableOpacity
                    onPress={() => handleStatusChange(appointment.id, 'Accepted', appointment.user_name)}
                    style={[styles.button, styles.acceptButton]}
                  >
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleStatusChange(appointment.id, 'Rejected', appointment.user_name)}
                    style={[styles.button, styles.rejectButton]}
                  >
                    <Text style={styles.buttonText}>Reject</Text>
                  </TouchableOpacity>
                </>
              )}
              {appointment.status && appointment.status !== 'Pending' && (
                <Text style={styles.statusMessage}>You have {appointment.status} this appointment.</Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.iconContainer}>
        <Icon name="event" size={30} color="#075E54" /> 
        {unreadNotifications && <View style={styles.badge}><Text style={styles.badgeText}>!</Text></View>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '45%',
  },
  acceptButton: {
    backgroundColor: '#28a745',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusMessage: {
    fontSize: 16,
    color: '#777',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  noAppointments: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#777',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: '100%',
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
    marginTop: 10,
    textAlign: 'center',
  },
  iconContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff0000',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default MechanicViewAppointment;

