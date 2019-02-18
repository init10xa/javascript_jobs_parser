import {messageText} from "tdl/types/tdlib";
import uuidv from "uuid/v4";
import {postTypes} from "../constants";
import {Post} from "../db";

export function formatMessageToMongoModel(message: any) {
  const rowContent = message.content.text.text;
  const {tags, text, postType} = getPostParamsFromRawMessage(rowContent);

  return {
    content: text,
    date: message.date,
    postType,
    tags,
    tgMessageIndex: message.id,
    uuid: uuidv(),
  };
}

export async function saveMessageToDB(message: any) {
  if (message && message.content && message.content.text && message.content.text.text) {
    const post = new Post(
      formatMessageToMongoModel(message),
    );

    try {
      await post.save();
    } catch (err) {
      console.log(err);
    }
  } else {
    return false;
  }
}

export function getPostParamsFromRawMessage(rawText: messageText["text"]["text"]) {
  const regexp = /(|^)#[a-zA-Zа-яА-ЯёЁ]+/gm;
  const hashtags = rawText.match(regexp);
  const tags = hashtags && hashtags.map( (tag: string) => tag.trim().substr(1));

  const postType = rawText.match(/(Обсуждение вакансии в чате)/) ? postTypes.vacancy : postTypes.resume;

  const text = rawText
    .replace(/((\r\n|\r|\n)—(\s|\s\s)👉 Обсуждение (резюме|вакансии) в чате @javascript_jobs)/gmu, "")
    .replace(regexp, "") // remove hashtags
    .replace(/(\r\n|\r|\n){2}/g, "$1") // remove double break line
    .replace(/(\r\n|\r|\n){3,}/g, "$1\n") // remove triple break line
    .replace(/[\r\n]+$/gm, ""); // remove last break line

  return {tags, text, postType};
}
