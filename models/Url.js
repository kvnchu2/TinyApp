const mongoose = require('mongoose');

const url = new mongoose.Schema({
  shortURL: {
    type: String
  },
  longURL: {
    type: String
  },
  userID: {
    type: String
  }
});


module.exports = Url = mongoose.model('url', url);