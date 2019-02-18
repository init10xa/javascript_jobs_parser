import {MONGODB} from "./constants";
const mongoose = require("mongoose");

mongoose.connect(MONGODB, {
  useNewUrlParser: true,
});

export const db = mongoose.connection;

db.on("error", (err: any) => console.error(JSON.stringify(err, null , 2)));
db.once("open", function() {
  console.log("MongoDB connected!");
});

export const Post = mongoose.model("Posts", {
  uuid: String,
  content: String,
  tgMessageIndex: Number,
  tags: Array(String),
  date: Number,
  postType: String,
});
