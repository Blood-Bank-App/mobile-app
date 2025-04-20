import React, { Component } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Image,
  StatusBar,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Define your navigation stack types
type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
};

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;
type SplashScreenRouteProp = RouteProp<RootStackParamList, 'Splash'>;

type Props = {
  navigation: SplashScreenNavigationProp;
  route: SplashScreenRouteProp;
};

export default class Splash extends Component<Props> {
  async componentDidMount() {
    const data = await this.navigateToHome();
    if (data !== null) {
      this.props.navigation.navigate('Login');
    }
  }

  navigateToHome = async (): Promise<void> => {
    const wait = (time: number): Promise<void> =>
      new Promise((resolve) => setTimeout(resolve, time));
    await wait(3000);
    this.props.navigation.navigate('Login');
  };

  render() {
    return (
      <View style={styles.Splashcontainer}>
        <StatusBar barStyle="light-content" backgroundColor="#b22222" />
        <View style={styles.header}>
          <Animatable.Image
            animation="bounceInUp"
            duration={500}
            source={require("../assets/logo.jpg")}
            style={styles.logo}
          />
        </View>
        <Animatable.View style={styles.footer} animation="fadeInUpBig">
          <Text style={styles.title}>Blood Bank</Text>
          <Text style={styles.text}>Here you donate blood</Text>
        </Animatable.View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  Splashcontainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 80,
    borderRadius: 120,
  },
  footer: {
    flex: 2,
    backgroundColor: "#b22222",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 30,
  },

  title: {
    color: "#fff",
    fontSize: 50,
    fontWeight: "bold",
  },
  text: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
