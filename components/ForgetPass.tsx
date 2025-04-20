import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { auth } from '../database/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ForgotPasswordScreenProps {
  navigation: any; // If using React Navigation, you can use proper typing from @react-navigation/native
}

interface ForgotPasswordScreenState {
  email: string;
  isLoading: boolean;
}

export default class ForgotPasswordScreen extends React.Component<
  ForgotPasswordScreenProps,
  ForgotPasswordScreenState
> {
  constructor(props: ForgotPasswordScreenProps) {
    super(props);
    this.state = {
      email: '',
      isLoading: false,
    };
  }

  onResetPasswordPress = async () => {
    const { email } = this.state;

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      this.setState({ isLoading: true });
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email has been sent.');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { email, isLoading } = this.state;

    return (
      <View style={{ paddingTop: 50, alignItems: 'center' }}>
        <StatusBar barStyle="light-content" backgroundColor="#b22222" />

        <View style={styles.inputContainer}>
          <Icon style={{ marginLeft: 10 }} name="at" color="black" size={21} />
          <TextInput
            style={styles.inputs}
            value={email}
            onChangeText={(text) => this.setState({ email: text })}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          onPress={this.onResetPasswordPress}
          style={styles.button}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Sending...' : 'Reset Password'}
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