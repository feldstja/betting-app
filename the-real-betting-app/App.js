import React from 'react';
// import AsyncStorage from 'localStorage';
import { StyleSheet, View, Text, Animated, TouchableOpacity, AsyncStorage, TextInput, ListView, Alert, Image, Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import io from 'socket.io-client';
const socket = io('https://2b3f7497.ngrok.io');
let newLogin;

  class WelcomeScreen extends React.Component {
    static navigationOptions = {
      title: 'Welcome',
    };
    state = {
      fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
      spinValue: new Animated.Value(0)
    }

    componentDidMount(){
      Animated.loop(
        Animated.timing(                  // Animate over time
          this.state.fadeAnim,            // The animated value to drive
          {
            toValue: 1,                   // Animate to opacity: 1 (opaque)
            duration: 5000,              // Make it take a while
          }
        )).start();                       // Starts the animation
      Animated.loop(
        Animated.timing(
          this.state.spinValue,
          {
            toValue: 1,
            duration: 3000,
          }
        )).start();
      }

      press() {
        this.props.navigation.navigate('Login')
      }

      register() {
        this.props.navigation.navigate('Register');
      }

      render() {
        let { fadeAnim, spinValue } = this.state;

        const RotateData = spinValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg']
        })
        return (
        <View style={styles.container}>
          <View style={styles.pics}>
            <Image source={{uri: 'https://www.nbcsports.com/chicago/sites/csnchicago/files/styles/article_hero_image/public/2018/08/09/mitch_trubisky_usa_today.jpg?itok=2FPMS03J'}}
            style={{width: 150, height: 150, marginRight: 50, transform:[{rotate: '10 deg'}]}} />
            <Animated.Image    //   Special animatable View
            source={{uri: 'https://pbs.twimg.com/media/CIHcPkYWUAAQKtd.jpg'}}
            style={{opacity: fadeAnim, width: 100, height: 100, marginLeft: 15,}} />
          </View>

          <View style={{marginTop: 35}}>
            <Text style={styles.textBig}>Welcome to LongShot!</Text>
            <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonGreen]}>
              <Text style={styles.buttonLabel}>Get to Gamblin'!</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={ () => {this.register()} }>
              <Text style={styles.buttonLabel}>Tap to Register</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pics}>
            <Animated.Image    //   Special animatable View
            style={{ transform: [{rotate: RotateData}], width: 140, height: 140, marginRight: 50, marginTop: 70, marginLeft: 3}}
            source={{uri: 'http://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/mlb.png&w=288&h=288&transparent=true'}} />
            <Image source={{uri: 'https://i.pinimg.com/originals/13/46/70/134670c3ef40e9c977affff3e135f6e0.png'}}
            style={{width: 140, height: 150, marginTop: 170, marginLeft: 15, marginRight: 1, }} />
          </View>
        </View>
        )
      }
    }

  class RegisterScreen extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        username: '',
        password: '',
        passwordRepeat: ''
      }
    }

    static navigationOptions = {
      title: 'Register'
    };


    submitInfo() {
      socket.emit('register', JSON.stringify({
        Username: this.state.username,
        Password: this.state.password,
        PasswordRepeat: this.state.passwordRepeat
      }, (data)=>{
        if(data.success){
          this.props.navigation.navigate('Welcome')
        }
      }) )
    }

    render() {
      return (
        <View style={styles.container}>
          <View>
            <Text style={styles.textBig}>Register</Text>
          </View>
          <TouchableOpacity>
            <TextInput
              style={{height: 40, backgroundColor: 'white', borderWidth: 1, width: 300, margin: 10, padding: 5}}
              placeholder="Enter your username"
              onChangeText={(text) => this.setState({username: text})}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <TextInput
              style={{height: 40, borderWidth: 1, backgroundColor: 'white', width: 300, margin: 10, padding: 5}}
              secureTextEntry={true}
              placeholder="Enter your password"
              onChangeText={(text) => this.setState({password: text})}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <TextInput
              style={{height: 40, borderWidth: 1, backgroundColor: 'white', width: 300, margin: 10, padding: 5}}
              secureTextEntry={true}
              placeholder="Repeat Password"
              onChangeText={(text) => this.setState({passwordRepeat: text})}
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
        password: '',
        user: ''
      }
      this.newLogin = this.newLogin.bind(this)
    }

    static navigationOptions = {
      title: 'Login'
    };

    componentDidMount(){
      // }
      var self = this;
      socket.on('loginSuccess', async data => {
        await self.setState({user: data});
        await AsyncStorage.setItem('user', JSON.stringify(data));
        socket.emit('changePage', this.state.user)
        self.props.navigation.navigate('Bets')
      });
    }
    //   var user = JSON.parse(localStorage.getItem('user') || 'null')
    //   if (user) {
    //     this.props.navigation.navigate('Bets');
    //   }
    //   socket.on('loadPage', (user)=>{
    //     this.setState({
    //       user: user
    //     })
    //   })
    // };

    newLogin() {
      this.setState({
        user: '',
      });
      this.props.navigation.navigate('Login')
    }

    async submitInfo() {
      var self = this
      socket.emit('login', {
        Username: this.state.username,
        Password: this.state.password,
      })
      // socket.on('errMsg', (data)=>{
      //   alert(data.msg)
      // })
      // socket.on('loginSuccess', (user)=>{
      //   localStorage.setItem("user", JSON.stringify(user));
      //   self.setState({
      //     user: user,
      //   });
      //   socket.emit('changePage', this.state.user)
      //   this.props.navigation.navigate('Bets');
      // });
    }


    render() {
      return (
        <View style={styles.container}>
          <View>
            <Text style={styles.textBig}>Welcome Back!</Text>
          </View>
          <TouchableOpacity>
            <TextInput
              style={{height: 40, backgroundColor: 'white', borderWidth: 1, width: 300, margin: 10, padding: 5}}
              placeholder="Enter your username"
              onChangeText={(text) => this.setState({username: text})}
            />
            <TextInput
              style={{height: 40, backgroundColor: 'white', borderWidth: 1, width: 300, margin: 10, padding: 5}}
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

  class Bets extends React.Component {
    constructor(props) {
      super(props);
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
        dataSource: ds.cloneWithRows([]),
        name: 'loading...',
        coins: 0,
        user: ''
      }
    }

    static navigationOptions = {
      title: 'Bets'
    }

    newLogin() {
      this.setState({
        user: ''
      })
      this.props.navigation.navigate('Welcome')
    }

    async componentDidMount() {
      const user = await AsyncStorage.getItem("user")
      var self = this;
      if(user){
        this.setState({
          user: user
        })
      }
      socket.on('loadPage', (user)=>{
        self.setState({
          name: user.Username,
          coins: user.Coins,
        })
      })
      socket.emit('getBets', {})
      socket.on('loadBets', (bets)=>{
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState ({
          dataSource: ds.cloneWithRows(bets)
        })
      })
      this.props.navigation.setParams({
        onRightPress: self.Leaderboard.bind(this),
        onLeftPress: self.newLogin.bind(this)
      })
    }


    newBet(){
      socket.emit('changePage', this.state.user)
      this.props.navigation.navigate('NewBet')

    }
    Leaderboard(){
      socket.emit('changePage', this.state.user)
      this.props.navigation.navigate('Leaderboard')

    }
    Profile(){
      socket.emit('changePage', this.state.user)
      this.props.navigation.navigate('Profile')
    }
    //
    // componentDidMount() {
    //   this.props.navigation.setParams({
    //     // onRightPress: {this.messages.bind(this)}
    //   })
    // }

    static navigationOptions = ({ navigation }) => ({
      title: 'Bets',
      headerLeft: <Button title='Sign out' onPress={() => {navigation.state.params.onLeftPress()}} />,
      headerRight: <Button title='Leaderboard' onPress={ () => {navigation.state.params.onRightPress()} } />,
    });
    // static navigationOptions = ({ navigation }) => ({
    //   title: 'UserList',
    //   headerRight: <Button title='Make Bet' onPress={()=>{self.messages}} />
    // });


    render() {
      return (
        <View style={styles.container}>
          <Text style={{fontSize: 20}}>{this.state.name} ---  {this.state.coins}</Text>
          <ListView
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            //Username of each user
            renderRow={(rowData) => <View style={{borderWidth: 1, flex: 1, margin: 5, padding: 5}}>
              <Text key={rowData._id}>{rowData.Text}</Text>
              <Text>{rowData.Amount}</Text>
              <Text>{rowData.Odds}</Text>
              <Text>{rowData.Creator}</Text></View>}
            />
            <TouchableOpacity onPress={()=>{this.newBet()}} style={[styles.button, styles.buttonGreen, {marginBottom: 10}]}>
              <Text style={styles.buttonLabel}>Create New Bet</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{this.Profile()}} style={[styles.button, styles.buttonRed, {marginBottom: 30}]}>
              <Text style={styles.buttonLabel}>Your Profile</Text>
            </TouchableOpacity>
          </View>
        )
      }
    }

  class NewBet extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        text: '',
        amount: '',
        odds: '',
        user: ''
      }
    }

    static navigationOptions = {
      title: 'New Bet'
    };

    componentDidMount() {
      var self = this
      socket.on('loadPage', (user)=>{
        self.setState({
          user: user
        })
      })
      // fetch('https://hohoho-backend.herokuapp.com/users', {
      //   method: 'GET'
      // })
      // .then((response) => response.json())
      // .then((respJson) =>{
      //   console.log(respJson);
      //   const filtered = respJson.users.slice(1);
      //   return filtered;
      // })
      // .then((responseJson) => {
      //   const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      //   this.setState ({
      //     dataSource: ds.cloneWithRows(responseJson)
      //   })
      // })
      // .catch((err) => {
      //   alert('Error: ', err)
      // });
    }
    submit() {
      socket.emit('addBet', JSON.stringify({
        text: this.state.text,
        amount: this.state.amount,
        odds: this.state.odds,
        creator: this.state.user.Username
      }) )
      socket.on('betSaved', (data)=>{
        socket.emit('changePage', this.state.user)
        this.props.navigation.navigate('Bets')
      })
    }

    render() {
      return (
        <View style={styles.container}>
          {this.state.user ? <Text>{this.state.user.Username}</Text> : <Text>Loading...</Text>}
          <TextInput
            style={styles.textBox}
            placeholder="Enter Your Bet"
            onChangeText={(text) => this.setState({text: text})}
          />
          <TextInput
            style={styles.textBox}
            placeholder="Enter The Amount You Want To Bet"
            onChangeText={(text) => this.setState({amount: Number(text)})}
          />
          <TextInput
            style={styles.textBox}
            placeholder="Enter The Odds You Want To Make"
            onChangeText={(text) => this.setState({odds: Number(text)})}
          />
          <Button title='Submit' onPress={this.submit.bind(this)}/>
        </View>
      )
    }
  }

  class Leaderboard extends React.Component {
    constructor(props){
      super(props);
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
        dataSource: ds.cloneWithRows([]),
      }
    }

    componentDidMount(){
      socket.emit('leaderboard');
      socket.on('leaders', (data)=>{
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.setState ({
          dataSource: ds.cloneWithRows(data)
        })
      })
    }

    render(){
      return (
        <View style={styles.container}>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          //Username of each user
          renderRow={(rowData) => <View key={rowData._id} style={{borderColor: 'black', borderWidth: 1, flex: 1, margin: 5, padding: 5}}>
            <Text >{rowData.Username}</Text>
            <Text>{rowData.Coins}</Text>
          </View>}
          />
        </View>
      )
    }
  }

  class Profile extends React.Component {
    constructor(props){
      super(props)
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.state = {
        dataSource: ds.cloneWithRows([]),
        user: 0
      }
    }
    componentDidMount(){
      var self = this
      socket.on('loadPage', (user)=>{
        self.setState({
          user: user
        })
        socket.emit('getProfBets', this.state.user)

      })
      socket.on('loadProfBets', (bets)=>{
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        self.setState ({
          dataSource: ds.cloneWithRows(bets)
        })
      })
    }

    render() {
      return (
        <View style={styles.container}>
        {this.state.user ? <Text>{this.state.user.Username} --- {this.state.user.Coins}</Text> : <Text>Loading...</Text>}
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          //Username of each user
          renderRow={(rowData) => <View style={{borderWidth: 1, flex: 1, margin: 5, padding: 5}}>
            <Text key={rowData._id}>{rowData.Text}</Text>
            <Text>{rowData.Amount}</Text>
            <Text>{rowData.Odds}</Text>
            <Text>{rowData.Creator}</Text></View>}
          />
       </View>
      )
    }
  }

  export default StackNavigator({
      Welcome: {
        screen: WelcomeScreen,
      },
      Register: {
        screen: RegisterScreen,
      },
      Login: {
        screen: Login,
      },
      Bets: {
        screen: Bets,
      },
      NewBet: {
        screen: NewBet,
      },
      Leaderboard: {
        screen: Leaderboard,
      },
      Profile: {
        screen: Profile,
      },
    }, {initialRouteName: 'Welcome'});

  const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#8e1ea8',
      },
      pics: {
        flex: .25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#8e1ea8',
        paddingTop: 10,
        paddingBottom: 50,
        marginTop: 10,
        marginLeft: 50,
        marginRight: 50,
      },
      containerFull: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#8e1ea8',
      },
      welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
      },
      textBox:  {
        height: 40,
        borderWidth: 1,
        width: 300,
        margin: 10,
        padding: 5
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
        color: '#11f7ef',
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
        backgroundColor: 'black'
      },
      buttonLabel: {
        textAlign: 'center',
        fontSize: 16,
        color: 'white'
      }
    });
