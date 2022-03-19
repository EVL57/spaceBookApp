import React, { Component } from 'react';
import { Text, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class HomeScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            token: ''
        }
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.checkLoggedIn();
        });        
    }

    componentWillUnmount(){
        this._unsubscribe();
    }

    checkLoggedIn = async () => {
        const value = await AsyncStorage.getItem('@spacebook_details');
        if(value !== null) {
          this.setState({token:value});
        }else{
            this.props.navigation.navigate("Login");
        }
    }

    logout = async () => {
        let token = await AsyncStorage.getItem('@spacebook_details');
        await AsyncStorage.removeItem('@spacebook_details');
        return fetch("http://localhost:3333/api/1.0.0/logout", {
            method: 'post',
            headers: {
                "X-Authorization": token
            }
        })
        .then((response) => {
            if(response.status === 200){
                this.props.navigation.navigate("Login");
            }else if(response.status === 401){
                this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong';
            }
        })
        .catch((error) => {
            console.log(error);
            ToastAndroid.show(error, ToastAndroid.SHORT);
        })
    }

    render(){
        return (
            <ScrollView>
                <Text style={{fontSize:24, fontWeight:'bold', padding:5, margin:5}}>Are you sure, you want to sign out from Spacebook?</Text>
                <Text style={{fontSize:24, padding:5, margin:5}}>There's always more things to do within Spacebook.</Text>
                <Button
                    title="Logout"
                    onPress={() => this.logout()}
                />
                <Button
                    title="Return to homescreen"
                    color="darkblue"
                    onPress={() => this.props.navigation.navigate("Home")}
                />
            </ScrollView>
        )
    }
}

export default HomeScreen;