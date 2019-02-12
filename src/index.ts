const express = require('express');
const app = express();
const bodyParser = require("body-parser");

import {getPosts} from "./routes/get-posts/get-posts.route"
import {regeneratePosts} from "./routes/development/development"

const port = 5000;

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
app.post('/dev-regenerate-posts', regeneratePosts);
