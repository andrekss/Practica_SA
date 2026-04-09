"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let StorageService = class StorageService {
    constructor() {
        this.bucket = process.env.MINIO_BUCKET ?? 'payroll-csv';
        this.endpoint = process.env.MINIO_ENDPOINT ?? 'http://minio:9000';
        this.publicEndpoint = process.env.MINIO_PUBLIC_ENDPOINT ?? 'http://localhost:9000';
        this.s3 = new client_s3_1.S3Client({
            forcePathStyle: true,
            region: process.env.MINIO_REGION ?? 'us-east-1',
            endpoint: this.endpoint,
            credentials: {
                accessKeyId: process.env.MINIO_ACCESS_KEY ?? 'minioadmin',
                secretAccessKey: process.env.MINIO_SECRET_KEY ?? 'minioadmin',
            },
        });
    }
    async uploadCsv(objectKey, body) {
        await this.s3.send(new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: objectKey,
            Body: body,
            ContentType: 'text/csv',
        }));
        return objectKey;
    }
    async getDownloadUrl(objectKey) {
        const command = new client_s3_1.GetObjectCommand({ Bucket: this.bucket, Key: objectKey });
        const url = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, command, { expiresIn: 3600 });
        return url.replace(this.endpoint, this.publicEndpoint);
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)()
], StorageService);
//# sourceMappingURL=storage.service.js.map