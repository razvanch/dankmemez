"use strict";
/**
 * Module dependencies.
 */

const http = require('http');
const routes = require('./routes');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
 
// default options 
app.use(fileUpload());

app.set('port', process.env.PORT || 3000);
 
app.post('/images', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  let sampleFile = req.files.sampleFile;
 
  console.log(sampleFile);

  res.status(200).send(sampleFile.name);
});

app.get('/images', function(req, res) {
  res.send("<html>" +
              "<body>" +
                "<form ref='uploadForm' " +
                  "id='uploadForm' " +
                  "action='http://localhost:3000/images' " +
                  "method='post' " +
                  "encType='multipart/form-data'>" +
                    "<input type='file' name='sampleFile' />" +
                    "<input type='submit' value='Submit image!' />" +
                "</form>" +
              "</body>" +
          "</html>");
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
