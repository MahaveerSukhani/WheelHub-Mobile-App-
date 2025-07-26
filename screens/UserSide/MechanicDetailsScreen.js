import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  Button,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  getFirestore,
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import image from "../../assets/images/mech1.jpg";
import { Ionicons } from '@expo/vector-icons';

const MechanicDetailsScreen = () => {
  const [selectedTab, setSelectedTab] = useState("About");
  const [reviewText, setReviewText] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [mechanic, setMechanic] = useState(null);

  const navigation = useNavigation();
  const route = useRoute();
  const mechanicData = route.params?.mechanicData;

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    if (mechanicData) {
      setMechanic(mechanicData);
    }
  }, [mechanicData]);

  const handleBooking = () => {
    if (mechanic) {
      navigation.navigate("Appointment", {
        mechanicId: mechanic.id,
        mechanicName: mechanic.name,
      });
    } else {
      Alert.alert("Error", "Mechanic data is missing. Please try again.");
    }
  };


  const handleContactPress = () => {
    const phoneNumber = `tel:${mechanic.phoneNumber}`;
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneNumber);
        } else {
          Alert.alert('Error', 'Unable to open phone dialer.');
        }
      })
      .catch((err) => console.error('Error opening phone dialer:', err));
  };

  const handleSubmitReview = async () => {
    if (reviewText && userRating > 0) {
      try {
        const mechanicRef = doc(db, "ratings", mechanic.id);

        await updateDoc(mechanicRef, {
          reviews: arrayUnion({
            userId: auth.currentUser.uid,
            rating: userRating,
            reviewText: reviewText,
            timestamp: Timestamp.now(),
          }),
          rating:
            (mechanic.rating * mechanic.reviews + userRating) /
            (mechanic.reviews + 1),
          reviewsCount: mechanic.reviews + 1,
        });

        setMechanic((prevMechanic) => ({
          ...prevMechanic,
          reviews: prevMechanic.reviews + 1,
          rating:
            (prevMechanic.rating * prevMechanic.reviews + userRating) /
            (prevMechanic.reviews + 1),
        }));

        setReviewText("");
        setUserRating(0);
        Alert.alert("Success", "Your review has been submitted!");
      } catch (error) {
        Alert.alert(
          "Error",
          "Something went wrong while submitting your review."
        );
      }
    } else {
      Alert.alert("Error", "Please provide both a rating and review text.");
    }
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "About":
        return (
          <View style={{ padding: 16 }}>
            <Text style={styles.aboutTitle}>About</Text>
            <Text style={styles.aboutContent}>
              A mechanic is a skilled professional who specializes in inspecting,
              repairing, and maintaining vehicles, machinery, or equipment. They play
              a crucial role in ensuring the safety, efficiency, and longevity of
              automobiles and mechanical systems. Here are some key points about
              mechanics.
              <TouchableOpacity style={{ marginTop: 10, alignSelf: 'flex-start' }}>
                <Text
                  style={{
                    color: '#44C2B7',
                    fontWeight: 'bold',
                    textDecorationLine: 'underline',
                    fontSize: 14,
                  }}
                >
                  Read more
                </Text>
              </TouchableOpacity>
            </Text>
            <Text style={[styles.aboutTitle, { marginTop: 10 }]}>Contact</Text>
            <TouchableOpacity
              style={styles.contactContainer}
              onPress={handleContactPress}
            >
              <Ionicons name="call-outline" size={20} color="#44C2B7" />
              <Text style={styles.contactText}>{mechanic.phoneNumber}</Text>
            </TouchableOpacity>
          </View>
        );
      case "Services":
        return (
          <View>
            {mechanic?.services?.map((service, index) => (
              <Text key={index}>{service}</Text>
            ))}
          </View>
        );
      case "Reviews":
        return (
          <View>
            {mechanic?.reviews?.map((review, index) => (
              <View key={index} style={styles.reviewItem}>
                <Text style={styles.reviewUser}>{review.userId}</Text>
                <Text>{review.rating} Stars</Text>
                <Text>{review.reviewText}</Text>
              </View>
            ))}
            <View style={styles.reviewInputContainer}>
              <View style={styles.ratingContainer}>
                <Text style={styles.reviewLabel}></Text>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    onPress={() => setUserRating(rating)}
                  >
                    <FontAwesome
                      name="star"
                      size={25}
                      color={userRating >= rating ? "#FFAB40" : "#ccc"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.line}>
                <TextInput
                  style={styles.reviewInput}
                  placeholder="Write your review"
                  value={reviewText}
                  onChangeText={setReviewText}
                />
                <Button title="Submit" onPress={handleSubmitReview} />
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  if (!mechanic) {
    return (
      <View style={styles.centeredView}>
        <Text>No mechanic data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image
            source={ image }
            style={styles.headerImage}
          />
        </View>
        <View style={styles.mainContent}>
          <View style={styles.ratingContainers}>
            <FontAwesome name="star" size={16} color="#FFAB40" />
            {/* <Text style={styles.rating}>
              {mechanic.rating} ({mechanic.reviews} reviews)
            </Text> */}
          </View>
          <Text style={styles.name}>{mechanic.name}</Text>
          <Text style={styles.address}>{mechanic.address}</Text>

          <View style={styles.tabContainer}>
            {["About", "Services", "Reviews"].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, selectedTab === tab && styles.activeTab]}
                onPress={() => setSelectedTab(tab)}
              >
                <Text style={styles.tabText}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View
              style={{
                marginTop: 15,
                borderBottomWidth: 1,
                borderBottomColor: "#ddd",
              }}
            />
          <View style={styles.tabContent}>{renderTabContent()}</View>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  header: {
    height: 200,
    margin: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  mainContent: {
    backgroundColor: "#fff",
    padding: 20,
    flex: 1,
    margin: 20,
    borderRadius: 20,
    height: 480,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginTop: 50
  },
  ratingContainers: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  rating: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFAB40",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  address: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  tab: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  activeTab: {
    tabBarActiveTintColor: "#44C2B7",
    tabBarInactiveTintColor: "#888",
    borderBottomWidth: 3,
    borderBottomColor: "#44C2B7",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#44C2B7",
  },
  tabContent: {
    marginVertical: 20,
  },
  reviewItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  reviewUser: {
    fontWeight: "bold",
    color: "#333",
  },
  reviewInputContainer: {
    marginTop: 20,
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  reviewInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  aboutContent: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  contactText: {
    color: '#44C2B7',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 14,
    marginLeft: 8, 
  },
  bookButton: {
    backgroundColor: "#00796B",
    paddingVertical: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default MechanicDetailsScreen;
