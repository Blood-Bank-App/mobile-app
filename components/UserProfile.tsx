// components/dashboard.js

import React, { Component, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  TouchableHighlight,
  Image,
  StatusBar,
} from "react-native";
import { onValue, ref } from "firebase/database";
import { auth, database } from "../database/firebase";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";

interface State {
  displayname: string;
  city: string;
  age: string;
  blood: string;
  phone: string;
  gender: string;
}

export default class Userprofile extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      displayname: "",
      city: "",
      age: "",
      blood: "",
      phone: "",
      gender: "",
    };
  }

  componentDidMount() {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const userRef = ref(database, "users/" + currentUser.uid);

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        this.setState({
          displayname: data.DisplayName || "",
          city: data.City || "",
          age: data.Age || "",
          blood: data.Blood || "",
          phone: data.Phone || "",
          gender: data.Gender || "",
        });
      }
    });
  }

  render() {
    const { displayname, city, age, blood, phone, gender } = this.state;
    return (
      <View>
        <StatusBar barStyle="light-content" backgroundColor="#b22222" />

        <TouchableHighlight style={styles.profileImgContainer}>
          <Image
            source={require("../assets/man.jpeg")}
            style={styles.profileImg}
          />
        </TouchableHighlight>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={displayname}
            editable={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={city} editable={false} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={blood} editable={false} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={gender} editable={false} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={phone} editable={false} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput style={styles.input} value={age} editable={false} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomColor: "#b22222",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    width: widthPercentageToDP(80),
    height: heightPercentageToDP(6),
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginLeft: 25,
    borderRadius: 15,
  },
  Container: {
    borderBottomColor: "#b22222",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    width: widthPercentageToDP(80),
    height: heightPercentageToDP(5),
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 25,
    borderRadius: 15,
  },
  Container1: {
    borderBottomColor: "#b22222",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    width: widthPercentageToDP(80),
    height: heightPercentageToDP(6),
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 25,
    marginTop: 15,
    borderRadius: 15,
  },
  Container2: {
    borderBottomColor: "#b22222",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    width: widthPercentageToDP(80),
    height: heightPercentageToDP(6),
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 25,
    marginTop: 20,
    borderRadius: 15,
  },
  input: {
    height: heightPercentageToDP(5),
    marginLeft: 13,
  },
  inputs: {
    height: heightPercentageToDP(5),
    marginLeft: 13,
  },
  button: {
    backgroundColor: "#b22222",
    borderRadius: 20,
    width: widthPercentageToDP(60),
    height: heightPercentageToDP(6),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    elevation: 8,
    marginLeft: 55,
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  profileImgContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 130,
    height: 80,
    width: 80,
    borderRadius: 40,
    elevation: 15,
    marginTop: 25,
  },
  profileImg: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
});
