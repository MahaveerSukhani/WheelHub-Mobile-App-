import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AntDesign from '@expo/vector-icons/AntDesign';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // const [workingHoursFrom, setWorkingHoursFrom] = useState('');
  // const [workingHoursTo, setWorkingHoursTo] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  // const [experience, setExperience] = useState('');
  const [image, setImage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      loadProfileData();
    }

    requestPermissions();
  }, [currentUser]);

  const requestPermissions = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPermission.status !== 'granted' || galleryPermission.status !== 'granted') {
      Alert.alert('Permissions Required', 'Camera and Gallery permissions are required to proceed.');
    }
  };

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || '');
        setEmail(data.email || '');
        // setWorkingHoursFrom(data.workingHoursFrom || '');
        // setWorkingHoursTo(data.workingHoursTo || '');
        setAddress(data.address || '');
        setPhoneNumber(data.phoneNumber || '');
        // setExperience(data.experience || '');
        setImage(data.image || null);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    // if (!workingHoursFrom.trim()) newErrors.workingHoursFrom = 'Start time is required.';
    // if (!workingHoursTo.trim()) newErrors.workingHoursTo = 'End time is required.';
    if (!address.trim()) newErrors.address = 'Workshop address is required.';
    if (!/^\d{10,14}$/.test(phoneNumber)) newErrors.phoneNumber = 'Enter a valid phone number.';
    // if (!/^\d+$/.test(experience) || experience <= 0)
    //   newErrors.experience = 'Experience should be a positive number.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const userProfile = {
        name,
        email,
        // workingHoursFrom,
        // workingHoursTo,
        address,
        phoneNumber,
        // experience,
        image,
      };

      const docRef = doc(db, 'users', currentUser.uid);
      await setDoc(docRef, userProfile);

      if (currentUser.displayName !== name) {
        await updateProfile(currentUser, { displayName: name });
      }

      Alert.alert('Success', 'Profile updated successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open the camera.');
    } finally {
      setShowUploadModal(false);
    }
  };

  const openGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open the gallery.');
    } finally {
      setShowUploadModal(false);
    }
  };

  const removeImage = () => {
    setImage(null);
    setShowUploadModal(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.field}>
        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={() => setShowUploadModal(true)}
            style={styles.imageContainer}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Icon name="camera" size={40} color="#B0B0B0" />
            )}
          </TouchableOpacity>
          <Text style={styles.imageText}>Tap to upload image</Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Full Name"
            style={[styles.input, errors.name && styles.inputError]}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <TextInput
            value={email}
            editable={false}
            placeholder="Email Address"
            style={[styles.input, styles.disabled]}
          />

          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Workshop Address"
            style={[styles.input, errors.address && styles.inputError]}
          />
          {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Phone Number"
            style={[styles.input, errors.phoneNumber && styles.inputError]}
            keyboardType="phone-pad"
          />
          {errors.phoneNumber && (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          )}

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={showUploadModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.crossIcon}>
              <TouchableOpacity onPress={() => setShowUploadModal(false)}>
                <Entypo name="cross" size={20} color="black" />
              </TouchableOpacity>
            </View>
            <Text style={styles.headerText}>Cover Image</Text>

            <View style={styles.optionsWrapper}>
              <TouchableOpacity style={styles.option} onPress={openCamera}>
                <Entypo name="camera" size={24} color="#075985" />
                <Text style={styles.optionText}>Camera</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.option} onPress={openGallery}>
                <FontAwesome name="photo" size={24} color="#075985" />
                <Text style={styles.optionText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.option} onPress={removeImage}>
                <AntDesign name="delete" size={24} color="#F43F5E" />
                <Text style={[styles.optionText, { color: "#F43F5E" }]}>
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#F5F7FA' },
  header: {
    backgroundColor: '#00796B',
    height: 100,
    width: '100%',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 30,
  },
  field: {
    margin: 20,
  },
  inputContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EDEDED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageText: {
    textAlign: 'center',
    color: '#A0A0A0',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  disabled: {
    backgroundColor: '#F5F5F5',
  },
  inputError: {
    borderColor: '#F44336',
  },
  errorText: {
    fontSize: 12,
    color: '#F44336',
    marginBottom: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInput: {
    width: '48%',
  },
  button: {
    backgroundColor: '#00796B',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFF',
    width: '80%',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  crossIcon: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#075985',
    marginBottom: 16,
  },
  optionsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  option: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  optionText: {
    fontSize: 14,
    color: '#374151',
    marginTop: 8,
  },
});

export default ProfileScreen;
