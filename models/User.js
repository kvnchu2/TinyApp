const mongoose = require('mongoose');

const user = new mongoose.Schema({
  id: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  }
});


module.exports = User = mongoose.model('user', user);