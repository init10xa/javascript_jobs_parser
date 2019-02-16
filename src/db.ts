import {MONGODB, postTypes} from "./constants";
import uuidv from 'uuid/v4';
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
  const text = message.content.text.text;

  const tags = findHashtags(text);
  const postType = tags.length ? postTypes.resume : setPostType(tags);

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
    const messageFormattedToMongoModel = formatMessageToMongoModel(message);
    const post = new Post(
      messageFormattedToMongoModel
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

export function findHashtags(searchText: any) {
  const regexp = /(|^)#[a-zA-Zа-яА-ЯёЁ]+/gm;
  let result = searchText.match(regexp);
  if (result) {
    result = result.map(function (s: any) {
      return s.trim().substr(1);
    });
    return result;
  } else {
    return [];
  }
}

const dictionary = [
  'вакансия',
  'vacancy',
  'job'
];

export function setPostType(tags: any) {
  if (tags) {
    const isVacancy = tags.some((tag: string) => {
      return dictionary.some((dictionaryItem:string) => {
        return dictionaryItem === tag.toLowerCase();
      })
    });
    return isVacancy ? postTypes.vacancy : postTypes.resume;
  } else {
    return postTypes.resume
  }
}
