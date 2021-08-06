import * as chalk from 'chalk';
import { Client } from 'minio';
import { Service } from 'typedi';
import { camelCase } from 'lodash';

interface Buckets {
  [name: string]: string;
}

const getBuckets = () => {
  const bucketBulk: string = process.env.STORAGE_BUCKETS || '';
  const bucketList: string[] = bucketBulk.split(',');
  if (bucketList.length) {
    return bucketList.reduce((prev: Buckets, curr: string) => {
      const key = camelCase(curr);
      prev[key] = curr;
      return prev;
    }, {});
  }
  return null;
};

export const buckets: Buckets | null = getBuckets();

@Service()
export class StorageService {
  private storage: any;
  private region: string;

  constructor() {
    this.region = process.env.STORAGE_REGION || 'us-east-1';
    this.storage = this.initializeClient();
  }

  /**
   * @author Ashish Patel
   * Initialize the app to get the minio instance
   * @returns Minio Instance
   */
  initializeClient() {
    return new Client({
      endPoint: process.env.STORAGE_ENDPOINT || '',
      port: Number(process.env.STORAGE_PORT) || 9000,
      useSSL: !!process.env.STORAGE_SSL,
      accessKey: process.env.STORAGE_ACCESS_KEY || '',
      secretKey: process.env.STORAGE_SECRET_KEY || ''
    });
  }

  /**
   * @author Ashish Patel
   * @description Creating new bucket if it's not available
   */
  async createBuckets() {
    try {
      if (buckets) {
        await Promise.all(
          Object.keys(buckets).map(async (bucket) => {
            const avail = await this.storage.bucketExists(buckets[bucket]);
            if (!avail) {
              return this.storage.makeBucket(buckets[bucket], this.region);
            }
            console.log(chalk.blue.bold(`Bucket ${buckets[bucket]} already exist`));
            return true;
          })
        );
      } else {
        console.log(chalk.blue.bold(`No buckets to create`));
      }
    } catch (error) {
      console.log(chalk.red.bold('Something went wrong while creating bucket'), error);
    }
  }

  /**
   * @author Ashish Patel
   * @description To upload a single file
   * @param file The file object
   * @param bucket Name of the bucket
   * @returns File details
   */
  async uploadSingle(file: any, bucket: string) {
    const fileOriginalName = file.originalname;
    const fileName = `${file.originalname}-${new Date().getTime()}`;
    await this.storage.putObject(
      bucket,
      fileName,
      file.buffer,
      'application/octet-stream'
    );
    return { fileName, fileOriginalName };
  }

  /**
   * @author Ashish Patel
   * @param files Array of file objects
   * @param bucket Name of the bucket
   * @returns Array of File details
   */
  async uploadMultiple(files: [any], bucket: string) {
    return Promise.all(files.map((file) => this.uploadSingle(file, bucket)));
  }

  /**
   * Returns url of provided file
   * @param fileName Name of the file
   * @param bucket Name of the bucket
   * @returns File url
   */
  async getFileUrl(fileName: string, bucket: string) {
    return this.storage.presignedUrl('GET', bucket, fileName);
  }

  /**
   * Returns urls of provided files
   * @param fileName Names of the files
   * @param bucket Name of the bucket
   * @returns File urls
   */
  async getFileUrls(fileNames: [string], bucket: string) {
    return Promise.all(fileNames.map(fileName => this.getFileUrl(fileName, bucket)))
  }

  /**
   * To get the readable object of the file
   * @param fileName Name of the file
   * @param bucket Bucket Name
   * @returns Readable stream object of file
   */
  async getSingle(fileName: string, bucket: string) {
    return this.storage.getObject(bucket, fileName);
  }

  /**
   * @author Ashish Patel
   * @description To get readable objects of multiple files
   * @param fileNames Array of file names
   * @param bucket Bucket Name
   * @returns Array of readable stream objects of file
   */
  async getMultiple(fileNames: [string], bucket: string) {
    return Promise.all(fileNames.map((fileName) => this.getSingle(fileName, bucket)));
  }

  /**
   * @author Ashish Patel
   * @description Call to delete the file from the bucket
   * @param fileName Name of the file
   * @param bucket Name of the bucket
   */
  async deleteFile(fileName: string, bucket: string) {
    return await this.storage.removeObject(bucket, fileName);
  }

  /**
   * @author Ashish Patel
   * @description Call to delete multiple files from the bucket
   * @param fileNames Array of filenames
   * @param bucket Name of the bucket
   */
  async deleteMultipleFiles(fileNames: [string], bucket: string) {
    return Promise.all(fileNames.map((fileName) => this.deleteFile(fileName, bucket)));
  }
}
