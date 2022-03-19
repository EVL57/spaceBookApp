import React, {Component} from 'react';
import {View, Text, FlatList, TextInput, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class HomeScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            postData: [],
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


    

      checkLoggedIn = async () => {
          const value = await AsyncStorage.getItem('@spacebook_details');
          if (value == null) {
              this.props.navigation.navigate('Login');
          }
      };

                    
      render() {
        return (
          <View>
            <TextInput
              placeholder="Search name"
              // onChangeText={(searchQuery) => this.setState({searchQuery})}                    value={this.state.searchQuery}
            />
            <Button
              title="Search"
              // onPress={() => this.searchUsers()}
            />
            {/* <FlatList
              data={this.state.listData}
                renderItem={({item}) => (
                  <View>
                    <Text> {item.user_givenname} {item.user_familyname} </Text>
                    <Button
                      title="Add friend"
                      onPress={() => this.addFriend()}
                      titleStyle={{
                        color: "white",                            fontSize: 16,
                      }}
                        buttonStyle={{
                          height: 50,
                          width: 50,
                        }}
                    />
                  </View>
                )}
              keyExtractor={(item,index) => item.user_id.toString()}
            /> */}
          </View>
        );
      }

}
export default HomeScreen;