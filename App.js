import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Component imports
import Dashboard from './components/dashboard';
import Feedback from './components/Feedback';
import Findblooddonor from './components/Findblooddonor';
import Forgetpass from './components/Forgetpass';
import Login from './components/login';
import Setting from './components/Setting';
import Signup from './components/signup';
import SplashScreen from './components/SplashScreen';
import Userprofile from './components/Userprofile';
import Whatsapp from './components/watsapp'; // Capitalize if it's a component

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#b22222',
          height: 70,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          title: 'Dashboard',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="Setting"
        component={Setting}
        options={{ title: 'Settings' }}
      />

      <Stack.Screen
        name="Findblooddonor"
        component={Findblooddonor}
        options={{ title: 'Find Blood Donor' }}
      />

      <Stack.Screen
        name="Whatsapp"
        component={Whatsapp}
        options={{ title: 'WhatsApp' }}
      />

      <Stack.Screen
        name="Feedback"
        component={Feedback}
        options={{ title: 'Feedback' }}
      />

      <Stack.Screen
        name="Userprofile"
        component={Userprofile}
        options={{ title: 'User Profile' }}
      />

      <Stack.Screen
        name="Forgetpass"
        component={Forgetpass}
        options={{ title: 'Change Password' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
