import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './components/Login';
import UserProfile from './components/UserProfile';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import SplashScreen from './components/SplashScreen';
import ForgetPass from './components/ForgetPass';
import Feedback from './components/Feedback';
import SmsSend from './components/SmsSend';
import FindBloodDonor from './components/FindBloodDonor';
import Setting from './components/Setting';
import Whatsapp from './components/Whatsapp';
import { RootStackParamList } from 'types';


const Stack = createStackNavigator<RootStackParamList>();

function MyStack(): JSX.Element {
  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#b22222',
          height: 70
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen 
        name="SplashScreen" 
        component={SplashScreen} 
        options={{headerShown: false}}  
      />       
      
      <Stack.Screen 
        name="SignUp" 
        component={SignUp} 
        options={{
          title: 'SignUp',
          headerLeft: () => null,
          headerShown: false
        }}
      />       
      <Stack.Screen 
        name="Login" 
        component={Login} 
        options={{
          title: 'Login',
          headerLeft: () => null,
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="Setting" 
        component={Setting} 
        options={{
          title: 'Setting',
          headerLeft: () => null,
          headerShown: true
        }}
      />

      <Stack.Screen 
        name="FindBloodDonor" 
        component={FindBloodDonor} 
        options={{ title: 'Find Blood Donor' }}
      />

      <Stack.Screen 
        name="SmsSend" 
        component={SmsSend} 
        options={{ title: 'Sms Send' }}
      />

      <Stack.Screen 
        name="Whatsapp" 
        component={Whatsapp} 
        options={{ title: 'Whatsapp' }}
      /> 

      <Stack.Screen 
        name="Feedback" 
        component={Feedback} 
        options={{ title: 'Feed Back' }}
      />

      <Stack.Screen 
        name="UserProfile" 
        component={UserProfile} 
        options={{ title: 'User Profile' }}
      />
      <Stack.Screen 
        name="ForgetPass" 
        component={ForgetPass} 
        options={{ title: 'Change Pass' }}
      />       

      <Stack.Screen 
        name="Dashboard" 
        component={Dashboard} 
        options={{
          title: 'Dashboard',
          headerLeft: () => null,
          headerShown: true
        }}
      />
    </Stack.Navigator>
  );
}

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}