import bodyParser from "body-parser";
import express from "express";

import {parser} from "./parser/parser";
import {checkAndUpdateAllPosts} from "./routes/development/check-and-update-all-posts";
import {regeneratePosts} from "./routes/development/regeneratePosts";
import {getPost} from "./routes/get-post/get-post";
import {getPosts} from "./routes/get-posts/get-posts.route";

const port = process.env.PORT || 5000;
const app = express();

app.use((req: any, res: any, next: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());

// start the server
app.listen(port, () => {
  console.log("app started on port " + port);
});

app.post("/get-posts", getPosts);
app.post("/get-post", getPost);
app.post("/dev-regenerate-posts", regeneratePosts);
app.post("/dev-check-and-update-all-posts", checkAndUpdateAllPosts);

parser();
