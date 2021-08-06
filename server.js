require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// extra middleware
app.use(express.urlencoded());
app.use(express.json());

// routes
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// solutions
app.post('/api/shorturl', function (req, res) {
  const postInput = req.body.url;

  res.json({ post_url: postInput });
  console.log({ post_url: postInput });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
