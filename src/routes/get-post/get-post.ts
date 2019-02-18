import {Post} from "../../db";

export function getPost(req: any, res: any) {
  const {uuid} = req.body;

  if (uuid) {
    Post.findOne({ uuid }, (err: any, docs: any) => {
      if (err) {
        console.log(err);
        res.json({ error: err });
        res.end();
      }

      res.send({
        post: docs,
      });
      res.end();
    });
  }
}
