
import type { S3ClientConfig } from '@aws-sdk/client-s3';
import { CreateBucketCommand, DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, ListBucketsCommand, NotFound, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import type { Driver } from '../definitions/interfaces.js';
import FileNotFound from '../errors/FileNotFound.js';
import FileStoreError from '../errors/FileStoreError.js';
import NotConnected from '../errors/NotConnected.js';

const UNKNOWN_ERROR = 'Unknown error';

export default class S3 implements Driver
{
    readonly #configuration: S3ClientConfig;
    readonly #bucketName: string;

    #client?: S3Client;
    #connected = false;

    constructor(configuration: S3ClientConfig, bucketName: string)
    {
        this.#configuration = configuration;
        this.#bucketName = bucketName;
    }

    get connected(): boolean { return this.#connected; }

    async connect(): Promise<void>
    {
        try
        {
            this.#client = new S3Client(this.#configuration);

            const buckets = await this.#client.send(new ListBucketsCommand({}));
            const bucketExists = buckets.Buckets?.some(bucket => bucket.Name === this.#bucketName);

            if (bucketExists === true) return;

            await this.#client.send(new CreateBucketCommand({ Bucket: this.#bucketName }));
        }
        catch (error)
        {
            const message = error instanceof Error ? error.message : UNKNOWN_ERROR;

            throw new FileStoreError('File store connection failed: ' + message);
        }

        this.#connected = true;
    }

    async disconnect(): Promise<void>
    {
        if (this.#client === undefined)
        {
            throw new NotConnected();
        }

        this.#client.destroy();
        this.#client = undefined;
        this.#connected = false;
    }

    async hasFile(path: string): Promise<boolean>
    {
        const client = this.#getClient();

        try
        {
            await client.send(new HeadObjectCommand({ Bucket: this.#bucketName, Key: path }));

            return true;
        }
        catch (error)
        {
            const customError = this.#handleError(error, path);

            if (customError instanceof FileNotFound)
            {
                return false;
            }

            throw error;
        }
    }

    async writeFile(path: string, data: Buffer): Promise<void>
    {
        const client = this.#getClient();

        try
        {
            await client.send(new PutObjectCommand({ Bucket: this.#bucketName, Key: path, Body: data }));
        }
        catch (error)
        {
            throw this.#handleError(error, path);
        }
    }

    async readFile(path: string): Promise<Buffer>
    {
        const client = this.#getClient();

        try
        {
            const response = await client.send(new GetObjectCommand({ Bucket: this.#bucketName, Key: path }));
            const body = response.Body;

            if (body === undefined)
            {
                throw new FileNotFound(path);
            }

            const byteArray = await body.transformToByteArray();

            return Buffer.from(byteArray);
        }
        catch (error)
        {
            throw this.#handleError(error, path);
        }
    }

    async deleteFile(path: string): Promise<void>
    {
        const client = this.#getClient();

        try
        {
            await client.send(new DeleteObjectCommand({ Bucket: this.#bucketName, Key: path }));
        }
        catch (error)
        {
            throw this.#handleError(error, path);
        }
    }

    #getClient(): S3Client
    {
        if (this.#client === undefined)
        {
            throw new NotConnected();
        }

        return this.#client;
    }

    #handleError(error: unknown, path: string): unknown
    {
        if (error instanceof NotFound)
        {
            return new FileNotFound(path);
        }

        return error;
    }
}
