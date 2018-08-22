// /* FOR LOCAL DEV AND TESTING */


// 'use strict';

// // setup auth and run locally
// // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/global-config-object.html

// const AWS = require('aws-sdk');

// const config = new AWS.Config({
//   credentials: new AWS.Credentials({
//     accessKeyId: 'KEY',
//     secretAccessKey: 'SECRET'
//   }), 
//   region: 'us-east-1'
// });

// const S3 = new AWS.S3({
//   signatureVersion: 'v4',
// });

// const Sharp = require('sharp');

// const BUCKET = 'neighbor-listing-photos-development';
// const URL = 'http://neighbor-listing-photos-development.s3-website-us-east-1.amazonaws.com';
// const ALLOWED_DIMENSIONS = new Set();

// if (process.env.ALLOWED_DIMENSIONS) {
//   const dimensions = process.env.ALLOWED_DIMENSIONS.split(/\s*,\s*/);
//   dimensions.forEach((dimension) => ALLOWED_DIMENSIONS.add(dimension));
// }

// const dynamicSizingCompression = (data, width, height) => {
//   const sizeInKB = data.ContentLength / 1024;
  
//   let jpegCompressOptions = { 
//     "quality": 75, 
//     "progressive": true 
//   }

//   if (height < 100 || width < 100) {
//     jpegCompressOptions["progressive"] = false; // ineffecient for smaller photos
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

// const handler = function(event, context, callback) {
//   const key = event.queryStringParameters.key;
//   const match = key.match(/(.*)\/((\d+)x(\d+))\/(.*)/);
//   const dimensions = match[2];
//   const width = parseInt(match[3], 10);
//   const height = parseInt(match[4], 10);
//   const filename = match[5];
//   const path = match[1];

//   const originalKey = path + '/' + filename;

//   if(ALLOWED_DIMENSIONS.size > 0 && !ALLOWED_DIMENSIONS.has(dimensions)) {
//      callback(null, {
//       statusCode: '403',
//       headers: {},
//       body: '',
//     });
//     return;
//   }

//   S3.getObject({Bucket: BUCKET, Key: originalKey}).promise()
//     .then((data) => { 
//       return dynamicSizingCompression(data, width, height);
//     })
//     .then(buffer => S3.putObject({
//         Body: buffer,
//         Bucket: BUCKET,
//         ContentType: 'image/jpeg',
//         Key: key,
//       }).promise()
//     )
//     .then(() => callback(null, {
//         statusCode: '301',
//         headers: {'Location': `${URL}/${key}`},
//         body: '',
//       })
//     )
//     .catch(err => callback(err))
// };

// // exports.handler = handler;

// // const handler = function(key, callback) { //test
// // const key = '1/2/40x40/blue_marble.jpg';
// // const callback = () => console.log('callback');
// // handler(key, callback);

// S3.getObject({Bucket: BUCKET, Key: '1/2/blue_marble.jpg'}).promise()
//   .then((data) => { 
//     return Sharp(data.Body)
//     .toBuffer()
//   })
//   .then(buffer => S3.putObject({
//       Body: buffer,
//       Bucket: 'neighbor-user-photos-production',
//       ContentType: 'image/jpeg',
//       Key: '1/2/blue_marble.jpg',
//     }).promise()
//   )
