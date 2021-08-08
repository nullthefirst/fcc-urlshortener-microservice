require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

// Database Setup
const mongo_uri = process.env.MONGO_URI;

mongoose.connect(mongo_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.MONGO_DBNAME,
});

const db = mongoose.connection;

if (!db) {
  console.log('Error connecting to MongoDB');
} else {
  console.log('Succcessfully connected MongoDB');
}

// MongoDB Schema Definition

const ShortenedUrlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: Number,
    default: 1,
  },
});

const ShortenedUrl = mongoose.model('ShortenedUrl', ShortenedUrlSchema);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));

// Extra Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// Solutions
app.post('/api/shorturl', async function (req, res) {
  const postInput = req.body.url;
  const filteredUrl = new URL(postInput);

  if (filteredUrl.protocol !== 'http:' && filteredUrl.protocol !== 'https:') {
    return res.json({ error: 'invalid url' });
  } else {
    const shortLinks = await ShortenedUrl.find({});

    try {
      if (shortLinks.length > 0) {
        const lastValues = shortLinks[shortLinks.length - 1];
        let newInt = lastValues.short_url + 1;

        const link = new ShortenedUrl({
          original_url: postInput,
          short_url: newInt,
        });

        link.save(function (err) {
          if (err) res.json({ errorMessage: error });

          res.json({
            original_url: link.original_url,
            short_url: link.short_url,
          });
        });
      } else {
        const link = new ShortenedUrl({ original_url: postInput });

        link.save(function (err) {
          if (err) res.json({ errorMessage: error });

          res.json({
            original_url: link.original_url,
            short_url: link.short_url,
          });
        });
      }
    } catch (error) {
      res.json({ errorMessage: error });
    }
  }
});

app.get('/api/shorturl/:short_url', async function (req, res) {
  if (
    !isNaN(parseInt(req.params.short_url))
    /* verify that input is a number */
  ) {
    ShortenedUrl.findOne(
      {
        short_url: req.params.short_url,
      },
      function (err, selectLink) {
        if (err) res.json({ errorMessage: err });

        res.redirect(selectLink.original_url);
      },
    );
  } else {
    res.json({ errorMessage: 'invalid short url' });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
