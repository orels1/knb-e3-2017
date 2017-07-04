import express from 'express';
import { map } from 'lodash';
import path from 'path';
import { fs } from 'mz';
import { v4 as uuid } from 'uuid';
import { catchAsync } from '../utils';
import { Bingo } from '../models/bingo';

const router = express.Router();

router.post('/activate', catchAsync(async (req, res) => {
  if (!req.body && !req.body.links || req.body.links.length === 0) {
    throw new Error('LinksListNotProvided');
  };
  const activated = await Bingo.activate(req.body.links);
  res.status(200).send({
    status: 'OK',
    results: true,
  });
}));

router.post('/', catchAsync(async (req, res) => {
  if (!req.body.base64img) {
    throw new Error('NoImgProvided');
  }
  // trim for saving
  const base64data = req.body.base64img.replace('data:image/jpeg;base64,', '');
  // generate unique id
  const bingoId = uuid();
  const publicId = uuid();
  // save file
  await fs.writeFile(path.join(__dirname, '../static', 'bingos', `bingo-${publicId}.jpg`), base64data, 'base64');
  // send data back to client
  const img = `http://e3.kanobu.ru/static/bingos/bingo-${publicId}.jpg`;
  const link = `http://e3.kanobu.ru/?bingo=${bingoId}`;
  const pubLink = `http://e3.kanobu.ru/?public=${publicId}`;
  const bingo = new Bingo({
    img,
    bingoId,
    link,
    pubLink,
    publicId,
  });
  let results = {};
  try {
    results = await bingo.save();
  } catch (e) {
    throw e;
  }
  res.status(200).send({
    status: 'ok',
    results,
  });
}));

router.put('/:bingoId', catchAsync(async (req, res) => {
  if (!req.body.base64img) {
    throw new Error('NoImgProvided');
  }
  const currBingo = await Bingo.findOne({ bingoId: req.params.bingoId }).exec();
  // trim for saving
  const base64data = req.body.base64img.replace('data:image/jpeg;base64,', '');
  // generate unique id
  const bingoId = req.params.bingoId;
  // save file
  await fs.writeFile(path.join(__dirname, '../static', 'bingos', `bingo-${currBingo.publicId}.jpg`), base64data, 'base64');
  // send data back to client
  res.status(200).send({
    status: 'ok',
    results: currBingo,
  });
}));

router.get('/:id', catchAsync(async (req, res) => {
  const results = await Bingo.findOne({ bingoId: req.params.id }).exec();
  if (!results) {
    throw new Error('NotFound');
  }
  res.status(200).send({
    status: 'OK',
    results,
  });
}));

export default router;