const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});

const uploadFileToS3 = (file, fileName, fileType) => {
  const s3Params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    Body: file,
    ContentType: fileType,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3.upload(s3Params, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data.Location);
    });
  });
};
const downloadFileFromS3 = (fileName, callback) => {
  const s3Params = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
  };

  s3.getObject(s3Params, (err, data) => {
    if (err) {
      return callback(err);
    }
    return callback(null, data);
  });
};

module.exports = {
  uploadFileToS3,
  downloadFileFromS3,
};
