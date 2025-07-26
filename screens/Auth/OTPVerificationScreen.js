import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

const OTPVerificationScreen = ({ route, navigation }) => {
  const { confirmation } = route.params;
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const verifyOTP = async () => {
    try {
      await confirmation.confirm(otp);
      // Navigate to reset password screen
      navigation.navigate('ResetPassword');
    } catch (error) {
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={verifyOTP}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
  button: { backgroundColor: '#28A745', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 16 },
  error: { color: 'red', marginTop: 10 },
});

export default OTPVerificationScreen;
