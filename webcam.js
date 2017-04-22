var NodeWebcam = require( "node-webcam" );

//Default options
var opts = {
    width: 1280,
    height: 720,
    delay: 0,
    quality: 100,
    output: "jpeg",
    device: false,
    callbackReturn: "location",
    verbose: false
};


//Creates webcam instance
var Webcam = NodeWebcam.create( opts );

//Will automatically append location output type
Webcam.capture( "test_picture", function( err, data ) {} );

//Also available for quite use
NodeWebcam.capture( "test_picture", opts, function( err, data ) {

});

//Return type with base 64 image
var opts = {
    callbackReturn: "base64"
};

NodeWebcam.capture( "test_picture", opts, function( err, data ) {
    var image = "<img src='" + data + "'>";
});
