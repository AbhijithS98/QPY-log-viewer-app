const express = require('express')
const cors = require('cors')
const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3')
const dotenv = require('dotenv')
const path = require('path')
dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()
app.use(cors())

const {
  PORT,
  BUCKET_HOST,
  BUCKET_NAME,
  BUCKET_ROOT,
  BUCKET_REGION,
  BUCKET_ACCESS_KEY,
  BUCKET_SECRET_KEY,
  BUCKET_PROTOCOL = 'https',
} = process.env
const endpoint = `${BUCKET_PROTOCOL}://${BUCKET_HOST}`

const bucketClient = new S3Client({
  credentials: {
    accessKeyId: BUCKET_ACCESS_KEY,
    secretAccessKey: BUCKET_SECRET_KEY,
  },
  endpoint,
  region: BUCKET_REGION,
})

//List Folders & Files
app.get('/api/list', async (req, res) => {
  const prefix = req.query.prefix || ''
  const fullPrefix = BUCKET_ROOT + prefix

  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: fullPrefix,
    Delimiter: '/',
  })

  try {
    const data = await bucketClient.send(command)
    console.log('response:', data)

    const folders = data.CommonPrefixes?.map((p) => p.Prefix.replace(fullPrefix, '')) || []
    const files =
      data.Contents?.map((obj) => obj.Key.replace(fullPrefix, '')).filter(
        (name) => name && !name.endsWith('/'),
      ) || []

    res.json({ folders, files })
  } catch (err) {
    console.error('Error listing objects:', err)
    res.status(500).json({ error: err.message })
  }
})

//Get file content
app.get('/api/file', async (req, res) => {
  const key = BUCKET_ROOT + req.query.key

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  try {
    const data = await bucketClient.send(command)

    //Converting stream to string
    const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = []
        stream.on('data', (chunk) => chunks.push(chunk))
        stream.on('error', reject)
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
      })

    const fileContents = await streamToString(data.Body)
    res.send(fileContents)
  } catch (err) {
    console.error('Error fetching file:', err)
    res.status(500).json({ error: err.message })
  }
})

app.get('/', (req, res) => {
  res.send('express server is UP')
})

app.listen(PORT || 5000, () => {
  console.log(`Express API running on http://localhost:${PORT}`)
})
