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
  fullDescription: String,
  index: Number,
  tags: Array(String),
  pubDate: Number,
  postType: String,
});