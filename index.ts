import { config } from "dotenv";
import express from "express";
import { ListObjectsV2Command, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import multer from "multer";
import multerS3 from "multer-s3";

config();
const app = express();
app.use(express.static("public"));

if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_KEY)
  throw new Error("AWS credentials not found in .env file");

const s3 = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
});

const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 5,
    files: 1,
  },
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.includes("audio")) {
      cb(new Error("Only audio files are allowed."));
    } else {
      cb(null, true);
    }
  },
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME as string,
    metadata: function (req, file, cb) {
      cb(null, { name: file.originalname });
    },
    key: function (req, file, cb) {
      cb(null, `${Date.now().toString()}.webm`);
    },
  }),
});

app.get("/", async (_, res) => {
  res.sendFile(__dirname + "/public/html/index.html");
});

app.post("/upload", upload.any(), async (req, res) => {
  return res.status(200).send("File uploaded successfully.");
});

app.get("/list", async (_, res) => {
  const listObjects = await s3.send(
    new ListObjectsV2Command({ Bucket: process.env.AWS_BUCKET_NAME as string })
  );

  return res.status(200).json({
    data: (listObjects.Contents || []).map((item) => ({
      ...item,
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${item.Key}`,
    })),
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 5000}`);
});
