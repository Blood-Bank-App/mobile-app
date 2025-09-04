import React, { Component } from 'react';
import { View, FlatList, StatusBar, Linking, Platform } from "react-native";
import { Text, Card, Button, IconButton, TextInput } from "react-native-paper";
import { Dropdown } from 'react-native-paper-dropdown';
import { database } from '../database/firebase';
import { ref, onValue } from 'firebase/database';

// Defining types for the state and donor items

interface Donor {
  key: string;
  name: string;
  age: string;
  blood: string;
  phone: string;
  city: string;
  email: string;
  gender: string;
}

interface FindblooddonorState {
  list: Donor[];
  phoneNumber: string;
  selectedBlood: string;
  selectedCity: string;
}

export default class Findblooddonor extends Component<{}, FindblooddonorState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      list: [],
      phoneNumber: '03101095316', // default number
      selectedBlood: '',
      selectedCity: '',
    };
  }

  componentDidMount(): void {
    const usersRef = ref(database, 'users');

    onValue(usersRef, (snapshot) => {
      const donors: Donor[] = [];

      snapshot.forEach((child) => {
        const val = child.val();
        donors.push({
          key: child.key ?? '',
          name: val.DisplayName ?? '',
          age: val.Age ?? '',
          blood: val.Blood ?? '',
          phone: val.Phone ?? '',
          city: val.City ?? '',
          email: val.Email ?? '',
          gender: val.Gender ?? '',
        });
      });

      this.setState({ list: donors });
    });
  }

  dialCall = (phoneNumber: string) => {
    const number = phoneNumber || this.state.phoneNumber;
    const scheme = Platform.OS === 'android' ? 'tel:' : 'telprompt:';
    Linking.openURL(`${scheme}${number}`);
  };

  sendSms = (phoneNumber: string) => {
    const number = phoneNumber || this.state.phoneNumber;
    const message = 'Hello, I need blood donation. Please help!';
    const separator = Platform.OS === 'ios' ? '&' : '?';
    const sms = `sms:${number}${separator}body=${message}`;
    Linking.openURL(sms);
  };

  sendWhatsApp = (phoneNumber: string) => {
    let number = phoneNumber || this.state.phoneNumber;

    // Format for international
    if (number.startsWith('+')) {
      number = number.substring(1);
    } else if (number.startsWith('0')) {
      number = '92' + number.substring(1); // Pakistan country code
    }

    Linking.openURL(`https://api.whatsapp.com/send?phone=${number}`);
  };
  
  render() {
    return (
      <View style={{ flex: 1, padding: 16, backgroundColor: "#f8f8f8" }}>
        <StatusBar barStyle="light-content" backgroundColor="#b22222" />

        {/* Filters */}
        <Card style={{ marginBottom: 12, padding: 12 }}>
          <Text variant="titleSmall" style={{ marginBottom: 8, fontWeight: 'bold' }}>Filter Donors</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Dropdown
                label="Blood Group"
                placeholder="Select blood group"
                options={["A+","A-","B+","B-","O+","O-","AB+","AB-"].map((g)=>({label:g,value:g,key:g}))}
                value={this.state.selectedBlood}
                onSelect={(val?: string) => this.setState({ selectedBlood: val || '' })}
              />
            </View>
            <View style={{ flex: 1 }}>
              <TextInput
                mode="outlined"
                label="City"
                value={this.state.selectedCity}
                onChangeText={(t)=> this.setState({ selectedCity: t })}
              />
            </View>
          </View>
        </Card>

        <FlatList
          data={this.state.list.filter(d => {
            const matchBlood = this.state.selectedBlood ? d.blood === this.state.selectedBlood : true;
            const matchCity = this.state.selectedCity ? (d.city || '').toLowerCase().includes(this.state.selectedCity.toLowerCase()) : true;
            return matchBlood && matchCity;
          })}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <Card style={{ marginBottom: 16, elevation: 3 }}>
              <Card.Content>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
                    {item.name}
                  </Text>
                  <Button
                    mode="contained"
                    buttonColor="#b22222"
                    textColor="white"
                    contentStyle={{ paddingHorizontal: 12 }}
                    labelStyle={{ fontWeight: "bold" }}
                  >
                    {item.blood}
                  </Button>
                </View>

                <View style={{ marginBottom: 8 }}>
                  <Text variant="bodyMedium" style={{ marginBottom: 4 }}>
                    <Text style={{ fontWeight: "bold" }}>Age:</Text> {item.age}
                  </Text>
                  <Text variant="bodyMedium" style={{ marginBottom: 4 }}>
                    <Text style={{ fontWeight: "bold" }}>Phone:</Text> {item.phone}
                  </Text>
                  <Text variant="bodyMedium" style={{ marginBottom: 4 }}>
                    <Text style={{ fontWeight: "bold" }}>City:</Text> {item.city}
                  </Text>
                  <Text variant="bodyMedium" style={{ marginBottom: 4 }}>
                    <Text style={{ fontWeight: "bold" }}>Email:</Text> {item.email}
                  </Text>
                  <Text variant="bodyMedium">
                    <Text style={{ fontWeight: "bold" }}>Gender:</Text> {item.gender}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: 12,
                  }}
                >
                  <IconButton
                    icon="phone"
                    iconColor="#4CAF50"
                    size={24}
                    onPress={() => this.dialCall(item.phone)}
                  />
                  <IconButton
                    icon="message-text"
                    iconColor="#2196F3"
                    size={24}
                    onPress={() => this.sendSms(item.phone)}
                  />
                  <IconButton
                    icon="whatsapp"
                    iconColor="#25D366"
                    size={24}
                    onPress={() => this.sendWhatsApp(item.phone)}
                  />
                </View>
              </Card.Content>
            </Card>
          )}
        />
      </View>
    );
  }
}