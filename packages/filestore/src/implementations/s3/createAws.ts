
import S3 from './S3.js';

export default function create(): S3
{
    const region = process.env.AWS_REGION ?? 'eu-central-1';
    const bucket = process.env.AWS_BUCKET_NAME ?? 'undefined';

    return new S3({ region: region }, bucket);
}
