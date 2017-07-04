/**
 * Created by orel- on 25/May/17.
 */
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    autoprefixer({
      browsers: [
        'last 2 versions',
        'IE >= 9',
        'safari >= 8'
      ]
    })
  ]
};