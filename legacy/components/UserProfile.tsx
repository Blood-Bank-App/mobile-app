import React, {Component} from 'react';
import { View, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { Avatar, TextInput, useTheme, Card, Title, Button, Switch, Text } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { onValue, ref } from "firebase/database";
import { auth, database } from "../database/firebase";

interface State {
  displayname: string;
  city: string;
  age: string;
  blood: string;
  phone: string;
  gender: string;
  availability: boolean;
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
      availability: false,
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
          availability: !!data.availability,
        });
      }
    });
  }

  saveProfile = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    const userRef = ref(database, "users/" + currentUser.uid);
    await Promise.all([
      // Update individual fields while preserving others
      // In Realtime DB, update() merges
      (await import('firebase/database')).update(userRef, {
        DisplayName: this.state.displayname,
        City: this.state.city,
        Age: this.state.age,
        Blood: this.state.blood,
        Phone: this.state.phone,
        Gender: this.state.gender,
        availability: this.state.availability,
      })
    ]);
  }

  render() {
    const { displayname, city, age, blood, phone, gender, availability } = this.state;
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#b22222" />

        <Avatar.Image
          size={100}
          source={require('../assets/man.jpeg')}
          style={styles.avatar}
        />

        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>User Information</Title>

            <TextInput label="Full Name" value={displayname} mode="outlined" style={styles.input} onChangeText={(t)=>this.setState({displayname:t})} />
            <TextInput label="City" value={city} mode="outlined" style={styles.input} onChangeText={(t)=>this.setState({city:t})} />
            <TextInput label="Blood Group" value={blood} mode="outlined" style={styles.input} onChangeText={(t)=>this.setState({blood:t})} />
            <TextInput label="Gender" value={gender} mode="outlined" style={styles.input} onChangeText={(t)=>this.setState({gender:t})} />
            <TextInput label="Phone" value={phone} mode="outlined" style={styles.input} onChangeText={(t)=>this.setState({phone:t})} />
            <TextInput label="Age" value={age} mode="outlined" style={styles.input} onChangeText={(t)=>this.setState({age:t})} />

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <Switch value={availability} onValueChange={(v)=>this.setState({ availability: v })} />
              <Text style={{ marginLeft: 8 }}>Available to Donate</Text>
            </View>

            <Button mode="contained" onPress={this.saveProfile} style={{ marginTop: 12, backgroundColor: '#b22222' }}>Save Profile</Button>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  avatar: {
    marginBottom: 20,
    backgroundColor: 'white',
    elevation: 4,
  },
  card: {
    width: wp(85),
    borderRadius: 15,
    elevation: 5,
    paddingBottom: 10,
  },
  title: {
    marginBottom: 10,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
    backgroundColor: 'white',
  },
});