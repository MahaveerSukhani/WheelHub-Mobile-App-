import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Rating } from "react-native-ratings";
import Mechanic from "../../styles/Mechanic";
import car from "../../assets/images/car.png";
import bike from "../../assets/images/bike.png";
// import image from "../../assets/images/mech.jpg";

const HomeScreen = ({ navigation, user, item }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(false);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      loadProfileData();
    } else {
      Alert.alert("Error", "User is not authenticated.");
    }
  }, [currentUser]);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const name = data.name || "Unknown User";
        setUserProfile({ name });
      } else {
        Alert.alert("Error", "No profile data found.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSeeAll = () => {
    navigation.navigate("Find Mechanic");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/mech8.jpg")}
          style={styles.avatar}
        />
        <React.Fragment>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            <Text style={styles.heading}>
              Hey! {userProfile?.name || "Guest"}
            </Text>
          )}
        </React.Fragment>
        <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
          <Icon
            name="bell"
            size={24}
            color="#FF6347"
            style={styles.notificationIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#777" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.love}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.categories}
            showsHorizontalScrollIndicator={false}
          >
            {["Car", "Bike"].map((category, index) => (
              <TouchableOpacity
                key={index}
                onPress={handleSeeAll}
                // onPress={() => {
                  // console.log(`${category} category pressed`);
                  // navigation.navigate("MechanicList", { category });
                // }}
                style={[
                  styles.category,
                  {
                    backgroundColor: category === "Car" ? "#FF6347" : "#4682B4",
                  },
                ]}
              >
                <Image
                  source={category === "Car" ? car : bike}
                  style={styles.categoryImage}
                />
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Mechanics</Text>
            <TouchableOpacity onPress={handleSeeAll}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            contentContainerStyle={styles.mechanicList}
            showsHorizontalScrollIndicator={false}
          >
            {Mechanic.slice(0, 8).map((mechanic, index) => (
              <View key={index} style={styles.popularMechanicCard}>
                <Image
                  source={mechanic.image}
                  style={styles.popularMechanicImage}
                />
                <Text style={styles.popularMechanicName}>{mechanic.name}</Text>
                <Text style={styles.popularMechanicPhone}>
                  {mechanic.phoneNumber}
                </Text>
                <Rating
                  type="star"
                  ratingCount={5}
                  imageSize={15}
                  readonly
                  startingValue={mechanic.rating}
                  style={styles.ratingStars}
                />
              </View>
            ))}
          </ScrollView>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Mechanics</Text>
            <TouchableOpacity onPress={handleSeeAll}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            contentContainerStyle={styles.mechanicList}
            showsHorizontalScrollIndicator={false}
          >
            {Mechanic.map((mechanic, index) => (
              <View key={index} style={styles.featuredMechanicCard}>
                <Icon
                  name="heart"
                  size={18}
                  color="#FF6347"
                  style={styles.heartIcon}
                />
                <Text style={styles.featuredMechanicRating}>
                  ⭐ {mechanic.rating}
                </Text>
                <Image
                  source={mechanic.image}
                  style={styles.featuredMechanicImage}
                />
                <Text style={styles.featuredMechanicName}>{mechanic.name}</Text>
              </View>
            ))}
          </ScrollView>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    // paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#00796B",
    marginBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heading: {
    fontSize: 40,
  },
  avatar: {
    marginTop: 50,
    marginLeft: 20,
    marginBottom: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  heading: {
    marginTop: 50,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  notificationIcon: {
    marginRight: 20,
    marginBottom: 10,
    marginTop: 50,
    fontSize: 24,
    color: "#333",
  },
  searchContainer: {
    marginTop: 20,
  },
  love: {
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    marginLeft: 20,
    marginRight: 20,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  categories: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 15,
    elevation: 3,
    justifyContent: "space-between",
  },
  category: {
    width: "85%",
    height: 100,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  categoryImage: {
    width: 80,
    height: 60,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  section: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D2D2D",
  },
  seeAll: {
    fontSize: 14,
    color: "#2D9CDB",
  },
  mechanicList: {
    marginBottom: 20,
  },
  popularMechanicCard: {
    width: 200,
    marginRight: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  popularMechanicImage: {
    width: "100%",
    height: 130,
    marginBottom: 10,
    borderRadius: 15,
  },
  popularMechanicName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  popularMechanicPhone: {
    fontSize: 12,
    color: "#A1A1A1",
    textAlign: "center",
  },
  ratingStars: {
    marginTop: 5,
    marginBottom: 20,
  },
  featuredMechanicCard: {
    width: 180,
    marginRight: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  heartIcon: {
    position: "absolute",
    top: 5,
    left: 5,
    fontSize: 18,
    color: "#FF6347",
  },
  featuredMechanicRating: {
    position: "absolute",
    top: 5,
    right: 8,
  },
  featuredMechanicImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
  },
  featuredMechanicName: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});

export default HomeScreen;
