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
  function isValidURL(string) {
    // https://stackoverflow.com/a/49849482/10123365
    var res = string.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
    );
    return res !== null;
  }
  const postInput = req.body.url;

  if (isValidURL(postInput)) {
    res.json({ post_url: postInput });
  } else {
    res.json({ post_url: postInput, error: 'invalid url' });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
