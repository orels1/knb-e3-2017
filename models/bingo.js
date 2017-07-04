/**
 * Created by orel- on 14/May/17.
 */
const mongoose = require('mongoose');

const BingoSchema = new mongoose.Schema({
  img: String,
  bingoId: String,
  publicId: String,
  pubLink: String,
  link: String,
  activated: { type: Boolean, default: false },
});

/**
 * Activates bingos within the list of links
 * @param {Array} list List of links to activate
 * @returns {Promise} DB update promise
 */
BingoSchema.statics.activate = async (list) => (
  Bingo.updateMany({ activated: false, link: { '$in': list } }, { activated: true })
);

const Bingo = mongoose.model('Bingo', BingoSchema);

exports.Bingo = Bingo;
