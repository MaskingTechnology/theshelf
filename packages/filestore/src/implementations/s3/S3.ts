
import type { S3ClientConfig } from '@aws-sdk/client-s3';
import { NotFound, S3Client, HeadObjectCommand, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListBucketsCommand, CreateBucketCommand } from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';

import type { FileStore } from '../../definitions/interfaces.js';
import FileNotFound from '../../errors/FileNotFound.js';
import NotConnected from '../../errors/NotConnected.js';

export default class S3 implements FileStore
{
    readonly #configuration: S3ClientConfig;
    readonly #bucketName: string;
    #client?: S3Client;

    constructor(configuration: S3ClientConfig, bucketName: string)
    {
        this.#configuration = configuration;
        this.#bucketName = bucketName;
    }
    
    get connected()
    {
        return this.#client !== undefined;
    }

    async connect(): Promise<void>
    {
        this.#client = new S3Client(this.#configuration);
        
        const buckets = await this.#client.send(new ListBucketsCommand({}));
        const bucketExists = buckets.Buckets?.some(bucket => bucket.Name === this.#bucketName);

        if (bucketExists === true) return;
        
        await this.#client.send(new CreateBucketCommand({ Bucket: this.#bucketName }));
    }

    async disconnect(): Promise<void>
    {
        if (this.#client === undefined)
        {
            throw new NotConnected();
        }

        this.#client.destroy();
        this.#client = undefined;
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
            await client.send(new PutObjectCommand({Bucket: this.#bucketName, Key: path, Body: data}));
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

            const stream = body as Readable;
            const chunks: Uint8Array[] = [];

            for await (const chunk of stream)
            {
                chunks.push(chunk);
            }

            return Buffer.concat(chunks);
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

    async clear(): Promise<void>
    {
        return; // Deliberately not implemented
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
