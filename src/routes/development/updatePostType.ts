import {Post, setPostType} from "../../db";

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
