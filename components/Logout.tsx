import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { auth } from "../database/firebase"; // adjust path as needed

interface LogoutProps {
  navigation: NativeStackNavigationProp<any>;
}

interface LogoutState {
  logout: string;
}

export default class Logout extends React.Component<LogoutProps, LogoutState> {
  constructor(props: LogoutProps) {
    super(props);
    this.state = {
      logout: "",
    };
  }

  logout = async () => {
    try {
      await auth.signOut();
      this.setState({ logout: "Logged out successfully" });
      this.props.navigation.navigate("Login");
    } catch (error) {
      console.error("Logout failed:", error);
      this.setState({ logout: "Logout failed" });
    }
  };

  render() {
    return (
      <View style={{ paddingTop: 50, alignItems: "center" }}>
        <TouchableOpacity onPress={this.logout} style={styles.button}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        <Text style={{ marginTop: 10 }}>{this.state.logout}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#b22222",
    borderRadius: 20,
    width: widthPercentageToDP(60),
    height: heightPercentageToDP(6),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    elevation: 6,
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },

  inputContainer: {
    borderBottomColor: "#47459E",
    borderBottomWidth: 1,
    width: widthPercentageToDP(80),
    height: heightPercentageToDP(5),
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  inputs: {
    height: heightPercentageToDP(5),
    marginLeft: 13,
  },
});
