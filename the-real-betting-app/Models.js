var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

const UserSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true
  },
  Password: {
    type: String,
    required: true
  },
  Coins: {
    type: Number,
    required: true
  }
})

const BetSchema = new mongoose.Schema({
  Text: {
    type: String,
    required: true
  },
  Amount: {
    type: Number,
    required: true
  },
  Odds: {
    type: Number,
    required: false
  },
  Creator: {
    type: String,
    required: true
  },
  Opponent: {
    type: String,
    required: true
  },
  CreatorWon: {
    type: Number,
    required: true
  },
})

// module.exports = mongoose.model('User', UserSchema);

var User = mongoose.model('User', UserSchema);
var Bet = mongoose.model('Bet', BetSchema);

module.exports={
  User: User,
  Bet: Bet
}
