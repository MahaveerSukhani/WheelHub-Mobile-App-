import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase'; 
import { doc, getDoc } from 'firebase/firestore'; 

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in both fields.');
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                navigation.navigate('Main'); 
                return;
            }

            const mechanicDoc = await getDoc(doc(db, 'mechanics', userId));
            if (mechanicDoc.exists()) {
                navigation.navigate('MechanicMain'); 
                return;
            }

            // If no role matches
            Alert.alert('Error', 'No matching user found.');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Welcome back</Text>

            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                style={styles.input}
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    style={styles.input}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.icon}>
                    <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} />
                </TouchableOpacity>
            </View>

            <Text
                style={styles.forgotPassword}
                onPress={() => navigation.navigate('ForgotPassword')}>
                Forgot password?
            </Text>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <Text style={styles.link}>
                Don’t have an account?{' '}
                <Text
                    onPress={() => navigation.navigate('Signup')}
                    style={styles.linkText}>
                    Join us
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#F5F7FA',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
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
    forgotPassword: {
        textAlign: 'right',
        color: '#00796B',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#00796B',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
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

export default LoginScreen;
