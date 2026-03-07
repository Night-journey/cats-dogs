import { Client } from 'minio';

export const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || '127.0.0.1',
  port: Number(process.env.MINIO_PORT || 9000),
  useSSL: (process.env.MINIO_USE_SSL || 'false') === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin'
});

export async function ensureBucket(bucket: string) {
  const exists = await minioClient.bucketExists(bucket);
  if (!exists) {
    await minioClient.makeBucket(bucket, 'us-east-1');
  }
}

export async function uploadToMinio(bucket: string, name: string, buffer: Buffer, contentType?: string) {
  await ensureBucket(bucket);
  await minioClient.putObject(bucket, name, buffer, undefined, { 'Content-Type': contentType || 'application/octet-stream' });
  const baseUrl = process.env.MINIO_PUBLIC_URL || `http://${process.env.MINIO_ENDPOINT || '127.0.0.1'}:${process.env.MINIO_PORT || 9000}`;
  return `${baseUrl}/${bucket}/${name}`;
}
