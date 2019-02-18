import {v4} from "uuid/interfaces";
import {postTypes} from "./constants";

declare interface IPost {
  date: number;
  postType: postTypes;
  content: string;
  tags: string[];
  uuid: v4;
}
