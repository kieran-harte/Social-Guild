require('dotenv').config()
const { v4: uuidv4 } = require('uuid')
const AWS = require('aws-sdk')
const { URL } = require('url')

AWS.config.update({
  accessKey: process.env.AWS_ACCESS_KEY,
  secretKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
  endpoint: new AWS.Endpoint('https://s3.fr-par.scw.cloud')
})

const s3 = new AWS.S3()
module.exports.s3 = s3

module.exports.uploadFiles = async (files, userId) => {
  const results = []

  files.forEach((file) => {
    const key = `${userId}/${uuidv4()}.${file.originalname.split('.').pop()}`

    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Body: file.buffer,
      ACL: 'public-read'
    }

    results.push(s3.upload(params).promise())
  })

  return Promise.all(results)
}

module.exports.deleteFiles = async (files, userId) => {
  const Objects = files.map((file) => {
    const url = new URL(file)
    return { Key: url.pathname.substring(1) }
  })

  const params = {
    Bucket: process.env.AWS_BUCKET,
    Delete: {
      Objects,
      Quiet: true
    }
  }

  console.log(Objects)

  return s3.deleteObjects(params).promise()
}
