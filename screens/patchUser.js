import React, { Component } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class PatchUserScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_id: 0,
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      orig_first_name: '',
      orig_last_name: '',
      orig_email: '',
    };
    this.searchUser();
  }

  updateUser = async () => {
    //change user info to user input
    let to_send = {};

    if (this, this.state.first_name != this.state.orig_first_name) {
      to_send['first_name'] = this.state.first_name;
    }

    if (this.state.last_name != this.state.orig_last_name) {
      to_send['last_name'] = this.state.last_name;
    }

    if (this.state.email != this.state.orig_email) {
      to_send['email'] = this.state.email;
    }

    to_send['password'] = this.state.password;

    console.log(JSON.stringify(to_send));
    const authToken = await AsyncStorage.getItem('@spacebook_details');
    return fetch("http://localhost:3333/api/1.0.0/user/" + this.state.user_id, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'X-Authorization': authToken

      },
      body: JSON.stringify(to_send)
    })
      .then((response) => {
        console.log("User Information Updated");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      })
  }

  searchUser = async () => {
    //get user details
    const authToken = await AsyncStorage.getItem('@spacebook_details');
    this.state.user_id = await AsyncStorage.getItem('@spacebook_details_id');
    return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.user_id, {
      method: 'GET',
      'headers': {
        'X-Authorization': authToken,
      }
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          orig_first_name: responseJson.first_name, //set user details
          orig_last_name: responseJson.last_name,
          orig_email: responseJson.email,
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  render() {
    return (
      <View>
        <Text>Update User Information</Text>

        <TextInput
          placeholder={this.state.orig_first_name}
          onChangeText={(first_name) => this.setState({ first_name })}
          value={this.state.first_name}
        />
        <TextInput
          placeholder={this.state.orig_last_name}
          onChangeText={(last_name) => this.setState({ last_name })}
          value={this.state.last_name}
        />
        <TextInput
          placeholder={this.state.orig_email}
          onChangeText={(email) => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          placeholder="Enter a new password..."
          onChangeText={(password) => this.setState({ password })}
          value={this.state.password}
        />
        <Button
          title="Update"
          onPress={() => this.updateUser()}
        />
      </View>
    );
  }
}

export default PatchUserScreen;