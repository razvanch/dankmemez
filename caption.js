// The exported functions in this module makes a call to Microsoft Cognitive Service Computer Vision API and return caption
// description if found. Note: you can do more advanced functionalities like checking
// the confidence score of the caption. For more info checkout the API documentation:
// https://www.microsoft.com/cognitive-services/en-us/Computer-Vision-API/documentation/AnalyzeImage
"use strict";


var request = require('request').defaults({ encoding: null });

var s_id = '9307443fb1ee4c7ba16fd09c81ee5401';

var VISION_URL = 'https://westeurope.api.cognitive.microsoft.com/vision/v1.0/analyze/?visualFeatures=Description&form=BCSIMG&subscription-key=' + s_id;

/** 
 * Gets the caption of the image from an image URL
 * @param {string} url The URL to an image.
 * @return {Promise} Promise with caption string if succeeded, error otherwise
 */
function getCaptionFromUrl(url) {
    return new Promise(
        function (resolve, reject) {
            var requestData = {
                url: VISION_URL,
                json: { 'url': url }
            };

            request.post(requestData, function (error, response, body) {
                if (error) {
                    reject(error);
                }
                else if (response.statusCode !== 200) {
                    reject(body);
                }
                else {
                    resolve(extractCaption(body));
                }
            });
        }
    );
};

/**
 * Extracts the caption description from the response of the Vision API
 * @param {Object} body Response of the Vision API
 * @return {string} Description if caption found, null otherwise.
 */
function extractCaption(body) {
    if (body && body.description && body.description.captions && body.description.captions.length) {
        return body.description.captions[0].text;
    }

    return null;
}

module.exports.getCaptionFromUrl = getCaptionFromUrl;

// function getCaptions() {
//     const baseUrl = 'https://memezstorage.blob.core.windows.net/demoblockblobcontainer/picture'

//     let i = 0;
//     let done = 0;
//     let images = [];

//     for (i = 0; i < 10; i++) {
//         let index = i;
//         let url = baseUrl + index.toString();

//         images.push({});

//         getCaptionFromUrl(url).then(function(caption) {
//             images[index].url = url;
//             images[index].caption = caption;

//             done++;

//             if (done == 10) {
//                 console.log(images);
//             }
//         }, function(err) {
//             console.log(err);
//         });
//     }
// }

// getCaptionFromUrl('https://scontent.xx.fbcdn.net/v/t34.0-12/18072828_1311417535608377_424380262_n.jpg?oh=8da272a8f3ead657f41036c0a9e86879&oe=58FD7AAB').then(function(caption) {
//     console.log(caption);
// }, function(err) {
//     console.log(err);
// });