import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { FontAwesome5 } from '@expo/vector-icons';

import MechanicDashboard from '../screens/MechanicSide/MechanicDashboard';
import MechanicProfile from '../screens/MechanicSide/MechanicProfile';
import MechanicViewAppointment from '../screens/MechanicSide/MechanicViewAppointment';
import ChatScreen from '../screens/Chat/chatscreen';

const Drawer = createDrawerNavigator();

const MechanicDrawerNavigation = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Mechanic"
      screenOptions={{
        headerStyle: { backgroundColor: '#00796B' },
        headerTintColor: '#fff',
        drawerActiveTintColor: '#44C2B7',
        drawerInactiveTintColor: '#888',
        drawerStyle: { backgroundColor: '#fff' },
      }}
    >
      <Drawer.Screen
        name="Mechanic"
        component={MechanicDashboard}
        options={{
          drawerIcon: ({ color }) => <FontAwesome5 name="home" size={24} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Appointments"
        component={MechanicViewAppointment}
        options={{
          drawerIcon: ({ color }) => <FontAwesome5 name="calendar-check" size={24} color={color} />,
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
        component={MechanicProfile}
        options={{
          drawerIcon: ({ color }) => <FontAwesome5 name="user" size={24} color={color} />,
        }}
      />
    </Drawer.Navigator>
  );
};

export default MechanicDrawerNavigation;
