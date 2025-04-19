import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { auth } from '../database/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class ForgotPasswordScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      email: "",
      isLoading: false
    };
  }

  onResetPasswordPress = async () => {
    if (!this.state.email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    try {
      this.setState({ isLoading: true });
      await sendPasswordResetEmail(auth, this.state.email);
      Alert.alert("Success", "Password reset email has been sent.");
      this.setState({ isLoading: false });
    } catch (error) {
      this.setState({ isLoading: false });
      Alert.alert("Error", error.message);
    }
  }

  render() {
    return (
      <View style={{paddingTop:50, alignItems:"center"}}>
        <StatusBar barStyle="light-content" backgroundColor='#b22222' />
        <View style={styles.inputContainer}>
          <Icon style={{ marginLeft: 10 }} name="at" color='black' size={21}/>
          <TextInput 
            style={[styles.inputs]}
            value={this.state.email}
            onChangeText={(text) => { this.setState({email: text}) }}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <TouchableOpacity 
          onPress={this.onResetPasswordPress} 
          style={styles.button}
          disabled={this.state.isLoading}
        >  
          <Text style={styles.buttonText}>
            {this.state.isLoading ? "Sending..." : "Reset Password"}
          </Text>          
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#b22222',
    borderRadius: 20,
    width: widthPercentageToDP(60),
    height: heightPercentageToDP(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    elevation: 6
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    color: '#fff',
    fontWeight: 'bold'
  },
  inputContainer: {
    borderBottomColor: '#47459E',
    borderBottomWidth: 1,
    width: widthPercentageToDP(80),
    height: heightPercentageToDP(5),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20
  },
  inputs: {
    height: heightPercentageToDP(5),
    marginLeft: 13,
    flex: 1
  }
});