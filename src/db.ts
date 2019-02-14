const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/parser', {
  useNewUrlParser: true
});

export const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

export const Post = mongoose.model('Posts', {
  uuid: String,
  content: String,
  tgMessageIndex: Number, //id 7381975040
  tags: Array(String),
  date: Number, // date 1550062222
  postType: String,
});