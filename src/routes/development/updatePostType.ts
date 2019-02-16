import {Post} from "../../db";
import {postTypes} from "../../constants";

export const updatePostType = async (req: any, res: any)  => {
  const updatedPosts: any[] = [];
  await Post.find({}, (err: any, posts: any)=> {
    posts.forEach(async (post: any) => {
      const tags = post.tags;
      const currentPostType = post.postType;
      const newPostType = setPostType(tags);
      if (newPostType !== currentPostType) {
        post.postType = newPostType;
        const savedPost = await post.save();
        updatedPosts.push(savedPost);
      }
    });
  });

  res.json({
    answer: updatedPosts
  });
};

const dictionary = [
  'вакансия',
  'vacancy',
  'job'
];

function setPostType(tags: string[]) {
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
