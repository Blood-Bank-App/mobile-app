// components/login.js

import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator,StatusBar } from 'react-native';
import {auth} from '../database/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';



export default class Login extends Component {
  
  constructor() {
    super();
    this.state = { 
      email: '', 
      password: '',
      isLoading: false
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }
  

  
  userLogin = () => {
    if (this.state.email === '' && this.state.password === '') {
      Alert.alert('Enter details to sign in!');
    } else {
      this.setState({ isLoading: true });
  
      signInWithEmailAndPassword(auth, this.state.email, this.state.password)
        .then((res) => {
          console.log(res);
          console.log('User logged-in successfully!');
          this.setState({
            isLoading: false,
            email: '',
            password: '',
          });
          this.props.navigation.navigate('Dashboard');
        })
        .catch((error) => {
          this.setState(
            {
              isLoading: false,
              errorMessage: error.message,
            },
            () => {
              alert(this.state.errorMessage);
            }
          );
        });
    }
  };

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      )
    }    
    return (
      <View style={styles.container}>  
       <StatusBar barStyle="light-content" backgroundColor='#b22222' />
      <View style={styles.h}>    
         <Text style={styles.header}>Blood App</Text>
         <Text style={styles.header1}>Here you donate blood</Text>   
        </View>
        
        <View style={styles.footer}>
        <View style={styles.inputContainer}>
           <Icon style={{ marginLeft: 10 }} name="at" color='black' size={21}/>
        <TextInput
          style={styles.inputs}
          placeholder="Email"
          value={this.state.email}
          onChangeText={(val) => this.updateInputVal(val, 'email')}
        />
        </View>
        
        <View style={styles.inputContainer}>
         <Icon style={{ marginLeft: 12 }} name="lock" color='black' size={21}/>
        <TextInput
          style={styles.inputs}
          placeholder="Password"
          value={this.state.password}
          onChangeText={(val) => this.updateInputVal(val, 'password')}
          maxLength={15}
          secureTextEntry={true}
        />   
        </View>
       
        <View style={styles.button}>
               <TouchableOpacity style={styles.signIn} onPress={()=>this.userLogin()}>
                       <Text style={styles.textSign}>Login</Text>           
              </TouchableOpacity>
               </View> 
   
            
               <View style={styles.button2}>
               <TouchableOpacity  style={styles.signIn} onPress={()=>this.props.navigation.navigate("Signup")}>
                       <Text style={styles.textSign}>Sign Up</Text>    
               </TouchableOpacity>
               </View>
               <TouchableOpacity style={styles.fp} onPress={()=>this.props.navigation.navigate("Forgetpass")}>
               <Text style={styles.txt}>Forgot Your Password?</Text>
               </TouchableOpacity>                
             </View>      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#fff'
  },
  inputs: {
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
  inputContainer: {
    borderBottomColor: '#b22222',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    width: widthPercentageToDP(80),
    height: heightPercentageToDP(5),
    flexDirection: 'row',
    alignItems:'center',
    marginTop:20
    },
  h:{
    flex:3,
    backgroundColor:'#b22222',
    borderBottomLeftRadius:80,
    justifyContent:'center'
  },
  header:{
    fontSize:65,
    color:'#fff',
    marginStart:30
  
  },
  header1:{
    fontSize:20,
    color:'#fff',
    marginStart:30,
    fontStyle:'italic'
  },
  button: {
    alignItems: 'center',
    marginTop: 25
  },
  button2: {
  alignItems: 'center',
  marginTop: 5
  },
  signIn: { 
    height: heightPercentageToDP(6),
    width: widthPercentageToDP(60),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    backgroundColor:'#b22222',
  },
  textSign: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize:18
  },
  fp:
{
  marginTop:8,
  justifyContent:'flex-end',
  color:'#47459E',
  fontSize:15
},
txt: {
  color: '#b22222',
  fontWeight: 'bold',
  fontSize:15
},
footer:{
  flex:5,
  justifyContent:'center',
  alignItems:'center',
  backgroundColor:'#fff'
}
});