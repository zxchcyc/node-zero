import * as path from 'path';
import { Readable } from 'stream';
import * as archiver from 'archiver';
import * as cryptoFormat from 'archiver-zip-encrypted';

archiver.registerFormat('zip-encrypted', cryptoFormat);

interface FileInfo {
  fileSize: number;
  url: string;
}

interface UploadStreamFn {
  (readStream: Readable, fileName: string): Promise<FileInfo>;
}

export class CompressUploader {
  private readonly maxSize: number;
  private readonly dir: string;
  private readonly baseName: string;
  private fileInfos: FileInfo[] = [];
  private count = 0;
  private size = 0;
  private uploadJob: Promise<FileInfo>;
  private stream: archiver.Archiver;
  private error = null;

  /**
   *
   * @param uploadFunc 上传function
   * @param zipFileName 压缩包保存名称
   * @param maxSize 压缩包内文件最大值（KB），0不分包
   * @param psd 压缩包密码，不传或空不加密
   * @param compressLevel 压缩等级
   */
  constructor(
    private readonly uploadFunc: UploadStreamFn,
    zipFileName: string,
    maxSize = 0,
    private readonly psd = '',
    private readonly compressLevel = 7,
  ) {
    this.maxSize = maxSize * 1024;
    this.dir = path.dirname(zipFileName) + '/';
    if (this.dir === './') {
      this.dir = '';
    }
    this.baseName = path.basename(zipFileName, '.zip');
  }

  private getCrtName(): string {
    return `${this.dir}${this.baseName}_${this.count}.zip`;
  }

  private readyJob() {
    if (this.stream) {
      return;
    }
    this.count++;
    if (this.psd) {
      this.stream = archiver.create('zip-encrypted', {
        zlib: { level: this.compressLevel },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        encryptionMethod: 'aes256',
        password: this.psd,
      });
    } else {
      this.stream = archiver('zip', {
        zlib: { level: this.compressLevel },
      });
    }

    this.stream.on('error', (error) => {
      this.error = error;
    });
    this.uploadJob = this.uploadFunc(this.stream, this.getCrtName()).catch(
      (error) => (this.error = error),
    );
  }

  /**
   * 向压缩包内添加文件
   * @param data 文件buffer或stream
   * @param name 包内文件名
   * @param fileSize 文件大小，传stream时需要指定
   */
  async addFile(
    data: Buffer | Readable,
    name: string,
    fileSize?: number,
  ): Promise<void> {
    if (this.error) {
      throw this.error;
    }
    let len = fileSize;
    if (data instanceof Buffer) {
      len = data.length;
    }
    if (!len && this.maxSize) {
      throw new Error('无法获取文件大小');
    }
    this.size += len;
    if (this.maxSize && this.size >= this.maxSize) {
      await this.end();
      this.size = len;
    }
    this.readyJob();
    return new Promise((resolve, reject) => {
      this.stream.append(data, { name });
      this.stream.once('progress', resolve);
      this.stream.once('error', reject);
    });
  }

  /**
   * 结束当前包。添加完最后一个文件后必须调用
   */
  async end(): Promise<FileInfo[]> {
    if (!this.uploadJob) {
      return Promise.resolve([]);
    }
    if (this.error) {
      throw this.error;
    }
    if (this.stream) {
      const stream = this.stream;
      this.size = 0;
      this.stream = null;
      await stream.finalize();
    }
    return this.uploadJob.then((info) => {
      if (this.error) {
        throw this.error;
      }
      info.fileSize = info.fileSize / 1024;
      this.fileInfos.push(info);
      return this.fileInfos;
    });
  }
}

export const cosUpload = (cos): UploadStreamFn => {
  return async (stream, fileName) => {
    return await cos.simpleUpload(stream, fileName);
  };
};
