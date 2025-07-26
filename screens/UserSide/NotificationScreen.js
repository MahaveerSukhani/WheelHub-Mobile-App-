// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
// import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
// import { db } from '../../firebase';
// import { getAuth } from 'firebase/auth';

// const NotificationScreen = ({ navigation }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const auth = getAuth();

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);
//         fetchNotifications(currentUser.uid);
//       } else {
//         navigation.navigate('Login');
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const fetchNotifications = async (userId) => {
//     try {
//       const notificationsQuery = query(
//         collection(db, 'notifications'),
//         where('userId', '==', userId)
//       );
//       const snapshot = await getDocs(notificationsQuery);
      
//       const fetchedNotifications = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       setNotifications(fetchedNotifications);
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//       Alert.alert('Error', 'Could not fetch notifications.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markAsRead = async (notificationId) => {
//     try {
//       const notificationRef = doc(db, 'notifications', notificationId);
//       await updateDoc(notificationRef, { seen: true });
//       // Refresh notifications after marking as read
//       fetchNotifications(user.uid);
//     } catch (error) {
//       console.error('Error updating notification status:', error);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="#075E54" />
//         <Text style={styles.loadingText}>Loading Notifications...</Text>
//       </View>
//     );
//   }

//   if (notifications.length === 0) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.noNotifications}>No Notifications Available</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {notifications.map((notification) => (
//         <TouchableOpacity
//           key={notification.id}
//           style={[styles.notification, notification.seen && styles.notificationRead]}
//           onPress={() => markAsRead(notification.id)}
//         >
//           <Text style={styles.message}>{notification.message}</Text>
//           <Text style={styles.status}>Status: {notification.status}</Text>
//           {!notification.seen && <Text style={styles.unread}>New</Text>}
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f0f0f0',
//     padding: 20,
//   },
//   notification: {
//     backgroundColor: '#fff',
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 4,
//   },
//   notificationRead: {
//     backgroundColor: '#f8f8f8',
//   },
//   message: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   status: {
//     fontSize: 14,
//     color: '#555',
//   },
//   unread: {
//     fontSize: 14,
//     color: '#ff0000',
//     fontWeight: 'bold',
//     marginTop: 5,
//   },
//   loadingText: {
//     fontSize: 18,
//     color: '#555',
//     marginTop: 10,
//     textAlign: 'center',
//   },
//   noNotifications: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#777',
//     textAlign: 'center',
//     justifyContent: 'center',
//     marginTop: '100%',
//   },
// });

// export default NotificationScreen;




import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { getAuth } from 'firebase/auth';

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchNotifications(currentUser.uid);
      } else {
        navigation.navigate('Login');
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchNotifications = async (userId) => {
    try {
      const notificationsQuery = query(
        collection(db, 'notifications'),
        where('userId', '==', userId) 
      );
      const snapshot = await getDocs(notificationsQuery);

      const fetchedNotifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      Alert.alert('Error', 'Could not fetch notifications.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, { seen: true });
      if (user) {
        fetchNotifications(user.uid);
      }
    } catch (error) {
      console.error('Error updating notification status:', error);
      Alert.alert('Error', 'Could not update notification status.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#075E54" />
        <Text style={styles.loadingText}>Loading Notifications...</Text>
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noNotifications}>No Notifications Available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {notifications.map((notification) => (
        <TouchableOpacity
          key={notification.id}
          style={[styles.notification, notification.seen && styles.notificationRead]}
          onPress={() => markAsRead(notification.id)}
        >
          <Text style={styles.message}>Mechanic: {notification.mechanic_name}</Text>
          <Text style={styles.message}>Message: {notification.message}</Text>
          {!notification.seen && <Text style={styles.unread}>New</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  notification: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  notificationRead: {
    backgroundColor: '#f8f8f8',
  },
  message: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  unread: {
    fontSize: 14,
    color: '#ff0000',
    fontWeight: 'bold',
    marginTop: 5,
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
    marginTop: 10,
    textAlign: 'center',
  },
  noNotifications: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#777',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: '100%',
  },
});

export default NotificationScreen;
