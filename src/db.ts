import {MONGODB, postTypes} from "./constants";
import uuidv from 'uuid/v4';
import {messageText} from "tdl/types/tdlib";
const mongoose = require('mongoose');

mongoose.connect(MONGODB, {
  useNewUrlParser: true,
});

export const db = mongoose.connection;

db.on('error', (err:any) => console.error(JSON.stringify(err, null ,2)));
db.once('open', function() {
  console.log('MongoDB connected!')
});

export const Post = mongoose.model('Posts', {
  uuid: String,
  content: String,
  tgMessageIndex: Number,
  tags: Array(String),
  date: Number,
  postType: String,
});

export function formatMessageToMongoModel(message: any) {
  const rowContent = message.content.text.text;
  const {tags, text, postType} = getPostParamsFromRawMessage(rowContent);

  return {
    uuid: uuidv(),
    content: text,
    tgMessageIndex: message.id,
    tags: tags,
    date: message.date,
    postType: postType,
  };
}

export async function saveMessageToDB(message: any) {
  if (message && message.content && message.content.text && message.content.text.text) {
    const post = new Post(
      formatMessageToMongoModel(message)
    );

    try {
      await post.save();
    } catch (err) {
      console.log(err)
    }
  } else {
    return false
  }
}

export function getPostParamsFromRawMessage(rawText: messageText["text"]["text"]) {
  const regexp = /(|^)#[a-zA-Zа-яА-ЯёЁ]+/gm;
  let hashtags = rawText.match(regexp);
  const tags = hashtags && hashtags.map( (tag: string) => tag.trim().substr(1));

  const postType = rawText.match(/(Обсуждение вакансии в чате)/) ? postTypes.vacancy : postTypes.resume;

  const text = rawText
    .replace(/(—(\s|\s\s)👉 Обсуждение (резюме|вакансии) в чате @javascript_jobs)/gmu, '')
    .replace(regexp, '')
    .replace(/(\r\n|\r|\n){2}/g, '$1')
    .replace(/(\r\n|\r|\n){3,}/g, '$1\n');

  return {tags, text, postType};
}
