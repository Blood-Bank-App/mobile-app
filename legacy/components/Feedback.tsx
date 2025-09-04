import React, { Component } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, TextInput, Button, Card, useTheme } from 'react-native-paper';
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
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Card style={styles.card}>
          <Card.Title title="We value your feedback" />
          <Card.Content>
            <Text style={styles.question}>
              Are you satisfied with using this App?
            </Text>

            <TextInput
              mode="outlined"
              label="Tell us more..."
              multiline
              numberOfLines={5}
              onChangeText={this.handleChange}
              placeholder="Type something about the app"
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={this.handleSubmit}
              style={styles.button}
              contentStyle={{ paddingVertical: 6 }}
            >
              Submit
            </Button>
          </Card.Content>
        </Card>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  card: {
    elevation: 4,
    borderRadius: 12,
    padding: 10,
  },
  question: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'white',
  },
  button: {
    alignSelf: 'center',
    width: '60%',
    borderRadius: 10,
  },
});