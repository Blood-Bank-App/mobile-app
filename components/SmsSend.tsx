import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert
} from 'react-native';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from 'react-native-responsive-screen';

// Import Expo SMS
import * as SMS from 'expo-sms';

const Smssend = () => {
  const [mobileNumber, setMobileNumber] = useState('+92');
  const [bodySMS, setBodySMS] = useState(
    'Please Enter Blood Request',
  );

  const initiateSMS = async () => {
    // Check for perfect 11 digit length
    if (mobileNumber.length != 11) {
      Alert.alert('Error', 'Please insert correct contact number');
      return;
    }

    // Check if SMS is available
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Error', 'SMS is not available on this device');
      return;
    }

    try {
      // Send SMS
      const { result } = await SMS.sendSMSAsync(
        [mobileNumber],
        bodySMS
      );

      if (result === 'sent') {
        Alert.alert('Success', 'SMS Sent Successfully');
      } else {
        console.log('SMS Result:', result);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send SMS');
      console.error('SMS Error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor='#b22222' />
      <View style={styles.container}>
        <Text style={styles.titleText}>
          Send Blood Request to User
        </Text>
        <Text style={styles.titleTextsmall}>
          Enter Mobile Number
        </Text>
        <TextInput
          value={mobileNumber}
          onChangeText={(mobileNumber) => setMobileNumber(mobileNumber)}
          placeholder={'Enter Contact Number to Call'}
          keyboardType="numeric"
          style={styles.textInput}
        />
        <Text style={styles.titleTextsmall}>
          Enter SMS body
        </Text>
        <TextInput
          value={bodySMS}
          onChangeText={(bodySMS) => setBodySMS(bodySMS)}
          placeholder={'Enter SMS body'}
          style={styles.textInput}
          multiline={true}
          numberOfLines={4}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.button}
          onPress={initiateSMS}>
          <Text style={styles.buttonTextStyle}>
            Send SMS
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Smssend;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    textAlign: 'center',
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  titleTextsmall: {
    marginVertical: 8,
    fontSize: 16,
  },
  buttonStyle: {
    justifyContent: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: '#8ad24e',
  },
  buttonTextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '100%',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#b22222',
    borderRadius: 20,
    width: widthPercentageToDP(60),
    height: heightPercentageToDP(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    elevation: 6,
    alignSelf: 'center'
  }
});