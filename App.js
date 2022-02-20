import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './components/login';
import FeedScreen from './components/feed';
import SignupScreen from './components/signup';

const Tab = createBottomTabNavigator();

class App extends Component {

  render(){
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Login" component={LoginScreen} />
          <Tab.Screen name="Feed" component={FeedScreen} />
          <Tab.Screen name="Signup" component={SignupScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
  
}


export default App;