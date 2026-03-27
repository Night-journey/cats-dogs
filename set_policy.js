const { Client } = require('minio');

const client = new Client({
  endPoint: '127.0.0.1',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: 'minioadmin123'
});

const policy = {
  Version: '2012-10-17',
  Statement: [{
    Sid: 'PublicReadGetObject',
    Effect: 'Allow',
    Principal: '*',
    Action: 's3:GetObject',
    Resource: 'arn:aws:s3:::post-images/*'
  }]
};

async function setPolicy() {
  try {
    // Set the bucket policy
    await client.setBucketPolicy('post-images', JSON.stringify(policy));
    console.log('Bucket policy set successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

setPolicy();
