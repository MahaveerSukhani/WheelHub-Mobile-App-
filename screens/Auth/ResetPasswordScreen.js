import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

const ResetPasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetPassword = async () => {
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      const user = auth().currentUser;
      if (user) {
        await user.updatePassword(password);
        setSuccess('Password updated successfully!');
        navigation.navigate('Login');
      } else {
        setError('User not found.');
      }
    } catch (error) {
      setError('Failed to update password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter New Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={resetPassword}>
        <Text style={styles.buttonText}>Update Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5 },
  button: { backgroundColor: '#17A2B8', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#FFF', fontSize: 16 },
  error: { color: 'red', marginTop: 10 },
  success: { color: 'green', marginTop: 10 },
});

export default ResetPasswordScreen;
