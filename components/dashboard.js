// components/dashboard.js

import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity,Image,StatusBar,Share} from 'react-native';
import { auth } from '../database/firebase';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
 

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      displayName:'',
      uid: '',
      email:'',
    
    }    
  }
  
  
  render() {
    this.state = { 
      uid: auth.currentUser?.uid || '',
      email: auth.currentUser?.email || ''
    }   
    const onShare = async () => {
      try {
        const result = await Share.share({
         title: 'Blood Bank',
    message: 'Please install blood bank and stay safe https://github.com/omaisahmed/bloodbank', 
    url: 'https://github.com/omaisahmed/bloodbank'
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        alert(error.message);
      }
    } 
    return (
      <View style={styles.container}>
        <Text style = {styles.textStyle}>
          Hello, {this.state.email}
        </Text>
        
        <View style={styles.containerButton}>
        <StatusBar barStyle="light-content" backgroundColor='#b22222' />
            <View style={styles.btncontainer1}>
                <TouchableOpacity style={styles.design} onPress={() => this.props.navigation.navigate("Findblooddonor")}>
                   <Image style={ styles.img} source={require('../assets/blood.png')}/>
                   <Text style={styles.Text}>Find Blood Donor</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.design} onPress={onShare}>
                   <Image style={ styles.img} source={require('../assets/sharing.png')}/>
                   <Text style={styles.Text}>Share</Text>
                </TouchableOpacity>

           </View>

           <View style={styles.btncontainer2}>
                <TouchableOpacity style={styles.design}  onPress={() => this.props.navigation.navigate("Userprofile")}>
                   <Image style={ styles.img} source={require('../assets/profile.png')}/>
                   <Text style={styles.Text}>User Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.design} onPress={() => this.props.navigation.navigate("Feedback")}>
                   <Image style={ styles.img} source={require('../assets/feedback.png')}/>
                   <Text style={styles.Text}>Feedback</Text>
                </TouchableOpacity>
           </View>
           <View style={styles.btncontainer3}>
                <TouchableOpacity style={styles.design} onPress={() => this.props.navigation.navigate("Setting")}>
                   <Image style={ styles.img} source={require('../assets/setting.png')}/>
                   <Text style={styles.Text}>Setting</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.design} onPress={() => this.props.navigation.navigate("Login")}>
                   <Image style={ styles.img} source={require('../assets/exit.png')}/>
                   <Text style={styles.Text}>Logout</Text>
                </TouchableOpacity>
           </View>
      </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#fff'
  },
  textStyle: {
    fontSize: 18,
    color:'#b22222'
    
    
  },
  design:{
    alignItems:'center',
    justifyContent:'center',
    height: heightPercentageToDP(15),
    width: widthPercentageToDP(40),
    backgroundColor:'#fff',
    borderRadius:14,
    elevation:10,
    justifyContent:'space-evenly',
    marginRight:15
  },
  img: {
    height:50,
    width:50
  },
  img: {
    height:50,
    width:50
  },
  containerButton:{
    flex:6,
    backgroundColor:'#fff'
    
  },
  btncontainer1:{
    flex:1,
    flexDirection:'row',
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:'space-evenly'
  },
  btncontainer2:{
    flex:1,
    flexDirection:'row',
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:"space-evenly"
  },
  btncontainer3:{
    flex:1,
    flexDirection:'row',
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:"space-evenly"
  }
  
 
});