import React, {useState} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar
} from 'react-native';
import {
    widthPercentageToDP,
    heightPercentageToDP,
  } from 'react-native-responsive-screen';

// import SMS API
import SendSMS from 'react-native-sms';

const Smssend = () => {
  const [mobileNumber, setMobileNumber] = useState('+92');
  const [bodySMS, setBodySMS] = useState(
    'Please Enter Blood Request',
  );

  const initiateSMS = () => {
    // Check for perfect 10 digit length
    if (mobileNumber.length != 11) {
      alert('Please insert correct contact number');
      return;
    }

    SendSMS.send(
      {
        // Message body
        body: bodySMS,
        // Recipients Number
        recipients: [mobileNumber],
        // An array of types 
        // "completed" response when using android
        successTypes: ['sent', 'queued'],
      },
      (completed, cancelled, error) => {
        if (completed) {
          console.log('SMS Sent Completed');
        } else if (cancelled) {
          console.log('SMS Sent Cancelled');
        } else if (error) {
          console.log('Some error occured');
        }
      },
    );
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
          onChangeText={
            (mobileNumber) => setMobileNumber(mobileNumber)
          }
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
        />
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.button}
          onPress={initiateSMS}>
          <Text style={styles.buttonTextStyle}>
            Send Sms
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
    borderRadius:20,
    width: widthPercentageToDP(60),
    height: heightPercentageToDP(6),
    flexDirection: 'row',
    alignItems:'center',
    justifyContent:'center',
    marginTop:25,
    elevation:6,
    marginLeft:52
  }
});
