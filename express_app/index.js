const express = require("express");
const cors = require("cors");
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());

const { PORT,
  BUCKET_HOST,   
  BUCKET_NAME,
  BUCKET_ROOT,
  BUCKET_REGION,
  BUCKET_ACCESS_KEY, 
  BUCKET_SECRET_KEY,
  BUCKET_PROTOCOL = 'https', 
} = process.env;
const endpoint = `${BUCKET_PROTOCOL}://${BUCKET_HOST}`;

const bucketClient = new S3Client({
  credentials: {
    accessKeyId: BUCKET_ACCESS_KEY,
    secretAccessKey: BUCKET_SECRET_KEY,
  },
  endpoint,
  region: BUCKET_REGION,
});

app.get('/api/list', async (req,res) => { 
  const prefix = req.query.prefix || ""; 
  const fullPrefix = BUCKET_ROOT + prefix;
  
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: fullPrefix, 
    Delimiter: "/",
  });
 
  try {
    const data = await bucketClient.send(command);
    console.log("response:", data);
    
    const folders = data.CommonPrefixes?.map((p) => p.Prefix.replace(fullPrefix, "")) || [];
    const files = data.Contents
      ?.map((obj) => obj.Key.replace(fullPrefix, ""))
      .filter((name) => name && !name.endsWith("/")) || [];

    res.json({ folders, files });

  } catch (err) {
    console.error('Error listing objects:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/',(req,res)=>{
  res.send("express server is UP")
})

app.listen(PORT||5000, () => {
  console.log(`Express API running on http://localhost:${PORT}`);
});
