import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigation from './TabNavigation';
import MechanicTabNavigation from './MechanicTabNavigation';
import SignupScreen from '../screens/UserSide/SignupScreen';
import LoginScreen from '../screens/UserSide/LoginScreen';
import AppointmentScreen from '../screens/UserSide/AppointmentScreen';
import MechanicDetailsScreen from '../screens/UserSide/MechanicDetailsScreen';
import ChatDetailsScreen from '../screens/Chat/ChatDetailsScreen';
import ChatScreen from '../screens/Chat/chatscreen';
import BackButton from '../components/BackButton';
import NotificationScreen from '../screens/UserSide/NotificationScreen';

const Stack = createStackNavigator();

const AppNavigation = () => (
  <Stack.Navigator
    screenOptions={({ navigation }) => ({
      headerStyle: {
        backgroundColor: '#00796B',
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
      },
      headerTintColor: '#fff',
      headerTitleAlign: 'center',
      headerLeft: () => <BackButton navigation={navigation} />,
    })}
  >
    <Stack.Screen
      name="Signup"
      component={SignupScreen}
      options={{ title: 'Signup', headerShown: false }}
    />
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{ title: 'Login', headerShown: false }}
    />

    <Stack.Screen
      name="MechanicMain"
      component={MechanicTabNavigation}
      options={{ title: 'Mechanic Dashboard', headerShown: false }}
    />
    <Stack.Screen
      name="Main"
      component={TabNavigation}
      options={{ title: 'User Dashboard', headerShown: false }}
    />

    <Stack.Screen
      name="Appointment"
      component={AppointmentScreen}
      options={{ title: 'Appointment' }}
    />
    <Stack.Screen
      name="MechanicDetails"
      component={MechanicDetailsScreen}
      options={{ title: 'Mechanic Details' }}
    />
    <Stack.Screen
      name="ChatDetail"
      component={ChatDetailsScreen}
      options={{ title: 'Chat Details', headerShown: false }}
    />
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={{ title: 'Chat Details', headerShown: false }}
    />
    <Stack.Screen
      name="Notification"
      component={NotificationScreen}
      options={{ title: 'Chat Details', headerShown: false }}
    />
  </Stack.Navigator>
);

export default AppNavigation;


// import React from "react";
// import { createStackNavigator } from "@react-navigation/stack";
// import TabNavigation from "./TabNavigation";
// import MechanicTabNavigation from "./MechanicTabNavigation";
// import UserDrawerNavigation from "./UserDrawerNavigation"; // Import Drawer Navigation for User
// import MechanicDrawerNavigation from "./MechanicDrawerNavigation"; // Import Drawer Navigation for Mechanic
// import SignupScreen from "../screens/UserSide/SignupScreen";
// import LoginScreen from "../screens/UserSide/LoginScreen";
// import AppointmentScreen from "../screens/UserSide/AppointmentScreen";
// import MechanicDetailsScreen from "../screens/UserSide/MechanicDetailsScreen";
// import ChatDetailsScreen from "../screens/Chat/ChatDetailsScreen";
// import ChatScreen from "../screens/Chat/chatscreen";
// import BackButton from "../components/BackButton";

// const Stack = createStackNavigator();

// const AppNavigation = ({ userRole }) => (
//   <Stack.Navigator
//     screenOptions={({ navigation }) => ({
//       headerStyle: {
//         backgroundColor: "#00796B",
//         borderBottomRightRadius: 20,
//         borderBottomLeftRadius: 20,
//       },
//       headerTintColor: "#fff",
//       headerTitleAlign: "center",
//       headerLeft: () => <BackButton navigation={navigation} />,
//     })}
//   >
//     <Stack.Screen
//       name="Signup"
//       component={SignupScreen}
//       options={{ title: "Signup", headerShown: false }}
//     />
//     <Stack.Screen
//       name="Login"
//       component={LoginScreen}
//       options={{ title: "Login", headerShown: false }}
//     />

//     {userRole === "user" ? (
//       <Stack.Screen
//         name="UserMain"
//         component={UserDrawerNavigation} 
//         options={{ title: "User Dashboard", headerShown: false }}
//       />
//     ) : (
//       <Stack.Screen
//         name="MechanicMain"
//         component={MechanicDrawerNavigation}
//         options={{ title: "Mechanic Dashboard", headerShown: false }}
//       />
//     )}

//     {userRole === "user" ? (
//       <Stack.Screen
//         name="Main"
//         component={TabNavigation} 
//         options={{ title: "User Dashboard", headerShown: false }}
//       />
//     ) : (
//       <Stack.Screen
//         name="MechanicMain"
//         component={MechanicTabNavigation} 
//         options={{ title: "Mechanic Dashboard", headerShown: false }}
//       />
//     )}

//     <Stack.Screen
//       name="Appointment"
//       component={AppointmentScreen}
//       options={{ title: "Appointment" }}
//     />
//     <Stack.Screen
//       name="MechanicDetails"
//       component={MechanicDetailsScreen}
//       options={{ title: "Mechanic Details" }}
//     />
//     <Stack.Screen
//       name="ChatDetail"
//       component={ChatDetailsScreen}
//       options={{ title: "Chat Details", headerShown: false }}
//     />
//     <Stack.Screen
//       name="Chat"
//       component={ChatScreen}
//       options={{ title: "Chat Details", headerShown: false }}
//     />
//   </Stack.Navigator>
// );

// export default AppNavigation;
