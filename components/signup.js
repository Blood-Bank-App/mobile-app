

import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, StatusBar ,TextInput} from 'react-native';
import firebase from '../database/firebase';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from "react-native-gesture-handler";




export default class Signup extends Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      displayName: "",
      email: "", 
      blood: "", 
      cnic: "", 
      city: "", 
      gender: "", 
      phone: "", 
      age: "", 
      password: "",
      errtxt:""
      
    };
   
  }
  
  updatecity = (city) => {
    this.setState({ city: city })
   }
  registerUser =async  () => {
    const namecheck = /^[a-zA-Z ]+$/
    const phonecheck = /^[0]+[3]+[1|3|4|0|2]+[0-9 ]+$/
    const emailcheck = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const {  } = this.state;
  

    if(this.state.displayName.length != 0 && this.state.displayName != " ")
      { 
    if(this.state.displayName.match(namecheck))
    { 
    if(this.state.password.length != 0)
    {
     if(this.state.password.length > 6)
    {
    if(this.state.city != "Select a City" && this.state.city != 0 && this.state.city != null)                      
     {
      await firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
              
              firebase.database().ref('users/'+ res.user.uid).set(
                {
                  Email:this.state.email,
                  DisplayName: this.state.displayName,
                  Password: this.state.cnic,
                  City: this.state.city,
                  Blood:this.state.blood,
                  Phone:this.state.phone,
                  Age:this.state.age,
                  Gender:this.state.gender

              })
                    .then(() => {
                      Alert.alert('User registered successfully!')
                        this.props.navigation.navigate('Login')
                       
                    })
                    .catch((error) => {
                        alert(error.message)
                    })
        res.updateProfile({
          displayName: this.state.displayName
        })
        
      })
      .catch(error =>this.setState({
        errorMessage: error.message
     }) )
      
    } 
    else
    {
      this.setState({
        errtxt: "Select City"
      })
    }
  }
  else
  {
    this.setState({
   errtxt: "Weak Password",
    });
  }
}
else
{
  this.setState({
 errtxt: "Enter password",
  });
}
  }
  else
  {
   this.setState({
  errtxt: "Enter Correct Name",
   });
  }
}
else
{
 this.setState({
errtxt: "Enter the Name",
 });
}


  }

  render() {
        
    return (
      <View style={styles.container}>  
       <View style={styles.header}>  
       <Text style={styles.headertext}>Sign Up</Text>
      </View>
      <ScrollView alignItems={'center'} style={styles.scroldesign}>
      <StatusBar barStyle="light-content" backgroundColor='#b22222' />
      <View style={styles.inputContainer}>
          <Icon style={{ marginLeft: 10 }} name="user" color='black' size={21}/>
        <TextInput
          style={styles.inputs}
          placeholder="Name"
          returnKeyType="next"
          onChangeText={(displayName) => this.setState({displayName})}   
        
          
        />  
        </View>   
        <View style={styles.inputContainer}>
          <Icon style={{ marginLeft: 10 }} name="at" color='black' size={21}/> 
        <TextInput
          style={styles.inputs}
          keyboardType='email-address'
          placeholder="Email"
          returnKeyType="next"
          onChangeText={(email) => this.setState({email})}
        />
        </View>
        <View style={styles.inputContainer}>
          <Icon style={{ marginLeft: 10 }} name="heart" color='black' size={21}/>
        <TextInput
          style={styles.inputs}
          placeholder="Blood Group"
          returnKeyType="next"
          onChangeText={(blood) => this.setState({blood})}
        />
        </View>
        <View style={styles.inputContainer}>
          <Icon style={{ marginLeft: 10 }} name="id-card" color='black' size={21}/>
          <TextInput
          style={styles.inputs}
          keyboardType = 'numeric'
          placeholder="CNIC"
          returnKeyType="next"
          onChangeText={(cnic) => this.setState({cnic})}
        />
        </View>
        <View style={styles.inputContainer}>
          <Icon style={{ marginLeft: 10 }} name="building" color='black' size={21}/>
          <TextInput
          style={styles.inputs}
          placeholder="City"
          returnKeyType="next"
          onChangeText={(city) => this.setState({city})}
         
        />
        </View>
        <View style={styles.inputContainer}>
          <Icon style={{ marginLeft: 10 }} name="phone" color='black' size={21}/>
          <TextInput
          style={styles.inputs}
          keyboardType = 'numeric'
          placeholder="Phone"
          returnKeyType="next"
          onChangeText={(phone) => this.setState({phone})}
        />
        </View>
        <View style={styles.inputContainer}>
          <Icon style={{ marginLeft: 10 }} name="user-plus" color='black' size={21}/>
          <TextInput
          style={styles.inputs}
          keyboardType = 'numeric'
          placeholder="Age"
          returnKeyType="next"
          onChangeText={(age) => this.setState({age})}
        />
        </View>
        <View style={styles.inputContainer}>
          <Icon style={{ marginLeft: 10 }} name="male" color='black' size={21}/>
        <TextInput
          style={styles.inputs}
          placeholder="Gender"
          returnKeyType="next"
          onChangeText={(gender) => this.setState({gender})}
        />
        </View>
        <View style={styles.inputContainer}>
          <Icon style={{ marginLeft: 10 }} name="lock" color='black' size={21}/>
        <TextInput
          style={styles.inputs}
          placeholder="Password"
          returnKeyType="next"
          onChangeText={(password) => this.setState({password})}
          maxLength={15}
          secureTextEntry={true}
        />   
        </View>
        
        <TouchableOpacity onPress={this.registerUser} style={styles.button}>
        <Text style={styles.buttonText}>Signup</Text>          
        </TouchableOpacity>

        <TouchableOpacity style={styles.fp} onPress={()=>this.props.navigation.navigate("Login")}>
        <Text style={styles.txt}> Already Registered? Click here to login</Text>
        </TouchableOpacity>    

        </ScrollView>
      </View>
    );
  }
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
    justifyContent:'center',
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
  }
});