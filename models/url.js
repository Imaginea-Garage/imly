let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let urlSchema = new Schema({
  url: String,
  hash: String
});

module.exports = mongoose.model('url', urlSchema);