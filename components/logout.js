import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import {
    widthPercentageToDP,
    heightPercentageToDP,
  } from 'react-native-responsive-screen';

  export default class logout extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            logout: "",
        };
    }

   logout = () => {
    auth()
    .signOut();
    
    }


    render() {
        return (
            <View style={{paddingTop:50, alignItems:"center"}}>

          <TouchableOpacity onPress={this.logout} style={styles.button}>  
            <Text style={styles.buttonText}>Sending Request</Text>          
         </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#b22222',
        borderRadius:20,
        width: widthPercentageToDP(60),
        height: heightPercentageToDP(6),
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
        marginTop:25,
        elevation:6
      },
      buttonText: {
        fontSize: 20,
        textAlign: "center",
        color: '#fff',
        fontWeight:'bold'
      },
      
      inputContainer: {
        borderBottomColor: '#47459E',
        borderBottomWidth: 1,
        width: widthPercentageToDP(80),
        height: heightPercentageToDP(5),
        flexDirection: 'row',
        alignItems:'center',
        marginTop:20
      },
      inputs:{
        height: heightPercentageToDP(5),
        marginLeft:13
      }

});


