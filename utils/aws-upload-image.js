require('dotenv').config({ path: '.env' });
const AWS = require('aws-sdk');

const ID = process.env.AWS_ID;
const SECRET = process.env.AWS_SECRET;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const s3 = new AWS.S3({
     accessKeyId: ID,
     secretAccessKey: SECRET,
});

// filePath -> carpeta en la que vamos a guardar en aws
async function awsUploadImage(file, filePath) {
     const params = {
          Bucket: BUCKET_NAME,
          key: `${filePath}`,
          Body: file,
     }

     try {

          const response = await s3.upload(params).promise();
          return response.Location; /* url de la imagen que se subio */

     } catch (error) {
          console.log(error);
          throw new Error();
     }
}

module.exports = awsUploadImage;