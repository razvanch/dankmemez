
var fs = require('fs');
var util = require('util');
var guid = require('node-uuid');
var crypto = require('crypto');
var storage = require('azure-storage');
var config = require('./config');


function uploadFilesFromFolder(containerName, path) {
  // Create a blob client for interacting with the blob service from connection string
  // How to create a storage connection string - http://msdn.microsoft.com/en-us/library/azure/ee758697.aspx
  var blobService = storage.createBlobService(config.connectionString);

  console.log('Uploading files from path ' + path);

  // Create a container for organizing blobs within the storage account.
  console.log('Creating Container');
  blobService.createContainerIfNotExists(containerName, {publicAccessLevel : 'blob'}, function (error) {
    if (error) return callback(error);

    fs.readdir(path, function(err, items) {
      // console.log(items);

      for (var i=0; i<items.length; i++) {
          var file =  path + "/" + items[i];
          console.log("Uploading file " +  file + " in container " + containerName);
          var blockBlobName = containerName + "-" + items[i];
          blobService.createBlockBlobFromLocalFile(containerName, blockBlobName, file, function (error) {
            if (error) throw error;
          });
      }
    });
  });
}

function downloadFileFromStorage(containerName, blockBlobName, downloadName) {
	// Create a blob client for interacting with the blob service from connection string
	// How to create a storage connection string - http://msdn.microsoft.com/en-us/library/azure/ee758697.aspx
	var blobService = storage.createBlobService(config.connectionString);

	if (!downloadName)
		downloadName = blockBlobName;

	blobService.getBlobToLocalFile(containerName, blockBlobName, downloadName, function (error) {
          if (error) throw error;
      });
}


/**
* Lists blobs in the container.
* @ignore
*
* @param {BlobService}        blobService                         The blob service client.
* @param {string}             container                           The container name.
* @param {object}             token                               A continuation token returned by a previous listing operation.
*                                                                 Please use 'null' or 'undefined' if this is the first operation.
* @param {object}             [options]                           The request options.
* @param {int}                [options.maxResults]                Specifies the maximum number of directories to return per call to Azure ServiceClient.
*                                                                 This does NOT affect list size returned by this function. (maximum: 5000)
* @param {LocationMode}       [options.locationMode]              Specifies the location mode used to decide which location the request should be sent to.
*                                                                 Please see StorageUtilities.LocationMode for the possible values.
* @param {int}                [options.timeoutIntervalInMs]       The server timeout interval, in milliseconds, to use for the request.
* @param {int}                [options.maximumExecutionTimeInMs]  The maximum execution time, in milliseconds, across all potential retries, to use when making this request.
*                                                                 The maximum execution time interval begins at the time that the client begins building the request. The maximum
*                                                                 execution time is checked intermittently while performing requests, and before executing retries.
* @param {string}             [options.clientRequestId]           A string that represents the client request ID with a 1KB character limit.
* @param {bool}               [options.useNagleAlgorithm]         Determines whether the Nagle algorithm is used; true to use the Nagle algorithm; otherwise, false.
*                                                                 The default value is false.
* @param {errorOrResult}      callback                            `error` will contain information
*                                                                 if an error occurs; otherwise `result` will contain `entries` and `continuationToken`.
*                                                                 `entries`  gives a list of directories and the `continuationToken` is used for the next listing operation.
*                                                                 `response` will contain information related to this operation.
*/
function listBlobs(blobService, container, token, options, blobs, callback) {
  blobs = blobs || [];

  blobService.listBlobsSegmented(container, token, options, function (error, result) {
    if (error) return callback(error);

    blobs.push.apply(blobs, result.entries);
    var token = result.continuationToken;
    if (token) {
      console.log('   Received a segment of results. There are ' + result.entries.length + ' blobs on this segment.');
      listBlobs(blobService, container, token, options, blobs, callback);
    } else {
      console.log('   Completed listing. There are ' + blobs.length + ' blobs.');
      callback(null, blobs);
    }
  });
}

/**
* Generates a random bytes of buffer.
* @ignore
*
* @param {int}        size                         The size of the buffer in bytes.
* @return {Buffer}
*/
function getRandomBuffer(size) {
  return crypto.randomBytes(size);
}

/**
* Generates a random ID for the blob block.
* @ignore
*
* @param {int}        index                        The index of the block.
* @return {string}
*/
function getBlockId(index) {
  var prefix = zeroPaddingString(Math.random().toString(16), 8);
  return prefix + '-' + zeroPaddingString(index, 6);
}

/**
* Adds paddings to a string.
* @ignore
*
* @param {string}     str                          The input string.
* @param {int}        len                          The length of the string.
* @return {string}
*/
function zeroPaddingString(str, len) {
  var paddingStr = '0000000000' + str;
  if (paddingStr.length < len) {
    return zeroPaddingString(paddingStr, len);
  } else {
    return paddingStr.substr(-1 * len);
  }
}


// Testing

// uploadFilesFromFolder("pictures", "./images");
// downloadFileFromStorage("pictures", "pictures-img_9gag_a2rLGEd_460s.jpg", null);
// downloadFileFromStorage("pictures", "pictures-img_9gag_a2rLGEd_460s.jpg", "downloadedPicture");

var blobService = storage.createBlobService(config.connectionString);
listBlobs(blobService, "pictures", null, null, null, function (error, results) {
        if (error) return callback(error);

        for (var i = 0; i < results.length; i++) {
          console.log(util.format('   - %s (type: %s)'), results[i].name, results[i].blobType);
        }
    });
