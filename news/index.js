import 'isomorphic-fetch';
import express from 'express';
import { catchAsync } from '../utils';
import { fetchKNB } from '../knbapi';
import { NewsItem } from '../models/newsItem';
import cache from 'memory-cache';
import { CronJob } from 'cron';

const router = express.Router();

const rubric = process.env.E3_RUBRIC || 'e3_2017';

router.get('/', catchAsync(async (req,res) => {
  let cached = cache.get('news');
  if (!cached || cached.length === 0) {
    const results = await NewsItem.find({}).sort({ pubdate: -1 }).exec();
    cache.put('news', results, 600000);
    cached = results;
  }
  res.send({
    status: 'OK',
    restults: cached,
  })
}));

router.get('/update', catchAsync(async (req,res) => {
  const data = await updateNews(req);
  res.status(200).send({
    'status': 'OK',
    results: data,
  });
}));

const updateNews = async (req) => {
  let json = await fetchKNB(`http://kanobu.ru/api/news/by-rubric/${rubric}?page=${(req.query && req.query.page) || '1'}`);
  // retry, but only once
  if (!json) {
    json = await fetchKNB(`http://kanobu.ru/api/news/by-rubric/${rubric}?page=${(req.query && req.query.page) || '1'}`);
  }

  const news = json.results;
  return NewsItem.checkAndStore(news);
};

const update = new CronJob('00 */1 * * * *', async () => {
  const news = await updateNews({});
  console.log(`Updated with ${news.length} new news`);
}, true, 'Europe/Moscow');

export default router;