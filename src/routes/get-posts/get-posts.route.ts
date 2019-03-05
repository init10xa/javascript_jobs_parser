import {POSTS_LIMIT, postTypes} from "../../constants";
import {Post} from "../../db";
import {IPost} from "../../types";

export const getPosts = async (req: any, res: any) => {
  const {dateFrom, dateTo, keywords, postType, limit} = req.body;
  console.log(dateFrom, dateTo, keywords, postType, limit);

  const searchOptions: {
    tags?:
      { $in: string[] },
    postType?: postTypes,
    date?: { $gte?: number, $lte?: number },
  } = {};

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

  if (dateTo) {
    if (
      Number.isInteger(dateTo) &&
      dateTo > 0
    ) {
      searchOptions.date = {$lte: dateTo};

      if (dateFrom) {
        if (
          Number.isInteger(dateFrom) &&
          dateFrom > 0 &&
          dateFrom < dateTo &&
          dateTo < Math.round((+new Date() + 24 * 60 * 60) / 1000) // less then now plus one day
        ) {
          searchOptions.date.$gte = dateFrom;
        } else {
          res.json({err: "Invalid dateFrom format. It should be unix date seconds (1550565694: number)"});
          res.end();
          return false;
        }
      }
    } else {
      res.json({err: "Invalid dateTo format. It should be unix date seconds (1550565694: number)"});
      res.end();
      return false;
    }
  }

  if (postType && (postType === postTypes.resume || postType === postTypes.vacancy)) {
    searchOptions.postType = postType;
  }

  const limitParam = limit && limit < POSTS_LIMIT ? limit : POSTS_LIMIT;

  Post.find(searchOptions, null, {limit: limitParam}, (err: any, docs: any) => {
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
