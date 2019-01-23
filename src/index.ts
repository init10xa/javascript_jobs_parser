const express = require('express');
const app = express();
const port = process.env.PORT || 80;

// start the server
app.listen(port, () => {
  console.log('app started');
});

// route our app
app.get('/', (req: any, res: any) => {
  console.log(req, res);
  res.send('hello world!');
});