import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isMechanic, setIsMechanic] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !name) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true); 

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid; 
      const userRole = isMechanic ? 'mechanic' : 'user';

      await setDoc(doc(db, userRole === 'mechanic' ? 'mechanics' : 'users', userId), {
        name,
        email,
        role: userRole,
        createdAt: new Date().toISOString(),
      });

      console.log(`${userRole} added to Firestore successfully!`);
      Alert.alert('Success', `Signup successful! You are registered as a ${userRole}.`);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error during signup:', error.message);
      Alert.alert('Signup Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Join Us</Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        style={styles.input}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={!showPassword}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
          <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm Password"
          secureTextEntry={!showPassword}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
          <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.roleToggle, isMechanic && styles.roleToggleActive]}
        onPress={() => setIsMechanic(!isMechanic)}
      >
        <Text style={styles.roleToggleText}>
          {isMechanic ? 'Signing up as Mechanic' : 'Signing up as User'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.signupButtonText}>Sign Up</Text>}
      </TouchableOpacity>

      <Text style={styles.link}>
        Already have an account?{' '}
        <Text onPress={() => navigation.navigate('Login')} style={styles.linkText}>
          Log in
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
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
  input: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 14,
    borderColor: '#00796B',
    borderWidth: 1,
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  icon: {
    position: 'absolute',
    right: 15,
    top: 12,
  },
  roleToggle: {
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    marginBottom: 15,
  },
  roleToggleActive: {
    backgroundColor: '#FFD700',
  },
  roleToggleText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupButton: {
    backgroundColor: '#00796B',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  signupButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
    color: '#555',
    marginTop: 15,
  },
  linkText: {
    color: '#00796B',
    fontWeight: '600',
  },
});

export default SignupScreen;
