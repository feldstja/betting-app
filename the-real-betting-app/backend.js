const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const axios = require('axios')

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json())

app.get('/ping', function (req, res) {
  return res.send('pong');
});

const http = require('http');
const socketIO = require('socket.io');

const server = http.Server(app);
const io = socketIO(server);

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const models = require('./Models.js');

const User = models.User;
const Bets = models.Bet;


mongoose.connect(process.env.MONGODB_URI);

// app.get('/', function (req, res) {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
//
// app.get('/currency', function(req, res){
//   axios("https://api.hitbtc.com/api/2/public/ticker", {
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       'Content-Type': 'application/json'
//     },
//     mode: 'no-cors'
//   })
//   .then((resp)=>{
//     var newArr = resp.data.map(({symbol, timestamp, volumeQuote})=> (
//       {symbol, timestamp, volumeQuote}
//     ))
//       res.json(newArr)
//   }).catch(function(err) {
//     console.log('ERROR:', err)
//   });
// })


io.on('connection', (socket) => {
  console.log('Connected to socket');

  socket.on('register', (data) => {
    // socket.emit('sup', {})
    data = JSON.parse(data)
    console.log('HELLLOOOOOOOOOOO')
    User.find({Username: data.Username}, function(err, res){
      if(err) {
        console.log('Error', err);
      } else if (res.length > 0) {
        console.log('User already exists');
      } else if (data.Username && data.Password) {
        const newUser = new User({
          Username: data.Username,
          Password: data.Password,
          Coins: 100
        });
        newUser.save((err, user) => {
          if (err) {
            console.log("EROOROROORORO:", err);
          } else {
            console.log('User Saved');
            socket.emit('registerSuccess', {success: true, data: user});
          }
        });
      }
    })
  });

  socket.on('login', (data) => {
    console.log(data)
    data = JSON.parse(data)

    User.findOne({Username : data.Username}, function(err, res){
      console.log("USER IS AS FOLLOWS:", res)
      if(!res){
        socket.emit('errMsg', {msg: "Incorrect Username"})
        console.log("Incorrect Username")
      }
      else if(res.Password !== data.Password){
        socket.emit('errMsg', {msg: "Incorrect Password"})
        console.log("Incorrect Password")
      }
      else if(err){
        console.log(err)
      }
      else{
        socket.user = res;
        console.log(socket.user)
        socket.emit('loginSuccess', {});
        socket.emit('loadUsers', socket.user)
      }
    });
  })


  socket.on('getBets', (data) => {
    Bets.find((err, bets)=>{
      if(err){
        console.log("ERR:", err)
      } else if(!bets.length){
        console.log("BETS1111:", bets)

        socket.emit('loadBets', [{username: 'hi'}])
      } else {
        console.log("BETS22222:", bets)
      socket.emit('loadBets', bets)
    }
    })
  })
})

//, (err, user) =>{
//   if (err) {
//     console.log(err);
//   } else if (!user) {
//     console.log('no such user')
//   } else if(user.Password !== data.Password) {
//     console.log(user.Password, data.Password);
//     console.log('Incorrect Password');
//   } else {
//     console.log('Successful Login');
//     socket.user = user;
//     socket.emit('loginSuccess', user._id);
//   }
// });
// socket.on('add', (data) => {
//   console.log(socket.user)
//    if (socket.user.FocusedCurrencies.indexOf(data) === -1) {
//     socket.user.FocusedCurrencies.push(data);
//     socket.user.save(function(err, user){
//       if(err) {
//         console.log(err)
//       } else {
//         console.log(`User began tracking ${data}`);
//         socket.emit('additionSuccess', socket.user.FocusedCurrencies)
//       }
//   })
// } else {
//     console.log("Error: You are already monitoring this currency.")
// }
// })
//
// // socket.on('getCoins', (user)=>{
// //   var user2 = User.findById(user.id)
// //   if(user2){
// //     console.log('hey2');
// //     socket.emit('usersCoins', user2.FocusedCurrencies)
// //   }
// //  })
//
// socket.on('remove', (data) => {
//       let removedIndex = socket.user.FocusedCurrencies.indexOf(data.symbol)
//       socket.user.FocusedCurrencies.splice(removedIndex, 1)
//       socket.user.save(function(err, user) {
//         if (err) {
//           console.log("Error: " + err)
//         } else {
//           console.log(`User no longer tracking ${data.symbol}.`);
//           socket.emit('removalSuccess', removedIndex)
//         }
//       })
//     })

// });
//


server.listen(3000, () => console.log('listening on :3000'));
