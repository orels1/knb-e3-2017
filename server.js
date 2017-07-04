require('babel-register');
require('babel-polyfill');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

app.use(require('body-parser').json({
  limit: '5000kb',
}));

app.use('/static', express.static(path.join(__dirname, 'static')));

// Connect to a db with 2s retry policy
mongoose.Promise = require('bluebird');
const connectWithRetry = () => {
  mongoose.connect(process.env.MONGO_URL || 'localhost/e3-2017', { server: { auto_reconnect:true } }, (err) => {
    if (err && err.message && err.message.match(/failed to connect to server .* on first connect/)) {
      console.log('Failed to connect, retrying');
      setTimeout(connectWithRetry, 2000);
    }
  });
}
connectWithRetry();


// Data
const { NewsItem } = require('./models/newsItem');
const { ArticleItem } = require('./models/articleItem');
const { Bingo } = require('./models/bingo');
const cache = require('memory-cache');

// Routes
app.use('/api/news', require('./news').default);
app.use('/api/articles', require('./articles').default);
app.use('/api/bingo', require('./bingo').default);

/*
* Frontend
* */
const pug = require('pug');
const React = require('react');
const { renderToString } = require('react-dom/server');
const App = require('./app/components/App');

app.get('/', async (req, res) => {
  // check for caches, if there aren't any - create cache for 10 min
  let newsCache = cache.get('news');
  if (!newsCache || newsCache.length === 0) {
    newsCache = await NewsItem.find({}).sort({ pubdate: -1 }).exec();
    cache.put('news', newsCache, 60000);
  }
  let articlesCache = cache.get('articles');
  if (!articlesCache || articlesCache.length === 0) {
    articlesCache = await ArticleItem.find({}).sort({ pubdate: -1 }).exec();
    cache.put('articles', articlesCache, 60000);
  }

  // if we have a bingo link - load it
  let bingo = false;
  if (req.query.bingo) {
    bingo = await Bingo.find({ bingoId: req.query.bingo }).exec();
    bingo = bingo.length === 0 ? false : bingo[0];
  }
  if (req.query.public) {
    bingo = await Bingo.find({ publicId: req.query.public }).select({ image: 1, publicId: 1, pubLink: 1 }).exec();
    bingo = bingo.length === 0 ? false : bingo[0];
  }

  const sharing = bingo ? `http://e3.kanobu.ru/static/bingos/bingo-${bingo.publicId}.jpg` : 'http://e3.kanobu.ru/static/knb-share.jpg';

  const data = {
    page: 1,
    carousel_page: 1,
    news: newsCache,
    articles: articlesCache,
    showBingo: bingo ? true : false,
    bingo,
    globalStyle: '',
    activeStream: {},
    streamType: 'kanobu',
    next: {},
    streams: [
      {
        id: 'ea',
        active: true,
        name: 'EA',
        start: '2017-06-10T22:00+0300',
        links: {
          kanobu: 'https://youtu.be/lKppDiRVlVU',
          original: 'https://youtu.be/P9BB0ambDQw',
          text: '/static/text-streams/ea.html',
        }
      },
      {
        id: 'xbox',
        name: 'Xbox',
        start: '2017-06-12T00:00+0300',
        links: {
          kanobu: 'https://youtu.be/Pdiwzi-9Vo8',
          original: 'http://player.twitch.tv/?channel=xbox&autoplay=false&muted=false',
          text: '/static/text-streams/xbox.html',
        }
      },
      {
        id: 'bethesda',
        name: 'Bethesda',
        start: '2017-06-12T07:00+0300',
        links: {
          kanobu: 'https://youtu.be/QWQEzEVFw5k',
          original: 'http://player.twitch.tv/?channel=bethesda&autoplay=false&muted=false',
          text: '/static/text-streams/bethesda.html',
        }
      },
      {
        id: 'pc',
        name: 'PC',
        start: '2017-06-12T20:00+0300',
        links: {
          kanobu: 'https://youtu.be/RLjl1ZpR3Mw',
          original: 'http://player.twitch.tv/?channel=pcgamer&autoplay=false&muted=false',
          text: '/static/text-streams/pc.html',
        }
      },
      {
        id: 'ubisoft',
        name: 'Ubisoft',
        start: '2017-06-12T23:00+0300',
        links: {
          kanobu: 'https://youtu.be/8Isk1azsKqc',
          original: 'http://player.twitch.tv/?channel=ubisoft&autoplay=false&muted=false',
          text: '/static/text-streams/ubisoft.html',
        }
      },
      {
        id: 'sony',
        name: 'Sony',
        start: '2017-06-13T04:00+0300',
        links: {
          kanobu: 'https://youtu.be/6snXWQe84S8',
          original: 'http://player.twitch.tv/?channel=playstation&autoplay=false&muted=false',
          text: '/static/text-streams/sony.html',
        }
      },
    ],
  };
  const element = React.createFactory(App.default);
  const html = renderToString(element({
    data,
  }));
  const page = pug.renderFile(path.join(__dirname, 'app', 'views', 'index.pug'),
  { 
    html,
    'props': JSON.stringify({
      data,
    }),
    sharing,
    canonical: bingo ? `http://e3.kanobu.ru/?public=${bingo.publicId}` : 'http://e3.kanobu.ru',
  });
  res.status(200).send(page);
});

app.get('/robots.txt', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.status(200).send(`User-agent: Googlebot

User-agent: Yandex
Host: e3.kanobu.ru

User-agent: *`);
})

app.listen(process.env.E3_PORT || 3000, () => {
  console.info('Running');
});

app.use((err, req, res, next) => {
  console.error(err);
  switch (err.message) {
  case 'NotFound':
    return res.status(404).send({
      status: 'ERROR',
      error: err.message,
    });
  default:
    return res.status(500).send({
      status: 'ERROR',
      error: err.message,
    });
  }
});
