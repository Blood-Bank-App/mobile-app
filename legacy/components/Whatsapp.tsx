import React, { useState, useEffect } from "react";

import {
  Alert,
  View,
  StyleSheet,
  Text,
  Linking,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";

export default function Whatsapp() {
  const [cellNumber, setCellNumber] = useState<string>('');
  const [whatsAppMessage, setWhatsAppMessage] = useState<string>('');

  const sendMsg = () => {
    if (cellNumber.length != 10) {
      Alert.alert("Please Enter Correct WhatsApp Number");
      return;
    }
    // Here we are using 91 which is India Country Code.
    // You can change country code.
    let URL =
      "whatsapp://send?text=" + whatsAppMessage + "&phone=92" + cellNumber;

    Linking.openURL(URL)
      .then((data) => {
        // console.log("WhatsApp Opened");
      })
      .catch(() => {
        Alert.alert("Make sure Whatsapp installed on your device");
      });
  };

  return (
    <View style={styleSheet.MainContainer}>
      <TextInput
        value={cellNumber}
        onChangeText={(cellNumber) => setCellNumber(cellNumber)}
        placeholder={"Enter WhatsApp Number Here"}
        keyboardType="numeric"
        style={styleSheet.textInputStyle}
      />

      <TextInput
        value={whatsAppMessage}
        onChangeText={setWhatsAppMessage}
        placeholder={"Enter WhatsApp Message Here"}
        style={styleSheet.textInputStyle}
      />

      <TouchableOpacity
        activeOpacity={0.7}
        style={styleSheet.button}
        onPress={sendMsg}
      >
        <Text style={styleSheet.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

const styleSheet = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    padding: 10,
  },

  text1: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#2e8b57",
  },

  textInputStyle: {
    height: 42,
    borderColor: "#b22222",
    borderWidth: 2,
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 20,
  },
  button: {
    backgroundColor: "#b22222",
    borderRadius: 20,
    width: widthPercentageToDP(90),
    height: heightPercentageToDP(6),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    elevation: 8,
    marginLeft: 20,
  },
  buttonText: {
    fontSize: 15,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});
