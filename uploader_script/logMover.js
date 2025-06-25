require('dotenv').config();
const fs = require("fs"); 
const path = require("path"); 
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');  
const os = require("os"); 

const requiredEnv = ['BUCKET_HOST','BUCKET_NAME','BUCKET_REGION','BUCKET_ACCESS_KEY','BUCKET_SECRET_KEY'];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const { BUCKET_HOST,   
        BUCKET_NAME,
        BUCKET_REGION,
        BUCKET_ACCESS_KEY, 
        BUCKET_SECRET_KEY,
        BUCKET_PROTOCOL = 'https', } = process.env;

const endpoint = `${BUCKET_PROTOCOL}://${BUCKET_HOST}`;

// Configure AWS S3
const bucketClient = new S3Client({
    credentials: {
      accessKeyId: BUCKET_ACCESS_KEY,
      secretAccessKey: BUCKET_SECRET_KEY,
    },
    endpoint,
    region: BUCKET_REGION,
  });

const today = new Date().toISOString().slice(0, 10); 
const serverName = os.hostname(); 

async function uploadDirectoryToS3(sourceDirs) {
  for (const dir of sourceDirs) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      // Only process .log files
      if (!file.endsWith('.log')) {
        continue;
      }
      const filePath = path.join(dir, file);
      if (fs.lstatSync(filePath).isFile()) {
        const appName = path.basename(dir);
        const fileStream = fs.createReadStream(filePath);
        const s3Key = `log_archives/${today}/${serverName}/${appName}_${file}`;
        const putParams = {
          Bucket: BUCKET_NAME,
          Key: s3Key,
          Body: fileStream,
        };

        try{
          await bucketClient.send(new PutObjectCommand(putParams));
          console.log(`Uploaded: ${s3Key}`);
        } catch (err){
          console.error(`Failed to upload ${s3Key}:`, err);
        }    
      }
    }
  }
}

const sourceDirs = process.argv
  .slice(2)
  .filter((arg) => arg.startsWith("--src"))
  .map((arg) => arg.split("=")[1]);

console.log("sourceDirs:", sourceDirs);

uploadDirectoryToS3(sourceDirs);

