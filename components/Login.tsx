import React, { Component } from 'react';
import { View, Alert, StatusBar, ActivityIndicator } from 'react-native';
import { TextInput, Button, Text, IconButton } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../database/firebase';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'types';


type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
type LoginRouteProp = RouteProp<RootStackParamList, 'Login'>;

interface LoginProps {
  navigation: LoginNavigationProp;
  route: LoginRouteProp;
}

interface LoginState {
  email: string;
  password: string;
  isLoading: boolean;
  errorMessage?: string;
}

export default class Login extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      email: '',
      password: '',
      isLoading: false,
    };
  }

  updateInputVal = (val: string, prop: keyof LoginState) => {
    this.setState(prevState => ({
      ...prevState,
      [prop]: val,
    }));
  };

  userLogin = () => {
    const { email, password } = this.state;

    if (!email || !password) {
      Alert.alert('Error', 'Enter details to sign in!');
      return;
    }

    this.setState({ isLoading: true });

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        this.setState({ email: '', password: '', isLoading: false });
        Alert.alert('Success', 'Logged in successfully');
        this.props.navigation.navigate('Dashboard');
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        Alert.alert('Login Failed', "Invalid Credentials");
        // Alert.alert('Login Failed', error.message);
      });
  };


  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#fff', padding: 20 }}>
        <StatusBar barStyle="light-content" backgroundColor="#b22222" />
        
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 36, color: '#b22222', textAlign: 'center' }}>Blood App</Text>
          <Text style={{ fontSize: 18, color: '#b22222', textAlign: 'center', fontStyle: 'italic' }}>
            Here you donate blood
          </Text>
        </View>

        <View style={{ flex: 1, justifyContent: 'center' }}>
          {/* Email */}
          <TextInput
            label="Email"
            value={this.state.email}
            onChangeText={(val) => this.updateInputVal(val, 'email')}
            style={{ marginBottom: 20 }}
            keyboardType="email-address"
          />

          {/* Password */}
          <TextInput
            label="Password"
            value={this.state.password}
            onChangeText={(val) => this.updateInputVal(val, 'password')}
            style={{ marginBottom: 20 }}
            secureTextEntry
          />

          {/* Buttons */}
          <Button
            mode="contained"
            onPress={this.userLogin}
            loading={this.state.isLoading}
            disabled={this.state.isLoading}
            style={{ marginBottom: 10 }}
          >
            Login
          </Button>


          <Button mode="outlined" onPress={() => this.props.navigation.navigate('Signup')}>
            Sign Up
          </Button>

          <Text
            style={{
              marginTop: 10,
              color: '#b22222',
              textAlign: 'center',
              fontSize: 15,
            }}
            onPress={() => this.props.navigation.navigate('ForgotPassword')}
          >
            Forgot Your Password?
          </Text>
        </View>
      </View>
    );
  }
}
