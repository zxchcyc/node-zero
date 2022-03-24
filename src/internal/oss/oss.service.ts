import { Injectable } from '@nestjs/common';
import { EnvService } from 'src/internal/env/env.service';
import * as AliOSS from 'ali-oss';

/**
 * OSS服务类
 */
@Injectable()
export class OssService {
  private readonly ossConfig;
  readonly aliOSS: AliOSS;
  constructor(private readonly envService: EnvService) {
    this.ossConfig = {
      region: this.envService.get('ALIOSS_REGION'),
      accessKeyId: this.envService.get('ALIOSS_ACCESSKEY_ID'),
      accessKeySecret: this.envService.get('ALIOSS_ACCESSKEY_SECRET'),
      bucket: this.envService.get('ALIOSS_BUCKET'),
      host: this.envService.get('ALIOSS_HOST'),
      secure: true,
    };
    this.aliOSS = new AliOSS(this.ossConfig);
  }

  getPostPolicy(prefix: string) {
    const dir = `${prefix}/`;
    const end = new Date().getTime() + 300000; // 设置5分钟过期时间
    const policy = {
      expiration: new Date(end).toISOString(),
      conditions: [
        { bucket: this.ossConfig.bucket },
        ['content-length-range', 0, 104857600], // 最大上传 100M
        ['starts-with', '$key', dir],
      ],
    };
    const formData = this.aliOSS.calculatePostSignature(policy);
    return {
      accessid: formData.OSSAccessKeyId,
      host: this.ossConfig.host,
      policy: formData.policy,
      signature: formData.Signature,
      expire: Math.ceil(end / 1000),
      callback: '',
      dir,
    };
  }
}
