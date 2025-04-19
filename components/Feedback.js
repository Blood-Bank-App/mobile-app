import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  TextInput,
  Alert
} from 'react-native';

import firebase from '../database/firebase';

let addItem = item => {
  firebase.database().ref('/feedback').push({
    description: item
  });
};

export default class Feedback extends Component {
  state = {
    description: ''
  };

  handleChange = e => {
    this.setState({
      description: e.nativeEvent.text
    });
  };
  handleSubmit = () => {

    if(this.state.description=="")
    {
      Alert.alert('Textinput not empty');
   }
    else
    {
       addItem(this.state.description);
       Alert.alert('Feedback Submit successfully');
      }
   
  };

  render() {
    return (
      <View style={styles.main}>
        <Text style={styles.title}>Are you satisfied to use this App?</Text>
        <TextInput style={styles.itemInput}  
               multiline={true} 
               numberOfLines={4}
               placeholder="Type something about app"
               onChange={this.handleChange} />
               
        <TouchableHighlight
          style={styles.button}
          underlayColor="white"
          onPress={this.handleSubmit}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 30,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    marginBottom: 20,
    fontSize: 25,
    textAlign: 'center'
  },
  itemInput: {
    justifyContent: "flex-start",
    height: 130,
    padding: 4,
    marginRight: 5,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    color: 'black'
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    alignSelf: 'center'
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: '#b22222',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
    elevation:8
  }
});