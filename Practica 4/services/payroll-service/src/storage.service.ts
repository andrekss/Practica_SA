import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private readonly bucket = process.env.MINIO_BUCKET ?? 'payroll-csv';
  private readonly endpoint = process.env.MINIO_ENDPOINT ?? 'http://minio:9000';
  private readonly publicEndpoint =
    process.env.MINIO_PUBLIC_ENDPOINT ?? 'http://localhost:9000';

  private readonly s3 = new S3Client({
    forcePathStyle: true,
    region: process.env.MINIO_REGION ?? 'us-east-1',
    endpoint: this.endpoint,
    credentials: {
      accessKeyId: process.env.MINIO_ACCESS_KEY ?? 'minioadmin',
      secretAccessKey: process.env.MINIO_SECRET_KEY ?? 'minioadmin',
    },
  });

  async uploadCsv(objectKey: string, body: string) {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: objectKey,
        Body: body,
        ContentType: 'text/csv',
      }),
    );
    return objectKey;
  }

  async getDownloadUrl(objectKey: string) {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: objectKey });
    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    return url.replace(this.endpoint, this.publicEndpoint);
  }
}
