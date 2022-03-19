import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './screens/login';
import HomeScreen from './screens/home';
import PatchUser from './screens/patchUser';
import SearchScreen from './screens/search';
import SignupScreen from './screens/signup';
import LogoutScreen from './screens/logout';


const Tab = createBottomTabNavigator();

class App extends Component {

  render(){
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Login" component={LoginScreen} />
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Search" component={SearchScreen} />
          <Tab.Screen name="Edit" component={PatchUser} />
          <Tab.Screen name="Signup" component={SignupScreen} />
          <Tab.Screen name="Logout" component={LogoutScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
  
}


export default App;