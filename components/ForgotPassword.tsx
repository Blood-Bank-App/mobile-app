import React from 'react';
import {
  Alert,
  View,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
} from 'react-native';
import { Card, TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { auth } from '../database/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RootStackParamList } from 'types';


interface ForgotPasswordProps {}
interface ForgotPasswordState {
  email: string;
  isLoading: boolean;
  snackbarVisible: boolean;
  snackbarMessage: string;
  snackbarType: "success" | "error";
}

export default class ForgotPassword extends React.Component<
  ForgotPasswordProps,
  ForgotPasswordState
> {
  constructor(props: ForgotPasswordProps) {
    super(props);
    this.state = {
      email: "",
      isLoading: false,
      snackbarVisible: false,
      snackbarMessage: "",
      snackbarType: "success",
    };
  }

  showSnackbar = (message: string, type: "success" | "error") => {
    this.setState({
      snackbarVisible: true,
      snackbarMessage: message,
      snackbarType: type,
    });
  };

  onDismissSnackbar = () => {
    this.setState({ snackbarVisible: false });
  };

  onResetPasswordPress = async () => {
    const { email } = this.state;

    if (!email.trim()) {
      this.showSnackbar("Please enter your email address", "error");
      return;
    }

    try {
      this.setState({ isLoading: true });
      await sendPasswordResetEmail(auth, email);
      this.showSnackbar("Password reset email has been sent.", "success");
    } catch (error: any) {
      this.showSnackbar(error.message || "Something went wrong", "error");
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const {
      email,
      isLoading,
      snackbarVisible,
      snackbarMessage,
      snackbarType,
    } = this.state;

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor="#b22222" />

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.title}>
              Forgot Password
            </Text>

            <Icon name="email-outline" color="black" size={20} style={styles.icon} />

            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={(text) => this.setState({ email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={this.onResetPasswordPress}
              disabled={isLoading}
              loading={isLoading}
              style={styles.button}
            >
              {isLoading ? "Sending..." : "Reset Password"}
            </Button>
          </Card.Content>
        </Card>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={this.onDismissSnackbar}
          duration={3000}
          style={{
            backgroundColor: snackbarType === "success" ? "#4CAF50" : "#f44336",
          }}
        >
          {snackbarMessage}
        </Snackbar>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    padding: 16,
    borderRadius: 12,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  icon: {
    marginBottom: 10,
    alignSelf: "center",
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#b22222",
  },
});