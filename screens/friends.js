import React, { Component } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class FriendsScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            friendReqData: [],
            friendListData: [],
            user_id: 0,

        }
        this.getFriendReq();
        this.getFriendList();
    }


    componentDidMount() {
        this.unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedin();
        });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    getFriendReq = async () => {
        //get list of friend requests
        const authToken = await AsyncStorage.getItem('@spacebook_details');
        return fetch('http://localhost:3333/api/1.0.0/friendrequests', {
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
                    throw 'Server Error';
                }
            })
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    friendReqData: responseJson,
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }


    getFriendList = async () => {
        //get list of friends
        const authToken = await AsyncStorage.getItem('@spacebook_details');
        this.state.user_id = await AsyncStorage.getItem('@spacebook_details_id');
        return fetch('http://localhost:3333/api/1.0.0/user/' + this.state.user_id + '/friends', {
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
                } else if (response.status === 403) {
                    throw 'Can only view the friends of yourself or your friends';
                } else if (response.status === 404) {
                    throw 'Not Found';
                } else {
                    throw 'Server Error';
                }
            })
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    friendListData: responseJson
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    acceptFriendReq = async (friendReqID) => {
        //accept a friend request
        const authToken = await AsyncStorage.getItem('@spacebook_details');
        return fetch('http://localhost:3333/api/1.0.0/friendrequests/' + friendReqID, {
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
                } else if (response.status === 404) {
                    throw 'Not Found';
                } else {
                    throw 'Server Error';
                }
            })
            .then((response) => {
                console.log("Friend Request Accepted");

            })
            .catch((error) => {
                console.log(error);
                window.location.reload();
            })
    }

    declineFriendReq = async (friendReqID) => {
        //reject  a friend request
        const authToken = await AsyncStorage.getItem('@spacebook_details');
        return fetch('http://localhost:3333/api/1.0.0/friendrequests/' + friendReqID, {
            method: 'DELETE',
            'headers': {
                'X-Authorization': authToken,
            }
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json()
                } else if (response.status === 401) {
                    throw 'Unauthorised';
                } else if (response.status === 404) {
                    throw 'Not Found';
                } else {
                    throw 'Server Error';
                }
            })
            .then((response) => {
                console.log("Friend Request Rejected");
            })
            .catch((error) => {
                console.log(error);
                window.location.reload();
            })
    }


    checkLoggedin = async () => {
        const value = await AsyncStorage.getItem('@spacebook_details');
        if (value == null) {
            this.props.navigation.navigate('Login');
        }
    };



    render() {
        return (
            <View>
                <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 5 }} > Friend Requests</Text>

                <FlatList
                    data={this.state.friendReqData}
                    renderItem={({ item }) => (
                        <View>
                            <Text style={{ fontSize: 16 }} > User ID - {item.user_id}, {item.first_name}, {item.last_name}, {item.email}. </Text>
                            <Button
                                title="Accept"
                                onPress={() => this.acceptFriendReq(item.user_id)}
                            />
                            <Button
                                title="Reject"
                                onPress={() => this.declineFriendReq(item.user_id)}
                            />
                        </View>
                    )}
                    keyExtractor={(item, index) => item.user_id.toString()}
                />
                <Text style={{ fontSize: 18, fontWeight: 'bold', padding: 5 }} > Friends List </Text>
                <FlatList
                    data={this.state.friendListData}
                    renderItem={({ item }) => (
                        <View>
                            <Text style={{ fontSize: 16 }} > User ID - {item.user_id}, {item.user_givenname}, {item.user_familyname}, {item.user_email}. </Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => item.user_id.toString()}
                />
            </View>
        )
    }
}


export default FriendsScreen;