import {Post} from '../../db';
import {dateRanges, postTypes} from "../../constants";

export function getPosts(req: any, res: any) {
  const {keywords, postType, date} = req.body;

  const searchOptions: {tags?: { $in: string[]}, postType?: postTypes, date?: { $gte: number} } = {};

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

  if (date && Object.values(dateRanges).some((item) => item === date)) {
    const pubDate = dateToUnixDate(date);
    const unixTimeNow = +new Date();
    const searchFromDate = +((unixTimeNow - pubDate) / 1000).toFixed(0);
    searchOptions.date = { $gte: searchFromDate}
  }

  if (postType && (postType === postTypes.resume || postType === postTypes.vacancy)) {
    searchOptions.postType = postType;
  }

  Post.find(searchOptions, (err: any, docs: any) => {
    res.send({
      posts: docs,
    })
  });
}

const dateToUnixDate = (date: dateRanges): number => {
  switch (date) {
    case dateRanges.lastDay:
      return 24 * 60 * 60 * 1000;
    case dateRanges.lastThreeDays:
      return 3 * 24 * 60 * 60 * 1000;
    case dateRanges.lastWeek:
      return 7 * 24 * 60 * 60 * 1000;
    case dateRanges.lastMonth:
      return 30 * 24 * 60 * 60 * 1000;
    case dateRanges.allPeriod:
      return 365 * 24 * 60 * 60 * 1000;
  }
};
