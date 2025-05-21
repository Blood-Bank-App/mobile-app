import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  TextInput,
  Alert
} from 'react-native';
import { database } from '../database/firebase'; // Import the firebase configuration
import { ref, push } from 'firebase/database'; // Import required functions from Firebase

interface FeedbackState {
  description: string;
}

export default class Feedback extends Component<{}, FeedbackState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      description: '',
    };
  }

  // Function to handle input changes
  handleChange = (text: string) => {
    this.setState({ description: text });
  };


  // Function to submit feedback to Firebase
  handleSubmit = () => {
    const { description } = this.state;
    if (description === '') {
      Alert.alert('Error', 'Text input cannot be empty');
    } else {
      this.addItem(description);
      Alert.alert('Success', 'Feedback submitted successfully');
    }
  };

  // Firebase function to add item to the feedback collection
  addItem = (item: string) => {
    const feedbackRef = ref(database, '/feedback');
    push(feedbackRef, {
      description: item,
    }).catch((error) => {
      Alert.alert('Error', `Failed to submit feedback: ${error.message}`);
    });
  };

  render() {
    return (
      <View style={styles.main}>
        <Text style={styles.title}>Are you satisfied with using this App?</Text>
        <TextInput
          style={styles.itemInput}
          multiline={true}
          numberOfLines={4}
          placeholder="Type something about the app"
          onChange={this.handleChange}
        />

        <TouchableHighlight style={styles.button} underlayColor="white" onPress={this.handleSubmit}>
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