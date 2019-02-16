import {updatePostType} from "./routes/development/updatePostType";

const express = require('express');
const app = express();
const bodyParser = require("body-parser");

import {getPosts} from "./routes/get-posts/get-posts.route"
import {getPost} from "./routes/get-post/get-post";
import {parser} from "./parser/parser";
import {regeneratePosts} from "./routes/development/regeneratePosts";

const port = process.env.PORT || 5000;

app.use(function(req: any, res: any, next: any) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// start the server
app.listen(port, () => {
  console.log('app started on port ' + port);
});

app.post('/get-posts', getPosts);
app.post('/get-post', getPost);
app.post('/dev-regenerate-posts', regeneratePosts);
app.post('/dev-update-post-type', updatePostType);

parser();
