import {MAX_POSTS_ON_PAGE, postTypes} from "../../constants";
import {Post} from "../../db";
import {IPost} from "../../types";

export const getPosts = async (req: any, res: any) => {
  const {keywords, postType, date} = req.body;

  const searchOptions: { tags?: { $in: string[] }, postType?: number, date?: { $gte: number } } = {};

  if (keywords && keywords instanceof Array && keywords.length < 10) {
    const keywordsItems: string[] = [];

    keywords.forEach((keyword: string) => {
      if (keyword.length > 2 && keyword.length < 20) {
        keywordsItems.push(keyword);
      }
    });

    if (keywordsItems.length > 0) {
      searchOptions.tags = {$in: keywordsItems};
    }
  }

  const oldestPost = await Post.findOne({}, {}, {created_at: 1});
  if (!oldestPost) {
    res.json({err: "Cant find oldest post date"});
    return;
  }
  const oldestPostDate = oldestPost.date;
  const unixTimeNow = +new Date();

  if (date) {
    if (date.length === 10 && date > oldestPostDate && date < unixTimeNow) {
      const searchFromDate = +((unixTimeNow - date) / 1000).toFixed(0);
      searchOptions.date = {$gte: searchFromDate};
    } else {
      res.status(500);
      res.json({err: "Invalid date format. It should be unix date seconds (1550565694: number)"});
      return;
    }
  } else {
    searchOptions.date = {$gte: 24 * 60 * 60};
  }

  if (postType && (postType === postTypes.resume || postType === postTypes.vacancy)) {
    searchOptions.postType = postType;
  }

  Post.find(searchOptions, null, {limit: MAX_POSTS_ON_PAGE}, (err: any, docs: IPost[]) => {
    const cleanedDocs = docs.map((doc: IPost) => {
      return {
        content: doc.content,
        date: doc.date,
        postType: doc.postType,
        tags: doc.tags,
        uuid: doc.uuid,
      };
    });
    res.send({
      posts: cleanedDocs,
    });
  });
};
