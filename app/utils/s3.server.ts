import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3, PutObjectCommand } from '@aws-sdk/client-s3';
import invariant from 'tiny-invariant';

export const s3_upload = async (path: string, file: any, mime: string) => {
  invariant(process.env.WASABI_ENDPOINT, 'WASABI_ENDPOINT is required');
  invariant(process.env.WASABI_KEY, 'WASABI_KEY is required');
  invariant(process.env.WASABI_SECRET, 'WASABI_SECRET is required');
  invariant(process.env.WASABI_REGION, 'WASABI_REGION is required');
  invariant(process.env.WASABI_BUCKET, 'WASABI_BUCKET is required');
  const client = new S3({
    endpoint: process.env.WASABI_ENDPOINT,
    credentials: {
      accessKeyId: process.env.WASABI_KEY,
      secretAccessKey: process.env.WASABI_SECRET,
    },
    region: process.env.WASABI_REGION,
  });
  const command = new PutObjectCommand({
    Bucket: process.env.WASABI_BUCKET,
    Key: `${path}${file}`,
    ContentType: mime,
  });
  const signedUrl = await getSignedUrl(client, command, {
    expiresIn: 10 * 60,
  });
  return signedUrl;
};
