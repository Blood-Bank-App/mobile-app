import React from 'react';
import {
  Alert,
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Card, TextInput, Button, Text } from 'react-native-paper';
import { auth } from '../database/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ForgotPasswordProps {
  navigation: any; // If using React Navigation, you can use proper typing from @react-navigation/native
}

interface ForgotPasswordState {
  email: string;
  isLoading: boolean;
}

export default class ForgotPassword extends React.Component<
  ForgotPasswordProps,
  ForgotPasswordState
> {
  constructor(props: ForgotPasswordProps) {
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
      <View>
        <StatusBar barStyle="light-content" backgroundColor="#b22222" />

<Card style={{ margin: 16, padding: 16 }}>
  <Card.Content>
    <Text variant="headlineMedium" style={{ marginBottom: 20 }}>
      Forgot Password
    </Text>

    <Icon style={{ marginBottom: 10 }} name="at" color="black" size={21} />
    <TextInput
      mode="outlined"
      label="Email"
      value={email}
      onChangeText={(text) => this.setState({ email: text })}
      keyboardType="email-address"
      autoCapitalize="none"
      autoCorrect={false}
    />

    <Button
      mode="contained"
      onPress={this.onResetPasswordPress}
      disabled={isLoading}
      loading={isLoading}
      style={{ marginTop: 20 }}
    >
      {isLoading ? 'Sending...' : 'Reset Password'}
    </Button>
  </Card.Content>
</Card>
      </View>
    );
  }
}