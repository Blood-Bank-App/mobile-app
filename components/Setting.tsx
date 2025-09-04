import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { auth } from "../database/firebase"; // adjust import path as needed
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types"; // make sure this is your route type
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

type SettingNavigationProp = NativeStackNavigationProp<RootStackParamList, "Setting">;
type SettingRouteProp = RouteProp<RootStackParamList, "Setting">;

interface SettingProps {
  navigation: SettingNavigationProp;
  route: SettingRouteProp;
}

interface SettingState {
  email: string;
}

export default class Setting extends React.Component<SettingProps, SettingState> {
  constructor(props: SettingProps) {
    super(props);
    this.state = {
      email: "",
    };
  }

  componentDidMount() {
    const currentUser = auth.currentUser;
    if (currentUser) {
      this.setState({ email: currentUser.email || "" });
    }
  }

  openSupportEmail = () => {
    Linking.openURL("mailto:support@blooddonationapp.com?subject=Help Needed");
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.emailText}>
          Logged in as: {this.state.email}
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate("UserProfile")}
        >
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate("DonationHistory")}
        >
          <Text style={styles.buttonText}>My Donation History</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.button}
          onPress={this.openSupportEmail}
        >
          <Text style={styles.buttonText}>Contact Support</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#8B0000" }]}
          onPress={() => this.props.navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: hp(8),
    alignItems: "center",
    backgroundColor: "#fff",
  },
  emailText: {
    fontSize: 16,
    marginBottom: hp(2),
    color: "#333",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#b22222",
    borderRadius: 25,
    width: wp(70),
    height: hp(6),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: hp(1.5),
    elevation: 4,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});
