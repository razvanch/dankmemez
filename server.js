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
 
app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  let sampleFile = req.files.sampleFile;
 
  console.log(sampleFile);

  res.status(200).send(sampleFile.name);
});

app.get('/upload', function(req, res) {
  res.send("<html>" +
              "<body>" +
                "<form ref='uploadForm' " +
                  "id='uploadForm' " +
                  "action='http://icaption.azurewebsites.net/upload' " +
                  "method='post' " +
                  "encType='multipart/form-data'>" +
                    "<input type='file' name='sampleFile' />" +
                    "<input type='submit' value='Submit image!' />" +
                "</form>" +
              "</body>" +
          "</html>");
});

app.get('/images', function(req, res) {
  const images = [
    { url: 'https://memezstorage.blob.core.windows.net/demoblockblobcontainer/picture0',
      caption: 'Aaron Hernandez eating a hot dog' },
    { url: 'https://memezstorage.blob.core.windows.net/demoblockblobcontainer/picture1',
      caption: 'Chester Bennington et al. pose for a picture' },
    { url: 'https://memezstorage.blob.core.windows.net/demoblockblobcontainer/picture2',
      caption: 'a little boy holding a baseball bat' },
    { url: 'https://memezstorage.blob.core.windows.net/demoblockblobcontainer/picture3',
      caption: 'a woman standing in the dark' },
    { url: 'https://memezstorage.blob.core.windows.net/demoblockblobcontainer/picture4',
      caption: 'a bird perched on top of a tree' },
    { url: 'https://memezstorage.blob.core.windows.net/demoblockblobcontainer/picture5',
      caption: 'a small dog' },
    { url: 'https://memezstorage.blob.core.windows.net/demoblockblobcontainer/picture6',
      caption: 'a blender filled with coffee' },
    { url: 'https://memezstorage.blob.core.windows.net/demoblockblobcontainer/picture7',
      caption: 'person sitting on a bed' },
    { url: 'https://memezstorage.blob.core.windows.net/demoblockblobcontainer/picture8',
      caption: 'a red and white cake' },
    { url: 'https://memezstorage.blob.core.windows.net/demoblockblobcontainer/picture9',
      caption: 'a group of people walking down a rainy city street' }
  ];

  res.json(images);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
