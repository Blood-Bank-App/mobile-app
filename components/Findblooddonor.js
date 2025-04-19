import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking, StatusBar, Image, Platform } from 'react-native';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import { database } from '../database/firebase';
import { ref, onValue } from 'firebase/database';

export default class Findblooddonor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      phoneNumber: '03101095316' // Default phone number
    };
  }

  dialCall = (phoneNumber) => {
    let number = phoneNumber || this.state.phoneNumber;
    let scheme = Platform.OS === 'android' ? 'tel:' : 'telprompt:';
    Linking.openURL(`${scheme}${number}`);
  };

  sendSms = (phoneNumber) => {
    let number = phoneNumber || this.state.phoneNumber;
    let message = 'Hello, I need blood donation. Please help!';
    let separator = Platform.OS === 'ios' ? '&' : '?';
    let sms = `sms:${number}${separator}body=${message}`;
    Linking.openURL(sms);
  };

  sendWhatsApp = (phoneNumber) => {
    let number = phoneNumber || this.state.phoneNumber;
    // Make sure the number starts with country code without +
    if (number.startsWith('+')) {
      number = number.substring(1);
    } else if (number.startsWith('0')) {
      // Assuming Pakistan country code is 92
      number = '92' + number.substring(1);
    }
    
    Linking.openURL(`http://api.whatsapp.com/send?phone=${number}`);
  };

  componentDidMount() {
    // Using the new Firebase v9 SDK
    const usersRef = ref(database, 'users');
    onValue(usersRef, (snapshot) => {
      const li = [];
      snapshot.forEach((child) => {
        li.push({
          key: child.key,
          name: child.val().DisplayName,
          age: child.val().Age,
          blood: child.val().Blood,
          phone: child.val().Phone,
          city: child.val().City,
          email: child.val().Email,
          gender: child.val().Gender
        });
      });
      this.setState({ list: li });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor='#b22222' />
        <FlatList
          data={this.state.list}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => {
            return (
              <View style={styles.donorCard}>
                <View style={styles.headerRow}>
                  <Text style={styles.text}>Name: {item.name}</Text>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>{item.blood}</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.infoContainer}>
                  <Text style={styles.in}>
                    Age: {item.age} {'\n'}
                    Phone: {item.phone} {'\n'}
                    City: {item.city} {'\n'}
                    Email: {item.email} {'\n'}
                    Gender: {item.gender}
                  </Text>
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.button1} 
                      onPress={() => this.dialCall(item.phone)}
                    >
                      <Image style={styles.img} source={require('../assets/phone.png')} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.button2} 
                      onPress={() => this.sendSms(item.phone)}
                    >
                      <Image style={styles.img} source={require('../assets/sms.png')} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.button3} 
                      onPress={() => this.sendWhatsApp(item.phone)}
                    >
                      <Image style={styles.img} source={require('../assets/wats.png')} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  donorCard: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoContainer: {
    padding: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingBottom: 10,
  },
  img: {
    width: widthPercentageToDP(11),
    height: heightPercentageToDP(6),
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  in: {
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#b22222',
    borderRadius: 35,
    width: widthPercentageToDP(11),
    height: heightPercentageToDP(5),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  button1: {
    backgroundColor: '#fff',
    borderRadius: 35,
    width: widthPercentageToDP(17),
    height: heightPercentageToDP(9),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  button2: {
    backgroundColor: '#fff',
    borderRadius: 35,
    width: widthPercentageToDP(17),
    height: heightPercentageToDP(9),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  button3: {
    backgroundColor: '#fff',
    borderRadius: 35,
    width: widthPercentageToDP(17),
    height: heightPercentageToDP(9),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
});