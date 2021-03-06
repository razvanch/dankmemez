"use strict";

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const captionImageSchema = new Schema({
  url : String,
  caption: String,
  original_name: String,
  votes: { type: Number, default: 0 },
  personal: { type: Boolean, default: false }
});

const CaptionImage = mongoose.model('CaptionImage', captionImageSchema);

module.exports = CaptionImage;
