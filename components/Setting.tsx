import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "types";

type SettingNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Setting'>;
type SettingRouteProp = RouteProp<RootStackParamList, 'Setting'>;

interface SettingProps {
  navigation: SettingNavigationProp;
  route: SettingRouteProp;
}

interface SettingState {
  email: string;
}

export default class Setting extends React.Component<
  SettingProps,
  SettingState
> {
  constructor(props: SettingProps) {
    super(props);
    this.state = {
      email: "",
    };
  }

  render() {
    return (
      <View style={{ paddingTop: 50, alignItems: "center" }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate("ForgotPassword")}
        >
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
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
});
