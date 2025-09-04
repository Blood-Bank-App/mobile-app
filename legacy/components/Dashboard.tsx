// components/dashboard.js

import React, { Component } from "react";
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  ScrollView,
  Share,
} from 'react-native';
import { Card, Text, Button } from 'react-native-paper';
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

  renderCard = (
    title: string,
    icon: any,
    onPress: () => void
  ) => (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.cardContent}>
        <Image source={icon} style={styles.icon} />
        <Text style={styles.cardTitle}>{title}</Text>
      </Card.Content>
    </Card>
  );


  render() {
    const { navigation } = this.props;

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#b22222" />
        <Text style={styles.greetingText}>Hello, {this.state.email}</Text>

        <View style={styles.cardRow}>
          {this.renderCard('Find Blood Donor', require('../assets/blood.png'), () =>
            navigation.navigate('FindBloodDonor')
          )}
          {this.renderCard('Request Blood', require('../assets/sharing.png'), () =>
            navigation.navigate('RequestBlood')
          )}
        </View>

        <View style={styles.cardRow}>
          {this.renderCard('User Profile', require('../assets/profile.png'), () =>
            navigation.navigate('UserProfile')
          )}
          {this.renderCard('Donation History', require('../assets/feedback.png'), () =>
            navigation.navigate('DonationHistory')
          )}
        </View>

        <View style={styles.cardRow}>
          {this.renderCard('Setting', require('../assets/setting.png'), () =>
            navigation.navigate('Setting')
          )}
          {this.renderCard('Logout', require('../assets/exit.png'), () =>
            navigation.navigate('Login')
          )}
        </View>
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  card: {
    width: '48%',
    elevation: 3,
    borderRadius: 10,
  },
  cardContent: {
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
});