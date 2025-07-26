import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { FontAwesome5 } from '@expo/vector-icons';

import HomeScreen from '../screens/UserSide/HomeScreen';
import FindMechanicScreen from '../screens/UserSide/FindMechanicScreen';
import MechanicDetailsScreen from '../screens/UserSide/MechanicDetailsScreen';
import AppointmentScreen from '../screens/UserSide/AppointmentScreen';
import ProfileScreen from '../screens/UserSide/ProfileScreen';
import NearbyMechanics from '../screens/UserSide/NearbyMechanics';
import ChatScreen from '../screens/Chat/chatscreen';

const Drawer = createDrawerNavigator();

const UserDrawerNavigation = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#00796B' },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#44C2B7',
        drawerInactiveTintColor: '#888',
        drawerStyle: { backgroundColor: '#fff' },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ color }) => <FontAwesome5 name="home" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Find Mechanic"
        component={FindMechanicScreen}
        options={{
          drawerIcon: ({ color }) => <FontAwesome5 name="search" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="NearBy"
        component={NearbyMechanics}
        options={{
          drawerIcon: ({ color }) => <FontAwesome5 name="map-marker-alt" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          drawerIcon: ({ color }) => <FontAwesome5 name="comments" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color }) => <FontAwesome5 name="user" size={24} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
};

export default UserDrawerNavigation;
