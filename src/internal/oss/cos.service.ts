import { Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import { Stream, PassThrough } from 'stream';
import * as COS from 'cos-nodejs-sdk-v5';
import { getCredential } from 'qcloud-cos-sts';

export interface FileInfo {
  fileSize: number;
  url: string;
}

class SizeWrapper extends PassThrough {
  private dataSize = 0;

  _transform(data, encoding, callback) {
    super._transform(data, encoding, callback);
    this.dataSize += data.length;
  }

  getDataSize() {
    return this.dataSize;
  }
}

@Injectable()
export class CosService extends COS {
  private readonly bucket: string;
  private readonly region: string;
  private readonly secretId: string;
  private readonly secretKey: string;
  private readonly host: string;

  /**
   * 调用方法时，Bucket和Region传空即可
   */
  constructor(envService: EnvService) {
    for (const key of [
      'COS_SECRET_ID',
      'COS_SECRET_KEY',
      'COS_BUCKET',
      'COS_REGION',
    ]) {
      if (!envService.get(key)) {
        throw new Error('missing config key: ' + key);
      }
    }
    super({
      SecretId: envService.get('COS_SECRET_ID'),
      SecretKey: envService.get('COS_SECRET_KEY'),
    });
    this.bucket = envService.get('COS_BUCKET');
    this.region = envService.get('COS_REGION');
    this.secretId = envService.get('COS_SECRET_ID');
    this.secretKey = envService.get('COS_SECRET_KEY');
    this.host = `https://${this.bucket}.cos.${this.region}.myqcloud.com`;

    for (const [key, value] of Object.entries(
      Reflect.getPrototypeOf(Reflect.getPrototypeOf(this)),
    )) {
      if (typeof value !== 'function') {
        continue;
      }
      this[key] = (param, cb) => {
        return value.call(
          this,
          {
            ...param,
            Bucket: this.bucket,
            Region: this.region,
          },
          cb,
        );
      };
    }
  }

  simpleUpload(
    body: Buffer | string | Stream,
    fileName: string,
  ): Promise<FileInfo> {
    let data = body;
    let getSize;
    if (data instanceof Stream) {
      const counter = new SizeWrapper();
      data = data.pipe(counter);
      getSize = () => counter.getDataSize();
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      getSize = () => data.length;
    }
    return this.putObject({
      Bucket: '',
      Region: '',
      Body: data,
      Key: fileName,
    }).then((res) => {
      return {
        url: 'https://' + res.Location,
        fileSize: getSize(),
      };
    });
  }

  async getUploadCredential(prefix = 'edc') {
    const policy = {
      version: '2.0',
      statement: [
        {
          effect: 'allow',
          action: ['cos:PutObject', 'cos:PostObject'],
          resource: [
            `qcs::cos:${this.region}:uid/1306042246:${this.bucket}/${prefix}/*`,
          ],
        },
      ],
    };
    const res = await getCredential({
      secretId: this.secretId,
      secretKey: this.secretKey,
      policy: policy,
      durationSeconds: 600,
    });

    return {
      expiredTime: res.expiredTime * 1000,
      ...res.credentials,
      host: this.host,
      dir: prefix + '/',
      bucket: this.bucket,
      region: this.region,
    };
  }
}
