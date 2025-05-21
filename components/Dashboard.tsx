// components/dashboard.js

import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Share,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { auth } from "../database/firebase";
import { RootStackParamList } from "types";


type DashboardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;
type DashboardRouteProp = RouteProp<RootStackParamList, 'Dashboard'>;

interface DashboardProps {
  navigation: DashboardNavigationProp;
  route: DashboardRouteProp;
}

interface DashboardState {
  displayName: string;
  uid: string;
  email: string;
}

export default class Dashboard extends Component<DashboardProps, DashboardState> {
  constructor(props: DashboardProps) {
    super(props);
    this.state = {
      displayName: '',
      uid: auth.currentUser?.uid || '',
      email: auth.currentUser?.email || '',
    };
  }

  onShare = async () => {
    try {
      const result = await Share.share({
        title: 'Blood Bank',
        message: 'Please install blood bank and stay safe https://github.com/omaisahmed/bloodbank',
        url: 'https://github.com/omaisahmed/bloodbank',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      // alert(error.message); Optional: handle error
    }
  };


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textStyle}>Hello, {this.state.email}</Text>

        <View style={styles.containerButton}>
          <StatusBar barStyle="light-content" backgroundColor="#b22222" />
          <View style={styles.btncontainer1}>
            <TouchableOpacity
              style={styles.design}
              onPress={() => this.props.navigation.navigate("FindBloodDonor")}
            >
              <Image
                style={styles.img}
                source={require("../assets/blood.png")}
              />
              <Text style={styles.Text}>Find Blood Donor</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.design} onPress={this.onShare}>
              <Image
                style={styles.img}
                source={require("../assets/sharing.png")}
              />
              <Text style={styles.Text}>Share</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.btncontainer2}>
            <TouchableOpacity
              style={styles.design}
              onPress={() => this.props.navigation.navigate("UserProfile")}
            >
              <Image
                style={styles.img}
                source={require("../assets/profile.png")}
              />
              <Text style={styles.Text}>User Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.design}
              onPress={() => this.props.navigation.navigate("Feedback")}
            >
              <Image
                style={styles.img}
                source={require("../assets/feedback.png")}
              />
              <Text style={styles.Text}>Feedback</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.btncontainer3}>
            <TouchableOpacity
              style={styles.design}
              onPress={() => this.props.navigation.navigate("Setting")}
            >
              <Image
                style={styles.img}
                source={require("../assets/setting.png")}
              />
              <Text style={styles.Text}>Setting</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.design}
              onPress={() => this.props.navigation.navigate("Login")}
            >
              <Image
                style={styles.img}
                source={require("../assets/exit.png")}
              />
              <Text style={styles.Text}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textStyle: {
    fontSize: 18,
    marginBottom: 20,
  },
  containerButton: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  btncontainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  btncontainer2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  btncontainer3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  design: {
    alignItems: 'center',
    margin: 10,
  },
  img: {
    width: 50,
    height: 50,
  },
  Text: {
    fontSize: 14,
    marginTop: 5,
  },
});