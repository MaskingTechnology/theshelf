
import S3 from './S3.js';

export default function create(): S3
{
    const endpoint = process.env.S3_END_POINT ?? 'undefined';
    const accessKey = process.env.S3_ROOT_USER ?? 'undefined';
    const secretKey = process.env.S3_ROOT_PASSWORD ?? 'undefined';
    const bucket = process.env.S3_BUCKET_NAME ?? 'undefined';
    const region = process.env.S3_REGION ?? 'local';

    const clientConfig = { 
        region: region,
        credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretKey
        },
        forcePathStyle: true,
        endpoint: endpoint
    };

    return new S3(clientConfig, bucket);
}
