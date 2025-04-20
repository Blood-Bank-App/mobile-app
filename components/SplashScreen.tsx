import React, { Component } from "react";
import { View, Image, StatusBar } from "react-native";
import { Text, Surface } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

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
      <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <StatusBar barStyle="light-content" backgroundColor="#b22222" />

        {/* Header with logo */}
        <View style={{
          flex: 3,
          justifyContent: "center",
          alignItems: "center",
        }}>
          <Animatable.Image
            animation="bounceInUp"
            duration={500}
            source={require("../assets/logo.jpg")}
            style={{
              width: 180,
              height: 180,
              marginBottom: 80,
              borderRadius: 120,
            }}
          />
        </View>

        {/* Footer with title and subtitle */}
        <Animatable.View
          animation="fadeInUpBig"
          style={{
            flex: 2,
            backgroundColor: "#b22222",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingVertical: 30,
            paddingHorizontal: 30,
            justifyContent: 'center'
          }}
        >
          <Text variant="displayLarge" style={{ color: "#fff", fontWeight: "bold" }}>
            Blood Bank
          </Text>
          <Text variant="titleLarge" style={{ color: "#fff", fontWeight: "bold", marginTop: 10 }}>
            Here you donate blood
          </Text>
        </Animatable.View>
      </View>
    );
  }
}
