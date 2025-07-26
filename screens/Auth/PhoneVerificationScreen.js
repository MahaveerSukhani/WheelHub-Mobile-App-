import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

const PhoneVerificationScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const sendOTP = async () => {
    if (!phoneNumber) {
      setError('Please enter your phone number');
      return;
    }

    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      navigation.navigate('OTPVerification', { confirmation });
    } catch (error) {
      setError('Failed to send OTP. Please check the number and try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Mobile Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={sendOTP}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
  button: { backgroundColor: '#007BFF', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 16 },
  error: { color: 'red', marginTop: 10 },
});

export default PhoneVerificationScreen;
