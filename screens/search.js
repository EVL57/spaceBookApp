import React, { Component } from 'react';
import { View, Text, FlatList, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SearchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      listData: [],
      searchQuery: "",
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }


  searchUsers = async () => {
    //search through users with a user query
    const authToken = await AsyncStorage.getItem('@spacebook_details');
    return fetch('http://localhost:3333/api/1.0.0/search?q=' + this.state.searchQuery, {
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
          isLoading: false,
          listData: responseJson
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  checkLoggedIn = async () => {
    const authToken = await AsyncStorage.getItem('@spacebook_details');
    if (authToken == null) {
      this.props.navigation.navigate('Login');
    }
  };

  addFriend = async (friendID) => {
    //sent a friend request
    const authToken = await AsyncStorage.getItem('@spacebook_details');
    return fetch('http://localhost:3333/api/1.0.0/user/' + friendID + '/friends', {
      method: 'POST',
      'headers': {
        'X-Authorization': authToken,
      }
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          throw 'Friend Request already sent';
        } else if (response.status === 404) {
          throw 'Not Found';
        } else {
          throw 'Something went wrong';
        }
      })
      .then((response) => {
        console.log("Friend Request Sent");
      })
      .catch((error) => {
        console.log(error);
      })
  }


  render() {
    return (
      <View>
        <TextInput
          placeholder="Search name"
          onChangeText={(searchQuery) => this.setState({ searchQuery })}
          value={this.state.searchQuery}
        />
        <Button
          title="Search"
          onPress={() => this.searchUsers()}
        />
        <FlatList
          data={this.state.listData}
          renderItem={({ item }) => (
            <View>
              <Text> User ID - {item.user_id}, {item.user_givenname}, {item.user_familyname} </Text>
              <Button
                title="Add friend"
                onPress={() => this.addFriend(item.user_id)}
                titleStyle={{
                  color: "white",
                  fontSize: 16,
                }}
                buttonStyle={{
                  height: 50,
                  width: 50,
                }}
              />
            </View>
          )}
          keyExtractor={(item, index) => item.user_id.toString()}
        />
      </View>
    );
  }

}


export default SearchScreen;