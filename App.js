import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './navigation/AppNavigation';

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigation />
    </NavigationContainer>
  );
}









































// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { FontAwesome5 } from '@expo/vector-icons';

// import { TouchableOpacity } from 'react-native';

// // User Screen Imports
// import SignupScreen from './screens/UserSide/SignupScreen';
// import LoginScreen from './screens/UserSide/LoginScreen';
// import HomeScreen from './screens/UserSide/HomeScreen';
// import FindMechanicScreen from './screens/UserSide/FindMechanicScreen';
// import MechanicDetailsScreen from './screens/UserSide/MechanicDetailsScreen';
// import AppointmentScreen from './screens/UserSide/AppointmentScreen';
// import ProfileScreen from './screens/UserSide/ProfileScreen';
// import NearbyMechanics from './screens/UserSide/NearbyMechanics';

// // Mechanic Screen Imports
// import MechanicDashboard from './screens/MechanicSide/MechanicDashboard';
// import MechanicProfile from './screens/MechanicSide/MechanicProfile';
// import MechanicViewAppointment from './screens/MechanicSide/MechanicViewAppointment';

// // Chat Screen Imports
// import ChatListScreen from './screens/Chat/ChatListScreen';
// import ChatDetailsScreen from './screens/Chat/ChatDetailsScreen';
// import ChatScreen from './screens/Chat/chatscreen';

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// const BackButton = ({ navigation }) => (
//   <TouchableOpacity onPress={() => navigation.goBack()}>
//     <FontAwesome5 name="arrow-left" size={20} color="#fff" style={{ marginLeft: 15 }} />
//   </TouchableOpacity>
// );

// // User Tab Navigator
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
//         options={{
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
//           tabBarIcon: ({ color }) => (
//             <FontAwesome5 name="map-marker-alt" size={24} color={color} />
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
//         component={ProfileScreen}
//         options={{
//           tabBarIcon: ({ color }) => <FontAwesome5 name="user" size={24} color={color} />,
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// const MechanicTabNavigation = ({ navigation }) => {
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
//           tabBarIcon: ({ color }) => <FontAwesome5 name="calendar-check" size={24} color={color} />,
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

// // Main Stack Navigator
// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         screenOptions={({ navigation }) => ({
//           headerStyle: {
//             backgroundColor: '#00796B',
//             borderBottomRightRadius: 20,
//             borderBottomLeftRadius: 20,
//           },
//           headerTintColor: '#fff',
//           headerTitleAlign: 'center',
//           headerLeft: () => <BackButton navigation={navigation} />,
//         })}
//       >
//         {/* User Authentication Screens */}
//         <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Signup', headerShown: false }} />
//         <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login', headerShown: false }} />

//         {/* Main User and Mechanic Navigators */}
//         <Stack.Screen
//           name="MechanicMain"
//           component={MechanicTabNavigation}
//           options={{ title: 'Mechanic Dashboard', headerShown: false }}
//         />
//         <Stack.Screen 
//           name="Main" 
//           component={TabNavigation} 
//           options={{ title: 'User Dashboard', headerShown: false }} />

//         {/* Additional Screens */}
//         <Stack.Screen name="Appointment" component={AppointmentScreen} options={{ title: 'Appointment' }} />
//         <Stack.Screen name="MechanicDetails" component={MechanicDetailsScreen} options={{ title: 'Mechanic Details' }} />
//         <Stack.Screen name="ChatDetail" component={ChatDetailsScreen} options={{ title: 'Chat Details', headerShown: false }} />
//         <Stack.Screen name='Chat' component={ChatScreen} options={{ title: 'Chat Details', headerShown: false }}/>
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }




