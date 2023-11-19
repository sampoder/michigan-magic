import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
	region: process.env.AWS_REGION as string,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY as string,
		secretAccessKey: process.env.AWS_SECRET_KEY as string,
	},
});


export default async (req, res) => {
	const listObjects = await s3.send(
		new ListObjectsV2Command({ Bucket: process.env.AWS_BUCKET_NAME as string })
	);
	
	return res.status(200).json({
		data: (listObjects.Contents || []).map((item) => ({
			...item,
			url: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${item.Key}`,
		})),
	});
}