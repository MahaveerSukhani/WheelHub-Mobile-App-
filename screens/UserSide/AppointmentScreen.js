import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getAuth, auth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase'; 
import { getMessaging } from 'firebase/messaging'; 

const AppointmentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { mechanicId, mechanicName } = route.params;

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(null);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [userName, setUserName] = useState(''); 

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserName = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid)); 
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.name || 'Unknown'); 
          } else {
            setUserName('Unknown');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUserName('Unknown');
        }
      }
    };

    fetchUserName();
  }, [user]);


  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleConfirm = (date) => {
    const formattedTime = moment(date).format('HH:mm');
    setSelectedTime(formattedTime);
    hideTimePicker();
  };

  const sendNotificationToMechanic = async (mechanicId) => {
    try {
      const mechanicDoc = await getDoc(doc(db, 'mechanics', mechanicId));
      if (mechanicDoc.exists()) {
        const fcmToken = mechanicDoc.data().fcmToken;
        if (!fcmToken) {
          console.log('No FCM token found for mechanic');
          return;
        }

        const message = {
          to: fcmToken,
          notification: {
            title: 'New Appointment',
            body: `You have a new appointment request from a user.`,
          },
        };

        const messaging = getMessaging();
        await sendMessage(messaging, message);
        console.log('Notification sent to mechanic');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select both date and time for the appointment.');
      return;
    }

    if (!mechanicId || !mechanicName) {
      Alert.alert('Error', 'Mechanic information is missing.');
      return;
    }

    const appointmentData = {
      user_id: user?.uid,
      mechanic_id: mechanicId,
      mechanic_name: mechanicName,
      date: selectedDate,
      time: selectedTime,
      status: 'Pending',
      user_name: userName || 'Unknown', 
      timestamp: serverTimestamp(),
    };

    try {
      const appointmentsRef = collection(db, 'appointments');
      await addDoc(appointmentsRef, appointmentData);

      await sendNotificationToMechanic(mechanicId);

      Alert.alert('Success', `Appointment booked for ${selectedDate} at ${selectedTime}`, [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Main'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', `Failed to book appointment: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Appointment Date and Time</Text>

      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: '#34C759' },
        }}
      />

      {selectedDate && (
        <Text style={styles.selectedInfo}>Selected Date: {selectedDate}</Text>
      )}
      {selectedTime && (
        <Text style={styles.selectedInfo}>Selected Time: {selectedTime}</Text>
      )}

      <TouchableOpacity style={styles.timeButton} onPress={showTimePicker}>
        <Text style={styles.timeButtonText}>
          {selectedTime ? 'Change Time' : 'Select Time'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleBooking}
        disabled={!selectedDate || !selectedTime}
      >
        <Text style={styles.confirmButtonText}>Confirm Appointment</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideTimePicker}
        date={new Date()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4FAFF',
    padding: 20,
  },
  title: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: '#00796B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedInfo: {
    fontSize: 16,
    marginVertical: 10,
    color: '#555',
    textAlign: 'center',
  },
  timeButton: {
    marginTop: 10,
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  timeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppointmentScreen;



