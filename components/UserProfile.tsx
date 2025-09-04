import React, {Component} from 'react';
import { View, StyleSheet, StatusBar, ScrollView, Alert } from 'react-native';
import { Avatar, TextInput, useTheme, Card, Title, Button } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { onValue, ref, set } from "firebase/database";
import { auth, database } from "../database/firebase";

interface State {
  displayname: string;
  city: string;
  age: string;
  blood: string;
  phone: string;
  gender: string;
  isSaving: boolean;
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
      isSaving: false
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

  
  handleInputChange = (key: keyof State, value: string) => {
    this.setState({ [key]: value } as unknown as Pick<State, keyof State>);
  };

  saveProfile = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const { displayname, city, age, blood, phone, gender } = this.state;

    this.setState({ isSaving: true });

    try {
      await set(ref(database, 'users/' + currentUser.uid), {
        DisplayName: displayname,
        City: city,
        Age: age,
        Blood: blood,
        Phone: phone,
        Gender: gender,
      });
      Alert.alert('Profile updated successfully!');
    } catch (err) {
      Alert.alert('Failed to update profile.', (err as Error).message);
    } finally {
      this.setState({ isSaving: false });
    }
  };

  render() {
    const { displayname, city, age, blood, phone, gender, isSaving } = this.state;
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

            <TextInput label="Full Name" value={displayname} onChangeText={(val) => this.handleInputChange('displayname', val)} style={styles.input} mode="outlined" />
            <TextInput label="City" value={city} onChangeText={(val) => this.handleInputChange('city', val)} style={styles.input} mode="outlined" />
            <TextInput label="Blood Group" value={blood} onChangeText={(val) => this.handleInputChange('blood', val)} style={styles.input} mode="outlined" />
            <TextInput label="Gender" value={gender} onChangeText={(val) => this.handleInputChange('gender', val)} style={styles.input} mode="outlined" />
            <TextInput label="Phone" value={phone} onChangeText={(val) => this.handleInputChange('phone', val)} style={styles.input} mode="outlined" keyboardType="phone-pad" />
            <TextInput label="Age" value={age} onChangeText={(val) => this.handleInputChange('age', val)} style={styles.input} mode="outlined" keyboardType="numeric" />

            <Button
              mode="contained"
              onPress={this.saveProfile}
              loading={isSaving}
              disabled={isSaving}
              style={{ marginTop: 15 }}
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
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