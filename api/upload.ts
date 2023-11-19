import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";

const s3 = new S3Client({
	region: process.env.C_AWS_REGION as string,
	credentials: {
		accessKeyId: process.env.C_AWS_ACCESS_KEY as string,
		secretAccessKey: process.env.C_AWS_SECRET_KEY as string,
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
		bucket: process.env.C_AWS_BUCKET_NAME as string,
		metadata: function (req, file, cb) {
			cb(null, { name: file.originalname });
		},
		key: function (req, file, cb) {
			cb(null, `${Date.now().toString()}.webm`);
		},
	}),
}).any();

export default (req, res) => {
	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			return res.status(500).send(err);
		} else if (err) {
			return res.status(500).send(err);
		}
		return res.status(200).send('File uploaded successfully.');
	})
}