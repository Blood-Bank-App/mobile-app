

import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, StatusBar ,TextInput} from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, database } from '../database/firebase';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from "react-native-gesture-handler";

interface SignUpProps {
  navigation: NativeStackNavigationProp<any>;
}

interface SignUpState {
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

export default class SignUp extends Component<SignUpProps, SignUpState> {
  constructor(props: SignUpProps) {
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
        Password: cnic,
        City: city,
        Blood: blood,
        Phone: phone,
        Age: age,
        Gender: gender,
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

  render() {
    const { errorMessage } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#b22222" />
        <View style={styles.header}>
          <Text style={styles.headertext}>Sign Up</Text>
        </View>

        <ScrollView style={styles.scroldesign}>
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          {this.renderInput('user', 'Name', 'displayName')}
          {this.renderInput('at', 'Email', 'email', 'email-address')}
          {this.renderInput('heart', 'Blood Group', 'blood')}
          {this.renderInput('id-card', 'CNIC', 'cnic', 'numeric')}
          {this.renderInput('building', 'City', 'city')}
          {this.renderInput('phone', 'Phone', 'phone', 'numeric')}
          {this.renderInput('user-plus', 'Age', 'age', 'numeric')}
          {this.renderInput('male', 'Gender', 'gender')}
          {this.renderInput('lock', 'Password', 'password', undefined, true)}

          <TouchableOpacity onPress={this.registerUser} style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')} style={styles.fp}>
            <Text style={styles.txt}>Already Registered? Click here to login</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  renderInput = (
    icon: string,
    placeholder: string,
    stateKey: keyof SignUpState,
    keyboardType: 'default' | 'numeric' | 'email-address' = 'default',
    secureTextEntry = false
  ) => {
    return (
      <View style={styles.inputContainer}>
        <Icon style={{ marginLeft: 10 }} name={icon} color="black" size={21} />
        <TextInput
          style={styles.inputs}
          placeholder={placeholder}
          keyboardType={keyboardType}
          returnKeyType="next"
          secureTextEntry={secureTextEntry}
          onChangeText={(value) => this.setState({ [stateKey]: value } as Pick<SignUpState, keyof SignUpState>)}
        />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: heightPercentageToDP(100),
    width: widthPercentageToDP(100),
    
  },
  
  header:
  {
    height: heightPercentageToDP(30),
    width: widthPercentageToDP(100),
    backgroundColor:'#b22222',
    borderBottomLeftRadius:70,
    justifyContent:'center'
  },
  headertext:
  {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    marginStart:30
  },
  scroldesign:{
    height: heightPercentageToDP(70),
    width: widthPercentageToDP(100),
    backgroundColor:'#fff'
  },
  inputContainer: {
    borderBottomColor: '#b22222',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    width: widthPercentageToDP(80),
    height: heightPercentageToDP(5),
    flexDirection: 'row',
    alignItems:'center',
    marginTop:30
  },
  inputs:{
    height: heightPercentageToDP(5),
    marginLeft:13
  },
  loginText: {
    color: '#b22222',
    marginTop: 25,
    textAlign: 'center'
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  
  button: {
    backgroundColor: '#b22222',
    borderRadius:20,
    width: widthPercentageToDP(60),
    height: heightPercentageToDP(6),
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'center',
    marginTop:15,
    elevation:8,
    marginLeft:30
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    color: '#fff',
    fontWeight:'bold'
  },
  fp:
  {
    marginTop:25,
    justifyContent:'flex-end',
    color:'#47459E',
    fontSize:15,
    marginLeft:7
  },
  txt: {
    color: '#b22222',
    fontWeight: 'bold',
    fontSize:15
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});