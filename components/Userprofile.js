// components/dashboard.js

import React, { Component,useState } from 'react';
import { StyleSheet, View, TextInput,TouchableOpacity,Text,TouchableHighlight,Image,StatusBar } from 'react-native';
import firebase from '../database/firebase';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';

export default class Userprofile extends Component {
 
  constructor(props) {
    super(props);
    this.state = { 
      DisplayName:'',
      City:'',
      Age:'',
      Blood:'',
      Phone:'',
      Gender:''
    }  
    
    
    firebase.database().ref('users/' +  firebase.auth().currentUser.uid).on('value', (snapshot) => 
    {
      let displayname = snapshot.val().DisplayName;
      let city = snapshot.val().City;
      let age = snapshot.val().Age;
      let blood = snapshot.val().Blood;
      let phone = snapshot.val().Phone;
      let gender = snapshot.val().Gender;
      this.setState({displayname,phone,city,age,blood,gender});

    
    
    });
  }
    // updateUserData = () => {
    //  if(this.state.DisplayName==null){
    //   firebase.database().ref('users/' + firebase.auth().currentUser.uid).update({
    //     DisplayName:this.state.DisplayName,
    //     City: this.state.City,
    //     Blood:this.state.Blood,
    //     Gender: this.state.Gender,
    //     Phone:this.state.Phone,
    //     Age:this.state.Age

       
    //   }) 
    // }
      
    // }
  
  render() {
    
    return (
      <View >
         <StatusBar barStyle="light-content" backgroundColor='#b22222' />
      <TouchableHighlight
          style={[styles.profileImgContainer]}
        >
      <Image source={require('../assets/man.jpeg')} style={styles.profileImg} />
           </TouchableHighlight>
        <View style={styles.inputContainer}>
        <TextInput style={styles.input} >
         {this.state.displayname} </TextInput>
        </View>

        <View style={styles.Container1}>
         <TextInput style={styles.input}>
         {this.state.city} </TextInput>
         </View>

         <View style={styles.Container2}>
         <TextInput style={styles.input}>
         {this.state.blood} </TextInput>
         </View>

         <View style={styles.Container2}>
         <TextInput style={styles.input}>
         {this.state.gender} </TextInput>
         </View>

         <View style={styles.Container2}>
         <TextInput style={styles.input}>
         {this.state.phone} </TextInput>
         </View>

         {/* <View center style={styles.button}>
                  <TouchableOpacity >
                    <Text style={styles.buttonText}>
                     Update Profile
                    </Text>
                  </TouchableOpacity>
                </View> */}
        
      </View>
     

    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomColor: '#b22222',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    width: widthPercentageToDP(80),
    height: heightPercentageToDP(6),
    flexDirection: 'row',
    alignItems:'center',
    marginTop:30,
    marginLeft:25,
    borderRadius:15
  },
  Container: {
    borderBottomColor: '#b22222',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    width: widthPercentageToDP(80),
    height: heightPercentageToDP(5),
    flexDirection: 'row',
    alignItems:'center',
    marginTop:10,
    marginLeft:25,
    borderRadius:15
    
  },
  Container1: {
    borderBottomColor: '#b22222',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    width: widthPercentageToDP(80),
    height: heightPercentageToDP(6),
    flexDirection: 'row',
    alignItems:'center',
    marginLeft:25,
    marginTop:15,
    borderRadius:15
   
  },
  Container2: {
    borderBottomColor: '#b22222',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    width: widthPercentageToDP(80),
    height: heightPercentageToDP(6),
    flexDirection: 'row',
    alignItems:'center',
    marginLeft:25,
    marginTop:20,
    borderRadius:15,
    borderRadius:15
  },
  input:{
    height: heightPercentageToDP(5),
    marginLeft:13,
    
  },
  inputs:{
    height: heightPercentageToDP(5),
    marginLeft:13
  },
  button: {
    backgroundColor: '#b22222',
    borderRadius:20,
    width: widthPercentageToDP(60),
    height: heightPercentageToDP(6),
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'center',
    marginTop:40,
    elevation:8,
    marginLeft:55
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    color: '#fff',
    fontWeight:'bold'
  },
  profileImgContainer: {
    alignItems:'center',
    justifyContent:'center',
    marginLeft: 130,
    height: 80,
    width: 80,
    borderRadius: 40,
    elevation:15,
    marginTop:25
  },
  profileImg: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
 
});