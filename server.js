"use strict";
/**
 * Module dependencies.
 */

const http = require('http');
const routes = require('./routes');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const azure = require('azure-storage');
const config = require('./config');
const multiparty = require('multiparty');
const caption = require('./caption');
const mongoose = require('mongoose');

mongoose.connect(config.mongodbConnectionString);


const CaptionImage = require('./model');

const blobService = azure.createBlobService(config.connectionString);

const BLOB_BASE_URL = 'https://memezstorage.blob.core.windows.net/pictures/';


app.set('port', process.env.PORT || 3000);

app.post('/upload', function(req, res) {
  let name = null;
  let form = new multiparty.Form();

  function errorHandler(error) {
    res.send({ error: error });
  }

  function captionSuccess(caption) {
    const image = new CaptionImage({
      url: BLOB_BASE_URL + name,
      original_name: name,
      caption: caption
    });

    image.save(function(err) {
      if (err) throw err;

      res.json(image);
    });
  }

  function blobSaved(error) {
    if (error) {
      res.send({ Grrr: error });
      return;
    }
    
    console.log('Creating blob at URL:', BLOB_BASE_URL + name);

    caption.getCaptionFromUrl(BLOB_BASE_URL + name)
           .then(captionSuccess, errorHandler);
  }

  form.on('part', function(part) {
    if (part.filename) {
      let size = part.byteCount - part.byteOffset;

      name = part.filename;

      blobService.createBlockBlobFromStream('pictures', name, part, size, blobSaved);

      return;
    }

    form.handlePart(part);
  });

  form.parse(req);
});


app.get('/upload', function(req, res) {
  res.send("<html>" +
              "<body>" +
                "<form ref='uploadForm' " +
                  "id='uploadForm' " +
                  "action='/upload' " +
                  "method='post' " +
                  "encType='multipart/form-data'>" +
                    "<input type='file' name='sampleFile' />" +
                    "<input type='submit' value='Submit image!' />" +
                "</form>" +
              "</body>" +
          "</html>");
});

app.get('/images', function(req, res) {
  CaptionImage.find({}, function(err, images) {
    if (err) throw err;

    res.json(images);
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
