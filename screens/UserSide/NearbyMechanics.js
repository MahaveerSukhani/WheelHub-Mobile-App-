// import React, { useState, useEffect, useRef } from 'react';
// import { View, StyleSheet, Alert, Text, ActivityIndicator } from 'react-native';
// import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
// import * as Location from 'expo-location';
// import { getFirestore, collection, getDocs } from 'firebase/firestore';
// import { db } from '../../firebase';
// import axios from 'axios';

// const googleApiKey = 'AIzaSyDIJ9XX2ZvRKCJcFRrl-lRanEtFUow4piM'; 

// const NearbyMechanicsMap = () => {
//   const [userLocation, setUserLocation] = useState(null);
//   const [mechanics, setMechanics] = useState([]);
//   const [selectedMechanic, setSelectedMechanic] = useState(null);
//   const [routeDetails, setRouteDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const mapViewRef = useRef(null);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission Denied', 'Location permission is required');
//         setLoading(false);
//         return;
//       }

//       try {
//         let location = await Location.getCurrentPositionAsync({});
//         setUserLocation({
//           latitude: location.coords.latitude,
//           longitude: location.coords.longitude,
//         });
//       } catch (error) {
//         Alert.alert('Location Error', 'Could not retrieve current location');
//         setLoading(false);
//       }
//     })();
//   }, []);

//   useEffect(() => {
//     if (userLocation) {
//       fetchNearbyMechanics();
//     }
//   }, [userLocation]);

//   const fetchNearbyMechanics = async () => {
//     try {
//       const mechanicsRef = collection(db, 'mechanics');
//       const snapshot = await getDocs(mechanicsRef);

//       if (!snapshot.empty) {
//         const fetchedMechanics = await Promise.all(
//           snapshot.docs.map(async (doc) => {
//             const mechanicData = { id: doc.id, ...doc.data() };

//             try {
//               const geocodedLocation = await Location.geocodeAsync(mechanicData.address);

//               if (geocodedLocation.length > 0) {
//                 return {
//                   ...mechanicData,
//                   latitude: geocodedLocation[0].latitude,
//                   longitude: geocodedLocation[0].longitude,
//                 };
//               }
//             } catch (geocodeError) {
//               console.error(`Geocoding error for ${mechanicData.name}:`, geocodeError);
//             }

//             return null;
//           })
//         );

//         const validMechanics = fetchedMechanics.filter((mechanic) => mechanic !== null);
//         setMechanics(validMechanics);
//       }
//     } catch (error) {
//       console.error('Error fetching mechanics:', error);
//       Alert.alert('Error', 'Could not fetch nearby mechanics');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRouteDetails = async (destination) => {
//     if (!userLocation) return;

//     try {
//       const response = await axios.get(
//         `https://maps.googleapis.com/maps/api/directions/json`,
//         {
//           params: {
//             origin: `${userLocation.latitude},${userLocation.longitude}`,
//             destination: `${destination.latitude},${destination.longitude}`,
//             key: googleApiKey,
//             mode: 'driving',
//           },
//         }
//       );

//       if (response.data.routes.length > 0) {
//         const route = response.data.routes[0];
//         setRouteDetails({
//           distance: route.legs[0].distance.text,
//           duration: route.legs[0].duration.text,
//           polyline: route.overview_polyline.points,
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching route details:', error);
//       Alert.alert('Error', 'Could not fetch route details');
//     }
//   };

//   const decodePolyline = (encoded) => {
//     if (!encoded) return [];
//     const points = [];
//     let index = 0,
//       lat = 0,
//       lng = 0;

//     while (index < encoded.length) {
//       let result = 1,
//         shift = 0,
//         b;
//       do {
//         b = encoded.charCodeAt(index++) - 63;
//         result += b << shift;
//         shift += 5;
//       } while (b >= 0x20);
//       const dlat = result & 1 ? ~(result >> 1) : result >> 1;
//       lat += dlat;

//       result = 1;
//       shift = 0;
//       do {
//         b = encoded.charCodeAt(index++) - 63;
//         result += b << shift;
//         shift += 5;
//       } while (b >= 0x20);
//       const dlng = result & 1 ? ~(result >> 1) : result >> 1;
//       lng += dlng;

//       points.push({
//         latitude: lat / 1e5,
//         longitude: lng / 1e5,
//       });
//     }
//     return points;
//   };

//   const centerMapToFitRoute = () => {
//     if (selectedMechanic && routeDetails) {
//       mapViewRef.current?.fitToCoordinates(
//         [
//           userLocation,
//           { latitude: selectedMechanic.latitude, longitude: selectedMechanic.longitude },
//         ],
//         { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: true }
//       );
//     }
//   };

//   useEffect(() => {
//     if (routeDetails) {
//       centerMapToFitRoute();
//     }
//   }, [routeDetails]);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//         <Text>Loading mechanics...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <MapView
//         ref={mapViewRef}
//         style={styles.map}
//         initialRegion={{
//           latitude: userLocation.latitude,
//           longitude: userLocation.longitude,
//           latitudeDelta: 0.1,
//           longitudeDelta: 0.1,
//         }}
//       >
//         <Marker
//           coordinate={userLocation}
//           title="Your Location"
//           pinColor="blue"
//         />

//         {mechanics.map((mechanic) => (
//           <Marker
//             key={mechanic.id}
//             coordinate={{
//               latitude: mechanic.latitude,
//               longitude: mechanic.longitude,
//             }}
//             pinColor="red"
//             onPress={() => {
//               setSelectedMechanic(mechanic);
//               fetchRouteDetails(mechanic);
//             }}
//           >
//             <Callout>
//               <View>
//                 <Text style={styles.mechanicName}>{mechanic.name}</Text>
//                 <Text>{mechanic.address}</Text>
//               </View>
//             </Callout>
//           </Marker>
//         ))}

//         {selectedMechanic && routeDetails && (
//           <Polyline
//             coordinates={decodePolyline(routeDetails.polyline)}
//             strokeColor="blue"
//             strokeWidth={4}
//           />
//         )}
//       </MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   map: {
//     width: '100%',
//     height: '100%',
//   },
//   mechanicName: {
//     fontWeight: 'bold',
//   },
// });

// export default NearbyMechanicsMap;



import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import axios from 'axios';
import { getDistance } from 'geolib'; 

const googleApiKey = 'AIzaSyDIJ9XX2ZvRKCJcFRrl-lRanEtFUow4piM';

const NearbyMechanicsMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [mechanics, setMechanics] = useState([]);
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [routeDetails, setRouteDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapViewRef = useRef(null);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        setLoading(false);
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        Alert.alert('Location Error', 'Could not retrieve current location');
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (userLocation) fetchNearbyMechanics();
  }, [userLocation]);

  const fetchNearbyMechanics = async () => {
    try {
      const mechanicsRef = collection(db, 'mechanics');
      const snapshot = await getDocs(mechanicsRef);

      if (!snapshot.empty) {
        const fetchedMechanics = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const mechanicData = { id: doc.id, ...doc.data() };

            try {
              const geocodedLocation = await Location.geocodeAsync(mechanicData.address);

              if (geocodedLocation.length > 0) {
                const mechanicLocation = {
                  latitude: geocodedLocation[0].latitude,
                  longitude: geocodedLocation[0].longitude,
                };

                const distance = getDistance(
                  { latitude: userLocation.latitude, longitude: userLocation.longitude },
                  mechanicLocation
                );

                if (distance <= 5000) {
                  return {
                    ...mechanicData,
                    ...mechanicLocation,
                  };
                }
              }
            } catch (geocodeError) {
              console.error(`Geocoding error for ${mechanicData.name}:`, geocodeError);
            }

            return null;
          })
        );

        setMechanics(fetchedMechanics.filter(Boolean));
      }
    } catch (error) {
      console.error('Error fetching mechanics:', error);
      Alert.alert('Error', 'Could not fetch nearby mechanics');
    }
  };

  const fetchRouteDetails = async (destination) => {
    if (!userLocation) return;

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json`,
        {
          params: {
            origin: `${userLocation.latitude},${userLocation.longitude}`,
            destination: `${destination.latitude},${destination.longitude}`,
            key: googleApiKey,
            mode: 'driving',
          },
        }
      );

      if (response.data.routes.length > 0) {
        const route = response.data.routes[0];
        setRouteDetails({
          distance: route.legs[0].distance.text,
          duration: route.legs[0].duration.text,
          polyline: route.overview_polyline.points,
        });
      }
    } catch (error) {
      console.error('Error fetching route details:', error);
      Alert.alert('Error', 'Could not fetch route details');
    }
  };

  const decodePolyline = (encoded) => {
    if (!encoded) return [];
    const points = [];
    let index = 0, lat = 0, lng = 0;

    while (index < encoded.length) {
      let result = 1, shift = 0, b;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result += b << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      result = 1;
      shift = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result += b << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }
    return points;
  };

  const centerMapToFitRoute = () => {
    if (selectedMechanic && routeDetails) {
      mapViewRef.current?.fitToCoordinates(
        [
          userLocation,
          { latitude: selectedMechanic.latitude, longitude: selectedMechanic.longitude },
        ],
        { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: true }
      );
    }
  };

  useEffect(() => {
    if (routeDetails) centerMapToFitRoute();
  }, [routeDetails]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading mechanics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        <Marker coordinate={userLocation} title="Your Location" pinColor="blue" />

        {mechanics.map((mechanic) => (
          <Marker
            key={mechanic.id}
            coordinate={{
              latitude: mechanic.latitude,
              longitude: mechanic.longitude,
            }}
            pinColor={selectedMechanic?.id === mechanic.id ? 'green' : 'red'}
            onPress={() => {
              setSelectedMechanic(mechanic);
              fetchRouteDetails(mechanic);
            }}
          >
            <Callout>
  <View>
    <Text style={styles.mechanicName}>{mechanic.name || 'No Name Available'}</Text>
    <Text>{mechanic.address || 'No Address Available'}</Text>
  </View>
</Callout>
          </Marker>
        ))}

        {selectedMechanic && routeDetails && (
          <Polyline
            coordinates={decodePolyline(routeDetails.polyline)}
            strokeColor="blue"
            strokeWidth={4}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mechanicName: {
    fontWeight: 'bold',
  },
});

export default NearbyMechanicsMap;
