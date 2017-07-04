/**
 * Created by orel- on 14/May/17.
 */
const mongoose = require('mongoose');
const { map } = require('lodash');

const ArticleItemSchema = new mongoose.Schema({
  title: String,
  pic: String,
  pubdate: String,
  link: String,
  rubrics: { default: ['e3-2017'], type: [String] },
  tags: { default: [], type: [String] },
});

/**
 * Saves ArticleItems into the DB with duplicate checks
 * @param  {Array} data List of articles to insert into db
 * @returns {Promise} DB save promise
 */
ArticleItemSchema.statics.checkAndStore = async (data) => {
  // check if we have those articles

  // get latest ArticleItems from DB
  let inDB = [];
  try {
    inDB = await ArticleItem.find({}).select({ link: 1 }).exec();
  } catch (e) {
    console.log(e);
  }

  // define how many items we will insert
  let stopIndex = 10;
  // prepare for operations
  inDB = map(inDB, 'link');
  const dataLinks = map(data, 'link');

  if (inDB.length !== 0) {
    dataLinks.forEach((item, index) => {
      // if we have that item in the DB - we don't need the rest
      if (inDB.includes(item) && stopIndex === 10) {
        stopIndex = index;
        return false;
      }
    });
  }

  data.forEach(item => {
    item.tags = map(item.tags, tag => tag.name);
    item.rubrics = map(item.rubrics, rubric => rubric.name);
  });

  // remove stuff we do not need
  const finalData = data.slice(0, stopIndex);
  return ArticleItem.insertMany(finalData);
};


const ArticleItem = mongoose.model('ArticleItem', ArticleItemSchema);

exports.ArticleItem = ArticleItem;
