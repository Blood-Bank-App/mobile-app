
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './components/login';
import Userprofile from './components/Userprofile';
import Signup from './components/signup';
import Dashboard from './components/dashboard';
import SplashScreen from './components/SplashScreen';
import Forgetpass from './components/Forgetpass';
import Feedback from './components/Feedback';
import Findblooddonor from './components/Findblooddonor';
import Setting from './components/Setting';
import watsapp from './components/watsapp';


const Stack = createStackNavigator();


function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#b22222',
          height:70
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
        name="Signup" 
        component={Signup} 
        options={
          {title: 'Signup'},
          {headerLeft: null} ,{headerShown: false}
        }
      />       
      <Stack.Screen 
        name="Login" 
        component={Login} 
        options={
          {title: 'Login'},
          {headerLeft: null} ,{headerShown: false}
        }
      />
       <Stack.Screen 
        name="Setting" 
        component={Setting} 
        options={
          {title: 'Setting'},
          {headerLeft: null} ,{headerShown: true}
        }
      />

      <Stack.Screen 
        name="Findblooddonor" 
        component={Findblooddonor} 
          options={{ title: 'Find Blood Donor' }}
        
      />

      <Stack.Screen 
        name="watsapp" 
        component={watsapp} 
        options={{ title: 'Whatsapp'  }}
      /> 

     <Stack.Screen 
        name="Feedback" 
        component={Feedback} 
        options={{ title: 'Feed Back' }}
      />

       <Stack.Screen 
        name="Userprofile" 
        component={Userprofile} 
        options={{ title: 'User Profile'  }}
      />
       <Stack.Screen 
        name="Forgetpass" 
        component={Forgetpass} 
        options={{ title: 'Change Pass'  }} 
      
      
      />       

      <Stack.Screen 
       name="Dashboard" 
       component={Dashboard} 
       options={
         { title: 'Dashboard' },

          {headerLeft: null}
       }
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