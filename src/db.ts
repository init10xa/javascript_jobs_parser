import mongoose, {Schema} from "mongoose";
import {v4} from "uuid/interfaces";
import {MONGODB, postTypes} from "./constants";

if (!MONGODB) {
  throw new Error("Mongodb string is undefined");
}

mongoose.connect(MONGODB, {
  useNewUrlParser: true,
});

export const db = mongoose.connection;

db.on("error", (err: any) => console.error(JSON.stringify(err, null , 2)));
db.once("open", () => {
  console.log("MongoDB connected!");
});

interface IPostSchema extends mongoose.Document {
  content: string;
  date: number;
  postType: postTypes;
  tags: string[];
  tgMessageIndex: number;
  uuid: v4;
}

const PostSchema: mongoose.Schema = new Schema({
  content: String,
  date: Number,
  postType: String,
  tags: Array(String),
  tgMessageIndex: Number,
  uuid: String,
});

export const Post = mongoose.model<IPostSchema>("Posts", PostSchema);
