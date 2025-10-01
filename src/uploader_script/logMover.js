const dotenv = require('dotenv')
const path = require('path')
dotenv.config({ path: path.join(__dirname, '.env') })
const fs = require('fs')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const os = require('os')

const requiredEnv = [
  'BUCKET_HOST',
  'BUCKET_NAME',
  'BUCKET_REGION',
  'BUCKET_ACCESS_KEY',
  'BUCKET_SECRET_KEY',
  'BUCKET_ROOT',
]
for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

const {
  BUCKET_HOST,
  BUCKET_ROOT,
  BUCKET_NAME,
  BUCKET_REGION,
  BUCKET_ACCESS_KEY,
  BUCKET_SECRET_KEY,
  BUCKET_PROTOCOL = 'https',
} = process.env

const endpoint = `${BUCKET_PROTOCOL}://${BUCKET_HOST}`

// Configure AWS S3
const bucketClient = new S3Client({
  credentials: {
    accessKeyId: BUCKET_ACCESS_KEY,
    secretAccessKey: BUCKET_SECRET_KEY,
  },
  endpoint,
  region: BUCKET_REGION,
})

const today = new Date().toISOString().slice(0, 10)
const serverName = os.hostname()

async function uploadDirectoryToS3(sourceDirs) {
  for (const dir of sourceDirs) {
    const files = fs.readdirSync(dir)
    for (const file of files) {
      // Only process .log files
      if (!file.endsWith('.log')) {
        continue
      }
      const filePath = path.join(dir, file)
      if (fs.lstatSync(filePath).isFile()) {
        const fileStream = fs.createReadStream(filePath)
        const s3Key = `${BUCKET_ROOT}/${today}/${serverName}/${file}`
        const putParams = {
          Bucket: BUCKET_NAME,
          Key: s3Key,
          Body: fileStream,
        }

        try {
          await bucketClient.send(new PutObjectCommand(putParams))
          console.log(`Uploaded: ${file}`)

          // Verifying upload with HeadObjectCommand
          try {
            await bucketClient.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: s3Key }))
            fs.unlinkSync(filePath)
            console.log(`Verified and deleted local file: ${filePath}`)
          } catch (verifyErr) {
            console.error(`Uploaded but could not verify ${file}:`, verifyErr)
          }
        } catch (err) {
          console.error(`Failed to upload ${file}:`, err)
        }
      }
    }
  }
}

const sourceDirs = process.argv
  .slice(2)
  .filter((arg) => arg.startsWith('--src'))
  .map((arg) => arg.split('=')[1])

console.log('sourceDirs:', sourceDirs)

uploadDirectoryToS3(sourceDirs)
