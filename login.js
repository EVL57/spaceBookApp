import React, { Component } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


class LoginScreen extends Component{
    constructor(props){
        super(props);

        this.state = {
            email: "jj@mmu.ac.uk",
            password: "hello123"
        };
    }

    login = async () => {

       return  fetch('http://localhost:3333/api/1.0.0/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 400){
                throw 'Invalid email or password';
            }else{
                throw 'Something went wrong, please try again';
            }
        })
        .then(async (responseJson) => {
            console.log(responseJson);
            await AsyncStorage.setItem('@spacebook_details', responseJson.token);
            this.props.navigation.navigate("Home");
        })
        .catch((error) => {
            console.log(error);
        })
    }
    render(){
        return (
            <View>
                <Text>Login</Text>
                <TextInput
                    placeholder="Enter email"
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                />
                <TextInput
                    placeholder="Enter password"
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    secureTextEntry={true}
                />
                <Button
                    title="Login"
                    onPress={() => this.login()}
                />
            </View>
        );
    }
}

export default LoginScreen;