import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import MechanicDashboard from '../screens/MechanicSide/MechanicDashboard';
import MechanicProfile from '../screens/MechanicSide/MechanicProfile';
import MechanicViewAppointment from '../screens/MechanicSide/MechanicViewAppointment';
import ChatScreen from '../screens/Chat/chatscreen';
import BackButton from '../components/BackButton';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();

const MechanicTabNavigation = ({ navigation }) => {
  const [unreadAppointments, setUnreadAppointments] = useState(0);
  const [unreadChats, setUnreadChats] = useState(0);

  useEffect(() => {
    const db = getFirestore();
    const auth = getAuth();
    const mechanicId = auth.currentUser?.uid;

    if (mechanicId) {
      // Unread Appointments
      const appointmentsRef = collection(db, 'appointments');
      const appointmentsQuery = query(
        appointmentsRef,
        where('mechanic_id', '==', mechanicId),
        where('status', '==', 'Pending')
      );

      const unsubscribeAppointments = onSnapshot(appointmentsQuery, (snapshot) => {
        setUnreadAppointments(snapshot.size);
      });

      // Unread Chats
      const messagesRef = collection(db, 'messages');
      const messagesQuery = query(
        messagesRef,
        where('receiverId', '==', mechanicId),
        where('read', '==', false)
      );

      const unsubscribeChats = onSnapshot(messagesQuery, (snapshot) => {
        setUnreadChats(snapshot.size);
      });

      return () => {
        unsubscribeAppointments();
        unsubscribeChats();
      };
    }
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Mechanic"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#00796B',
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerLeft: () => <BackButton navigation={navigation} />,
        tabBarActiveTintColor: '#333',
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: { backgroundColor: '#00796B', height: 60 },
      }}
    >
      <Tab.Screen
        name="Mechanic"
        component={MechanicDashboard}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={MechanicViewAppointment}
        options={{
          tabBarIcon: ({ color }) => (
            <View>
              <FontAwesome5 name="calendar-check" size={24} color={color} />
              {unreadAppointments > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -5,
                    right: -10,
                    backgroundColor: 'red',
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 12 }}>{unreadAppointments}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View>
              <FontAwesome5 name="comments" size={24} color={color} />
              {unreadChats > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -5,
                    right: -10,
                    backgroundColor: 'red',
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 12 }}>{unreadChats}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={MechanicProfile}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default MechanicTabNavigation;



// import React, { useEffect, useState } from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { FontAwesome5 } from '@expo/vector-icons';
// import MechanicDashboard from '../screens/MechanicSide/MechanicDashboard';
// import MechanicProfile from '../screens/MechanicSide/MechanicProfile';
// import MechanicViewAppointment from '../screens/MechanicSide/MechanicViewAppointment';
// import ChatScreen from '../screens/Chat/chatscreen';
// import BackButton from '../components/BackButton';
// import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';
// import { View, Text } from 'react-native';

// const Tab = createBottomTabNavigator();

// const MechanicTabNavigation = ({ navigation }) => {
//   const [unreadAppointments, setUnreadAppointments] = useState(0);

//   useEffect(() => {
//     const fetchUnreadAppointments = async () => {
//       const db = getFirestore();
//       const auth = getAuth();
//       const mechanicId = auth.currentUser?.uid; // Get the current mechanic's ID

//       if (mechanicId) {
//         // Query for unread appointments where the mechanic's ID matches and the status is "Pending"
//         const appointmentsRef = collection(db, 'appointments');
//         const q = query(
//           appointmentsRef,
//           where('mechanic_id', '==', mechanicId),
//           where('status', '==', 'Pending')
//         );

//         try {
//           const querySnapshot = await getDocs(q);
//           setUnreadAppointments(querySnapshot.size); // Set the count of unread appointments
//         } catch (error) {
//           console.error('Error fetching unread appointments:', error);
//         }
//       }
//     };

//     fetchUnreadAppointments(); // Fetch unread appointments on mount

//     // Optional: You can add a listener here to periodically check for new unread appointments
//   }, []);

//   return (
//     <Tab.Navigator
//       initialRouteName="Mechanic"
//       screenOptions={{
//         headerStyle: { 
//           backgroundColor: '#00796B', 
//           borderBottomRightRadius: 20,
//           borderBottomLeftRadius: 20,
//         },
//         headerTintColor: '#fff',
//         headerTitleAlign: 'center',
//         headerLeft: () => <BackButton navigation={navigation} />,
//         tabBarActiveTintColor: '#44C2B7',
//         tabBarInactiveTintColor: '#888',
//         tabBarStyle: { backgroundColor: '#fff', height: 60 },
//       }}
//     >
//       <Tab.Screen
//         name="Mechanic"
//         component={MechanicDashboard}
//         options={{
//           tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={24} color={color} />,
//         }}
//       />
//       <Tab.Screen
//         name="Appointments"
//         component={MechanicViewAppointment}
//         options={{
//           tabBarIcon: ({ color }) => (
//             <FontAwesome5 name="calendar-check" size={24} color={color}>
//               {/* Show badge if there are unread appointments */}
//               {unreadAppointments > 0 && (
//                 <View
//                   style={{
//                     position: 'absolute',
//                     right: -6,
//                     top: -6,
//                     backgroundColor: 'red',
//                     borderRadius: 10,
//                     width: 20,
//                     height: 20,
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                   }}
//                 >
//                   <Text style={{ color: 'white', fontSize: 12 }}>{unreadAppointments}</Text>
//                 </View>
//               )}
//             </FontAwesome5>
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Chat"
//         component={ChatScreen}
//         options={{
//           tabBarIcon: ({ color }) => <FontAwesome5 name="comments" size={24} color={color} />,
//         }}
//       />
//       <Tab.Screen
//         name="Profile"
//         component={MechanicProfile}
//         options={{
//           tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={24} color={color} />,
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// export default MechanicTabNavigation;


// // import React from 'react';
// // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // import { FontAwesome5 } from '@expo/vector-icons';
// // import MechanicDashboard from '../screens/MechanicSide/MechanicDashboard';
// // import MechanicProfile from '../screens/MechanicSide/MechanicProfile';
// // import MechanicViewAppointment from '../screens/MechanicSide/MechanicViewAppointment';
// // import ChatScreen from '../screens/Chat/chatscreen';
// // import BackButton from '../components/BackButton';

// // const Tab = createBottomTabNavigator();

// // const MechanicTabNavigation = ({ navigation }) => {
// //   return (
// //     <Tab.Navigator
// //       initialRouteName="Mechanic"
// //       screenOptions={{
// //         headerStyle: { 
// //           backgroundColor: '#00796B', 
// //           borderBottomRightRadius: 20,
// //           borderBottomLeftRadius: 20,
// //         },
// //         headerTintColor: '#fff',
// //         headerTitleAlign: 'center',
// //         headerLeft: () => <BackButton navigation={navigation} />,
// //         tabBarActiveTintColor: '#44C2B7',
// //         tabBarInactiveTintColor: '#888',
// //         tabBarStyle: { backgroundColor: '#fff', height: 60 },
// //       }}
// //     >
// //       <Tab.Screen
// //         name="Mechanic"
// //         component={MechanicDashboard}
// //         options={{
// //           tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={24} color={color} />,
// //         }}
// //       />
// //       <Tab.Screen
// //         name="Appointments"
// //         component={MechanicViewAppointment}
// //         options={{
// //           tabBarIcon: ({ color }) => <FontAwesome5 name="calendar-check" size={24} color={color} />,
// //         }}
// //       />
// //       <Tab.Screen
// //         name="Chat"
// //         component={ChatScreen}
// //         options={{
// //           tabBarIcon: ({ color }) => <FontAwesome5 name="comments" size={24} color={color} />,
// //         }}
// //       />
// //       <Tab.Screen
// //         name="Profile"
// //         component={MechanicProfile}
// //         options={{
// //           tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={24} color={color} />,
// //         }}
// //       />
// //     </Tab.Navigator>
// //   );
// // };

// // export default MechanicTabNavigation;
