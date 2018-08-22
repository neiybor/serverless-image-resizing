/* FOR LOCAL DEV AND TESTING */


// 'use strict';

// //

// // setup auth and run locally
// // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/global-config-object.html

// const AWS = require('aws-sdk');

// const config = new AWS.Config({
//   credentials: new AWS.Credentials({
//     accessKeyId: 'KEY_HERE',
//     secretAccessKey: 'SECRET_HERE'
//   }), 
//   region: 'us-east-1'
// });

// const S3 = new AWS.S3({
//   signatureVersion: 'v4',
// });

// const Sharp = require('sharp');

// const BUCKET = 'neighbor-compressed-photos-dev';
// const URL = 'http://neighbor-compressed-photos-dev.s3-website-us-east-1.amazonaws.com';
// const ALLOWED_DIMENSIONS = new Set();

// if (process.env.ALLOWED_DIMENSIONS) {
//   const dimensions = process.env.ALLOWED_DIMENSIONS.split(/\s*,\s*/);
//   dimensions.forEach((dimension) => ALLOWED_DIMENSIONS.add(dimension));
// }

// const dynamicSizingCompression = (data) => {
//   const sizeInKB = data.ContentLength / 1024;
  
//   let jpegCompressOptions = { 
//     "quality": 75, 
//     "progressive": true 
//   }

//   if (height < 100 || width < 100) {
//     jpegCompressOptions["progressive"] = false;
//   }

//   if (sizeInKB <= 100) { // don't compress
//     return Sharp(data.Body)
//       .resize(width, height)
//       .max()
//       .withoutEnlargement()
//       .toBuffer()
//   } else {
//     return Sharp(data.Body)
//       .resize(width, height)
//       .max()
//       .withoutEnlargement()
//       .jpeg(jpegCompressOptions)
//       .toBuffer()
//   }
// }

// const compressionTester = () => {
//   const firstArg = process.argv[2];
//   if (!firstArg) {
//     console.error("Pass in the key of the image")
//     return;
//   }

//   console.log('fetching...');
//   S3.getObject({Bucket: BUCKET, Key: firstArg}).promise()
//   .then(dynamicSizingCompression)
//   .then(buffer => S3.putObject({
//       Body: buffer,
//       Bucket: BUCKET,
//       ContentType: 'image/jpeg',
//       Key: 'test/' + firstArg,
//     }).promise()
//   )
// }

// exports.handler = function(event, context, callback) {
//   const key = event.queryStringParameters.key;
//   const match = key.match(/((\d+)x(\d+))\/(.*)/);
//   const dimensions = match[1];
//   const width = parseInt(match[2], 10);
//   const height = parseInt(match[3], 10);
//   const originalKey = match[4];

//   if(ALLOWED_DIMENSIONS.size > 0 && !ALLOWED_DIMENSIONS.has(dimensions)) {
//      callback(null, {
//       statusCode: '403',
//       headers: {},
//       body: '',
//     });
//     return;
//   }

//   S3.getObject({Bucket: BUCKET, Key: originalKey}).promise()
//     .then(data => Sharp(data.Body)
//       .resize(width, height)
//       .max()
//       .withoutEnlargement()
//       .jpeg({ "quality": 75, "progressive": true })
//       .toBuffer()
//     )
//     .then(buffer => S3.putObject({
//         Body: buffer,
//         Bucket: BUCKET,
//         ContentType: 'image/jpeg',
//         Key: key,
//       }).promise()
//     )
//     .then(() => callback(null, {
//         statusCode: '301',
//         headers: {'location': `${URL}/${key}`},
//         body: '',
//       })
//     )
//     .catch(err => callback(err))
// }

// compressionTester();
