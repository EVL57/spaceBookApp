import React, {Component} from 'react';
import {View, Text, FlatList, TextInput, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class searchScreen extends Component {
    constructor(props){
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
        const value = await AsyncStorage.getItem('@spacebook_details');
       // console.log("Token Fetch");
        //console.log(value);
        return fetch('http://localhost:3333/api/1.0.0/search?q=' + this.state.searchQuery,{
            'headers': {
                'X-Authorization': value,
            }
        })
        .then((response) => {
            if(response.status === 200){
                return response.json()
            }else if(response.status === 401){
                this.props.navigation.navigate("Login");
            }else{
                throw 'Something went wrong, please try again';
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
          const value = await AsyncStorage.getItem('@spacebook_details');
          if (value == null) {
              this.props.navigation.navigate('Login');
          }
      };

                    
      render() {

        // if (this.state.isLoading){
        //  return (
        //    <View
        //      style={{
        //        flex: 1,
        //        flexDirection: 'column',
        //        justifyContent: 'center',
        //        alignItems: 'center',
        //      }}>
        //      <Text>Loading..</Text>
        //    </View>
        //  );
        //}else{
          return (
            <View>
                <TextInput
                    placeholder="Search name"
                    onChangeText={(searchQuery) => this.setState({searchQuery})}
                    value={this.state.searchQuery}
                />
                <Button
                    title="Search"
                    onPress={() => this.searchUsers()}
                />
                <FlatList
                    data={this.state.listData}
                    renderItem={({item}) => (
                        <View>
                          <Text> {item.user_givenname} {item.user_familyname} </Text>
                          <Button
                          title="Add friend"
                          onPress={() => this.addFriend()}
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
                    keyExtractor={(item,index) => item.user_id.toString()}
                />
            </View>
          );
        }
        
      }
  //  }
  
    export default searchScreen;