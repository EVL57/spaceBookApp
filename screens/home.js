import React, { Component } from 'react';
import { View, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_id: "",
      userText: '',

    }
  }

  createPost = async () => {
    const authToken = await AsyncStorage.getItem('@spacebook_details');
    this.state.user_id = await AsyncStorage.getItem('@spacebook_details_id');
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.user_id + '/post',{
      method: 'POST',
      'headers': {
        'X-Authorization': authToken,
      },
      body: JSON.stringify(this.state.userText)
    })
    .then((response) => {
      if (response.status === 201){
        return response.json()
      }else if (response.status === 401){
        throw 'Unaothorised';
      }else if (response.status === 404){
        throw 'Not Found';
      }else{
        throw 'Something went wrong';
      }
    })
    .then((responseJson) => {
      console.log("Post Created for user: ", responseJson);
      this.props.navigation.navigate("Home");
    })
    .catch((error) => {
      console.log(error);
    })
  }


  render() {
    return (
    <View>
      <TextInput
      placeholder="What would you like to post about?"
      onChangeText={(userText) => this.setState({userText})}
      value={this.state.userText}
      style={{padding: 20, borderWidth: 5, margin: 10 }}
      />
      <Button
      title="Create Post"
      onPress={() => this.createPost()}
      />
    </View>
    )
  }




}
export default HomeScreen;