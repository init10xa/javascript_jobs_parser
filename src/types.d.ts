import {postTypes} from "./constants";
import {v4} from "uuid/interfaces";

declare type IPost = {
  date: number,
  postType: postTypes,
  content: string,
  tags: string[],
  uuid: v4,
}