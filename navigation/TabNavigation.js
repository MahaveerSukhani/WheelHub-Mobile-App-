import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import HomeScreen from '../screens/UserSide/HomeScreen';
import FindMechanicScreen from '../screens/UserSide/FindMechanicScreen';
import NearbyMechanics from '../screens/UserSide/NearbyMechanics';
import ProfileScreen from '../screens/UserSide/ProfileScreen';
import ChatScreen from '../screens/Chat/chatscreen';
import BackButton from '../components/BackButton';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();

const TabNavigation = ({ navigation }) => {
  const [unreadChats, setUnreadChats] = useState(0);

  useEffect(() => {
    const db = getFirestore();
    const auth = getAuth();
    const loggedInUserId = auth.currentUser?.uid;

    if (loggedInUserId) {
      const messagesRef = collection(db, 'messages');
      const q = query(messagesRef, where('receiverId', '==', loggedInUserId), where('read', '==', false));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setUnreadChats(snapshot.size);
      });

      return () => unsubscribe();
    }
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#00796B',
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
        },
        headerTintColor: '#fff',
        backgroundColor: '#44C2B7',
        headerTitleAlign: 'center',
        headerLeft: () => <BackButton navigation={navigation} />,
        tabBarActiveTintColor: '#333',
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: { backgroundColor: '#00796B', height: 60 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="Find Mechanic"
        component={FindMechanicScreen}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 name="search" size={24} color={color} />,
        }}
      />
      <Tab.Screen
        name="NearBy"
        component={NearbyMechanics}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 name="map-marker-alt" size={24} color={color} />,
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
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={24} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;




// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { FontAwesome5 } from '@expo/vector-icons';
// import HomeScreen from '../screens/UserSide/HomeScreen';
// import FindMechanicScreen from '../screens/UserSide/FindMechanicScreen';
// import NearbyMechanics from '../screens/UserSide/NearbyMechanics';
// import ProfileScreen from '../screens/UserSide/ProfileScreen';
// import ChatScreen from '../screens/Chat/chatscreen';
// import BackButton from '../components/BackButton';

// const Tab = createBottomTabNavigator();

// const TabNavigation = ({ navigation }) => {
//   return (
//     <Tab.Navigator
//       initialRouteName="Home"
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
//         name="Home"
//         component={HomeScreen}
//         options={{ headerShown: false,
//           tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={24} color={color} />,
//         }}
//       />
//       <Tab.Screen
//         name="Find Mechanic"
//         component={FindMechanicScreen}
//         options={{
//           tabBarIcon: ({ color }) => <FontAwesome5 name="search" size={24} color={color} />,
//         }}
//       />
//       <Tab.Screen
//         name="NearBy"
//         component={NearbyMechanics}
//         options={{
//           tabBarIcon: ({ color }) => <FontAwesome5 name="map-marker-alt" size={24} color={color} />,
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
//         component={ProfileScreen}
//         options={{
//           tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={24} color={color} />,
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// export default TabNavigation;
