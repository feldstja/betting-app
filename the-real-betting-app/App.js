import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ListView, Alert, Button } from 'react-native';
import { StackNavigator } from 'react-navigation';


//Screens
class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };

  press() {
    this.props.navigation.navigate('Login')
  }

  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Login to HoHoHo!</Text>
        <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Tap to Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
          <Text style={styles.buttonLabel}>Tap to Register</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

class RegisterScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: ''
    }
  }

  static navigationOptions = {
    title: 'Register'
  };


  submitInfo() {
    fetch('https://hohoho-backend.herokuapp.com/register/', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then((response) => {
      return response.json()})
    .then((responseJson) => {
      if (responseJson.success) {
        alert('Registration Successful!')
        this.props.navigation.navigate('Welcome')
      } else {
        alert('Invalid information')
      }
    })
    .catch((err) => {
      alert('Error: ', err)
    });
  }

  render() {
    return (
      <View style={styles.container}>
      <View>
        <Text style={styles.textBig}>Register</Text>
      </View>
      <TouchableOpacity>
      <TextInput
        style={{height: 40, borderWidth: 1, width: 300, margin: 10, padding: 5}}
        placeholder="Enter your username"
        onChangeText={(text) => this.setState({username: text})}
      />
      <TextInput
        style={{height: 40, borderWidth: 1, width: 300, margin: 10, padding: 5}}
        secureTextEntry={true}
        placeholder="Enter your password"
        onChangeText={(text) => this.setState({password: text})}
      />
    </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={() => {this.submitInfo()}}>
        <Text style={styles.buttonLabel}>Register</Text>
      </TouchableOpacity>
    </View>
    )
  }
}

class Login extends React.Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: ''
    }
  }

  static navigationOptions = {
    title: 'Login'
  };


  submitInfo() {
    fetch('https://hohoho-backend.herokuapp.com/login/', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: 'theValueOfTheUsernameState',
        password: 'theValueOfThePasswordState',
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.success){
        this.props.navigation.navigate('UserList')
      }
    })
    .catch((err) => {
      alert('Error: ', err)
    });
  }

  render() {
    return (
      <View style={styles.container}>
      <View>
        <Text style={styles.textBig}>Welcome Back!</Text>
      </View>
      <TouchableOpacity>
      <TextInput
        style={{height: 40, borderWidth: 1, width: 300, margin: 10, padding: 5}}
        placeholder="Enter your username"
        onChangeText={(text) => this.setState({username: text})}
      />
      <TextInput
        style={{height: 40, borderWidth: 1, width: 300, margin: 10, padding: 5}}
        secureTextEntry={true}
        placeholder="Enter your password"
        onChangeText={(text) => this.setState({password: text})}
      />
    </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={() => {this.submitInfo()}}>
        <Text style={styles.buttonLabel}>Login</Text>
      </TouchableOpacity>
    </View>
    )
  }
}

class UserList extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([]),
    }
  }


    componentDidMount() {
      fetch('https://hohoho-backend.herokuapp.com/users', {
        method: 'GET',
      })
      .then((response) => response.json())
      .then((respJson) =>{
        console.log(respJson);
        const filtered = respJson.users.slice(1);
        return filtered;
      })
      .then((responseJson) => {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState ({
          dataSource: ds.cloneWithRows(responseJson)
        })
      })
      .catch((err) => {
        alert('Error: ', err)
      });
    }

    touchUser(user) {
      fetch('https://hohoho-backend.herokuapp.com/messages', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: user._id
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success){
          alert(`Your Ho Ho Ho! to ${user.username} has been sent!`, [{text: 'Dismiss'}])
        } else {
          alert(`Your Ho Ho Ho! to ${user.username} could not be sent.`, [{text: 'Dismiss'}])
        }
      })
      .catch((err) => {
        alert('Error: ', err)
      });
    }

    messages(){
      this.props.navigation.navigate('Messages')
    }

    componentDidMount() {
      this.props.navigation.setParams({
      // onRightPress: {this.messages.bind(this)}
    })
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'UserList',
    headerRight: <Button title='Messages' onPress={ () => {navigation.state.params.onRightPress()} } />
  });


  render() {
    return (
      <View style={styles.container}>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          //Username of each user
          renderRow={(rowData) => <TouchableOpacity onPress={this.touchUser.bind(this, rowData)}><Text key={rowData._id} style={{borderWidth: 1, margin: 5, padding: 5}}>{rowData.username}</Text></TouchableOpacity>}
        />
      </View>
    )
  }
}

  class Messages extends React.Component {
    constructor(props) {
      super(props)
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
        dataSource: ds.cloneWithRows([])
      }
    }

    static navigationOptions = {
      title: 'Messages'
    };

    componentDidMount() {
      fetch('https://hohoho-backend.herokuapp.com/users', {
        method: 'GET'
      })
      .then((response) => response.json())
      .then((respJson) =>{
        console.log(respJson);
        const filtered = respJson.users.slice(1);
        return filtered;
      })
      .then((responseJson) => {
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState ({
          dataSource: ds.cloneWithRows(responseJson)
        })
      })
      .catch((err) => {
        alert('Error: ', err)
      });
    }

    render() {
      return (
        <View style={styles.container}>
          <ListView
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            //Username of each user
            renderRow={(rowData) =>
              <Text
                key={rowData._id}
                style={{borderWidth: 1, margin: 5, padding: 5}}>
                From: {aMessage.from.username},
                To: {aMessage.to.username},
                Time: {aMessage.timestamp},
              </Text>}
          />
        </View>
      )
    }
  }



//Navigator
export default StackNavigator({
  Welcome: {
    screen: LoginScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Login: {
    screen: Login,
  },
  UserList: {
    screen: UserList,
  },
  Messages: {
    screen: Messages,
  },
}, {initialRouteName: 'Welcome'});


//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  textBig: {
    fontSize: 36,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5
  },
  buttonRed: {
    backgroundColor: '#FF585B',
  },
  buttonBlue: {
    backgroundColor: '#0074D9',
  },
  buttonGreen: {
    backgroundColor: '#2ECC40'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  }
});
