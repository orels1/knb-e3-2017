import 'isomorphic-fetch';
import express from 'express';
import { catchAsync } from '../utils';
import { fetchKNB } from '../knbapi';
import { ArticleItem } from '../models/articleItem';
import cache from 'memory-cache';
import { CronJob } from 'cron';

const router = express.Router();

const rubric = process.env.E3_RUBRIC || 'e3_2017';

router.get('/', catchAsync(async (req,res) => {
  let cached = cache.get('articles');
  if (!cached || cached.length === 0) {
    const results = await ArticleItem.find({}).sort({ pubdate: -1 }).exec();
    cache.put('articles', results, 600000);
    cached = results;
  }
  res.send({
    status: 'OK',
    restults: cached,
  })
}));

router.get('/update', catchAsync(async (req,res) => {
  const data = await updateArticles(req);
  res.status(200).send({
    'status': 'OK',
    results: data,
  });
}));

const updateArticles = async (req) => {
  let json = await fetchKNB(`http://kanobu.ru/api/articles/by-rubric/${rubric}?page=${(req.query && req.query.page) || '1'}`);
  // retry, but only once
  if (!json) {
    json = await fetchKNB(`http://kanobu.ru/api/articles/by-rubric/${rubric}?page=${(req.query && req.query.page) || '1'}`);
  }

  const news = json.results;
  return ArticleItem.checkAndStore(news);
};

const update = new CronJob('00 */1 * * * *', async () => {
  const articles = await updateArticles({});
  console.log(`Updated with ${articles.length} new articles`);
}, true, 'Europe/Moscow');

export default router;