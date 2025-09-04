

import React, { Component } from 'react';
import { Alert, StatusBar, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { Surface } from 'react-native-paper';
import { Menu, TextInput, Button } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from "firebase/database";
import { auth, database } from '../database/firebase';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'types';


type SignupNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signup'>;
type SignupRouteProp = RouteProp<RootStackParamList, 'Signup'>;

interface SignupProps {
  navigation: SignupNavigationProp;
  route: SignupRouteProp;
}

interface SignupState {
  displayName: string;
  blood: string;
  cnic: string;
  city: string;
  gender: string;
  phone: string;
  age: string;
  email: string;
  password: string;
  errorMessage?: string;
}

export default class Signup extends Component<SignupProps, SignupState> {
  constructor(props: SignupProps) {
    super(props);
    this.state = {
      displayName: '',
      email: '',
      blood: '',
      cnic: '',
      city: '',
      gender: '',
      phone: '',
      age: '',
      password: '',
      errorMessage: ''
    };
  }

  validateFields = (): string | null => {
    const { displayName, email, password, city } = this.state;
    const namePattern = /^[a-zA-Z ]+$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!displayName.trim()) return 'Name is required';
    if (!namePattern.test(displayName)) return 'Enter a valid name';
    if (!email.trim()) return 'Email is required';
    if (!emailPattern.test(email)) return 'Enter a valid email address';
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (!city || city === 'Select a City') return 'Select a valid city';

    return null;
  };

  registerUser = async () => {
    const error = this.validateFields();
    if (error) {
      this.setState({ errorMessage: error });
      return;
    }

    const { email, password, displayName, city, blood, phone, age, gender, cnic } = this.state;

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      await set(ref(database, 'users/' + res.user.uid), {
        Email: email,
        DisplayName: displayName,
        CNIC: cnic,
        City: city,
        Blood: blood,
        Phone: phone,
        Age: age,
        Gender: gender,
        availability: false,
      });

      await updateProfile(res.user, {
        displayName,
      });

      Alert.alert('User registered successfully!');
      this.props.navigation.navigate('Login');
    } catch (error: any) {
      this.setState({ errorMessage: error.message });
    }
  };

  renderInput = (
    label: string,
    stateKey: keyof SignupState,
    keyboardType: 'default' | 'numeric' | 'email-address' = 'default',
    secureTextEntry = false
  ) => {
    return (
      <TextInput
        label={label}
        mode="outlined"
        style={{ marginBottom: 16 }}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        value={this.state[stateKey]}
        onChangeText={(text) => this.setState({ [stateKey]: text } as any)}
      />
    );
  };

  renderDropdown = (
    label: string,
    stateKey: keyof SignupState,
    options: string[],
  ) => {
    const value = this.state[stateKey] as string;
  
    return (
      <View style={{ marginBottom: 16 }}>
        <Dropdown
          label={label}
          placeholder={`Select ${label}`}
          options={options.map((option) => ({
            label: option,
            value: option,
            key: option,
          }))}
          value={value}
          onSelect={(val?: string) => {
            this.setState({
              [stateKey]: val ?? '',
            } as Pick<SignupState, keyof SignupState>);
          }}
        />
      </View>
    );
  };
  

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar barStyle="light-content" backgroundColor="#b22222" />

        {/* Header */}
        <View style={{
          height: '30%',
          backgroundColor: '#b22222',
          borderBottomLeftRadius: 70,
          justifyContent: 'center',
          paddingLeft: 30
        }}>
          <Text style={{ color: '#fff', fontSize: 40, fontWeight: 'bold' }}>Sign Up</Text>
        </View>

        {/* Form */}
        <Surface style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
          <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
            <Button
              mode="contained"
              onPress={() => this.props.navigation.navigate('PhoneAuth')}
              style={{ marginBottom: 16, borderRadius: 12, backgroundColor: '#b22222' }}
            >
              Continue with Phone (OTP)
            </Button>

            <Text style={{ textAlign: 'center', marginBottom: 12, color: '#666' }}>or sign up with email</Text>
            {this.state.errorMessage && (
              <Text style={{ color: 'red', marginBottom: 16 }}>{this.state.errorMessage}</Text>
            )}

            {this.renderInput('Name', 'displayName')}
            {this.renderInput('Email', 'email', 'email-address')}
            {this.renderDropdown('Blood Group', 'blood', ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])}
            {this.renderInput('CNIC', 'cnic', 'numeric')}
            {this.renderInput('City', 'city')}
            {this.renderInput('Phone', 'phone', 'numeric')}
            {this.renderInput('Age', 'age', 'numeric')}
            {this.renderDropdown('Gender', 'gender', ['Male', 'Female', 'Other'])}
            {this.renderInput('Password', 'password', 'default', true)}

            <Button
              mode="contained"
              onPress={this.registerUser}
              style={{ marginTop: 20, borderRadius: 20, backgroundColor: '#b22222' }}
              contentStyle={{ height: 50, justifyContent: 'center' }}
              labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
            >
              Sign Up
            </Button>

            <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')} style={{ marginTop: 25 }}>
              <Text style={{
              marginTop: 10,
              color: '#b22222',
              textAlign: 'center',
              fontSize: 15,
            }}>
                Already Registered? Click here to login
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Surface>
      </View>
    );
  }
}