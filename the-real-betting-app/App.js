import React from 'react';
// import AsyncStorage from 'localStorage';
import { StyleSheet, View, Text, Animated, TouchableOpacity, AsyncStorage, TextInput, ListView, Alert, Image, Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import io from 'socket.io-client';
const socket = io('https://70028b0e.ngrok.io');
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
            <Text style={styles.textBigs}>Welcome to LongShot!</Text>
            <TouchableOpacity onPress={ () => {this.press()} } style={[styles.button, styles.buttonBlack]}>
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
      }))
        socket.on('registerSuccess', data => {
          if (data.success) {
            this.props.navigation.navigate('Welcome')
          }
        })
    }

    render() {
      return (
        <View style={styles.container}>
          <View>
            <Text style={styles.textBigs}>Register</Text>
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
          <TouchableOpacity style={[styles.buttonFinal, styles.buttonBlack]} onPress={() => {this.submitInfo()}}>
            <Text style={styles.buttonLabel}>Register</Text>
          </TouchableOpacity>
          <Image source={{uri: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5d/Columbus_Blue_Jackets_logo.svg/1200px-Columbus_Blue_Jackets_logo.svg.png'}}
          style={{width: 150, height: 150, marginRight: 70, marginTop: 30}} />
          <Image source={{uri: 'http://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/2384.png&w=350&h=254'}}
          style={{width: 75, height: 75, marginLeft: 40, marginTop: 10}} />
          <Image source={{uri: 'https://i.pinimg.com/236x/c8/73/ba/c873ba10e928b99be94760d2bd56de73--sports-graphics-school-football.jpg'}}
          style={{width: 105, height: 130, marginLeft: 100, marginTop: 10}} />
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
        await AsyncStorage.setItem("user", JSON.stringify(data));
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
            <Text style={styles.textBigs}>Welcome Back!</Text>
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
          <TouchableOpacity style={[styles.buttonFinal, styles.buttonBlack]} onPress={() => {this.submitInfo()}}>
            <Text style={styles.buttonLabel}>Login</Text>
          </TouchableOpacity>
          <Image source={{uri: 'https://media.giphy.com/media/yP6OztYXzgyM8/giphy.gif'}}
          style={{width: 220, height: 170, marginRight: 50, marginTop: 30}} />
          <Image source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReSHDFBGrvzjuseSouI71tz0eHLIln1hwSV-V6MG31VN2DR_wLRQ'}}
          style={{width: 250, height: 140, marginRight: 50, marginTop: 30}} />
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
        self.setState({
          user: user
        })
        console.log("USER IN DATA:", user)
      }
      socket.on('loadPage', (user)=>{
        self.setState({
          name: user.Username,
          coins: user.Coins,
          user: user
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
      socket.on('betJoined', (data) => {
        data.bet.Opponent = data.user.Username
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

    TakeBet(theBet){
      socket.emit('joinBet', {user: this.state.user, bet: theBet})
    }

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
      var self = this
      return (
        <View style={styles.container}>
          <Text style={{fontSize: 20}}>{self.state.user.Username} ---  {this.state.coins}</Text>
          <ListView
            enableEmptySections={true}
            dataSource={this.state.dataSource}
            //Username of each user
            renderRow={(rowData) => <View style={{borderWidth: 1, flex: 1, margin: 5, padding: 5, backgroundColor: 'white'}}>
              <Text key={rowData._id}>{rowData.Text}</Text>
              <Text>{rowData.Amount} Coins</Text>
              <Text>{rowData.Creator}</Text>
              {(rowData.Opponent === "none") ?
              <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={() => {this.TakeBet(rowData)}}>
                <Text style={styles.buttonLabel}>Bet</Text>
              </TouchableOpacity>
              : <Text>BET TAKEN ALREADY</Text>}
            </View>}
          />
            <TouchableOpacity onPress={()=>{this.newBet()}} style={[styles.buttonFinal, styles.buttonBlack, {marginBottom: 10}]}>
              <Text style={styles.buttonLabel}>Create New Bet</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{this.Profile()}} style={[styles.buttonFinal, styles.buttonBlue, {marginBottom: 30}]}>
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
    }

    submit() {
      socket.emit('addBet', JSON.stringify({
        text: this.state.text,
        amount: this.state.amount,
        odds: this.state.odds,
        creator: this.state.user.Username
      }))
      socket.on('betSaved', (data)=>{
        socket.emit('changePage', this.state.user)
        this.props.navigation.navigate('Bets')
      })
    }

    render() {
      return (
        <View style={styles.container}>
          {this.state.user ?    <Text style={{fontSize: 20}}>{this.state.user.Username} ---  {this.state.user.Coins}</Text>
          : <Text>Loading...</Text>}
          <TextInput
            style={[styles.textBox, {marginTop: 10, backgroundColor: 'white'}]}
            placeholder="Enter Your Bet"
            onChangeText={(text) => this.setState({text: text})}
          />
          <TextInput
            style={[styles.textBox, {backgroundColor: 'white'}]}
            placeholder="Enter The Amount You Want To Bet"
            onChangeText={(text) => this.setState({amount: Number(text)})}
          />
          <TouchableOpacity onPress={()=>{this.submit()}} style={[styles.buttonFinal, styles.buttonBlack]}>
            <Text style={styles.buttonLabel}>Submit</Text>
          </TouchableOpacity>
          <Image source={{uri: 'https://www.adweek.com/tvnewser/wp-content/uploads/sites/3/2016/05/EI_55388_23989_41639b1e7498a68-660x400.jpg'}}
          style={{width: 200, height: 200, marginRight: 50, marginTop: 30}} />
          <Image source={{uri: 'http://dialogusci.info/wp-content/uploads/2018/06/jackie-robinson-quotes-jackie-robinson-quotes-life-is-not-a-spectator-sport.jpg'}}
          style={{width: 300, height: 130, marginRight: 70, marginTop: 50,  transform:[{rotate: '45 deg'}]}} />

          <Image source={{uri: 'http://www.booshsports.com/wp-content/uploads/2014/12/fights-FEATURED.jpg'}}
          style={{width: 130, height: 100, marginLeft: 150,}} />
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
          renderRow={(rowData) => <View style={{borderColor: 'black', borderWidth: 1, margin: 5, padding: 5, backgroundColor: 'white'}}>
            <Text> {rowData.Text}</Text>
            <Text >{rowData.Username}: {rowData.Coins} Coins</Text>
            <Text key={rowData._id}> {rowData.Text}</Text>
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
      socket.on('updatedUser', (theUser)=>{
        self.setState({
          user: theUser
        })
      })
    }

    allBets(){
      this.props.navigation.navigate('Bets')
      socket.emit('changePage', this.state.user)
    }

    lostBet(bet){
      socket.emit('lostBet', {
        user: this.state.user,
        bet: bet,
      })
    }

    wonBet(bet){
      console.log('hey')
      socket.emit('wonBet', {
        user: this.state.user,
        bet: bet,
      })
    }


    render() {
      return (
        <View style={styles.container}>
        <TouchableOpacity onPress={ () => {this.allBets()} } style={[styles.buttonFinal, styles.buttonBlack]}>
          <Text style={styles.buttonLabel}>Back to all bets</Text>
        </TouchableOpacity>
        {this.state.user ? <Text style={{marginTop: 20, fontSize: 36, flex: 1}}>{this.state.user.Username} --- {this.state.user.Coins}</Text>
        : <Text style={{marginTop: 20, fontSize: 36}}>Loading...</Text>}
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          //Username of each user
          renderRow={(rowData) => <View style={{borderWidth: 1, flex: 1, margin: 5, padding: 5, backgroundColor: 'white'}}>
            <Text key={rowData._id}>{rowData.Text}</Text>
            <Text>{rowData.Amount}</Text>
            <Text>{rowData.Odds}</Text>
            <Text>{rowData.Creator}</Text>
            {(rowData.CreatorWon === 0) ?
              <View>
            <TouchableOpacity onPress={ () => {this.wonBet(rowData)}} style={[styles.button, styles.buttonBlue]}>
              <Text style={styles.buttonLabel}>WON BET</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={ () => {this.lostBet(rowData)} } style={[styles.button, styles.buttonBlack]}>
              <Text style={styles.buttonLabel}>LOST BET</Text>
            </TouchableOpacity>
            </View>
            : (rowData.CreatorWon === 1) ? <Text>YOU LOST</Text>: <Text>YOU WON</Text>
          }
          </View>}
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
        backgroundColor: 'white',
      },
      textBigs: {
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
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
      },
      buttonRed: {
        backgroundColor: '#FF585B',
      },
      buttonBlue: {
        backgroundColor: '#0074D9',
      },
      buttonBlack: {
        backgroundColor: 'black'
      },
      buttonLabel: {
        textAlign: 'center',
        fontSize: 16,
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: 300
      },
      buttonFinal: {
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: 300
      },
    });
