import { Injectable } from '@nestjs/common';
import * as Core from '@alicloud/pop-core';
import ViapiUtil from '@alicloud/viapi-utils';
import { BaseRetry, BaseService } from 'src/common';
import { EnvService } from 'src/internal/env/env.service';

type TRecognizeBL = {
  // 有效期
  ValidPeriod: string;
  // 地址
  Address: string;
  // 注册资本
  Capital: string;
  // 法人
  LegalPerson: string;
  // 创立日期
  EstablishDate: string;
  // 公司名称
  Name: string;
  // usci
  RegisterNumber: string;
  // 公司类型
  Type: string;
  // 业务范围
  Business: string;
};

@Injectable()
export class OcrService extends BaseService {
  public readonly client: Core;

  constructor(protected readonly envService: EnvService) {
    super(OcrService.name);
    this.client = new Core({
      accessKeyId: this.envService.get('OCR_ACCESSKEY_ID'),
      accessKeySecret: this.envService.get('OCR_ACCESSKEY_SECRET'),
      // securityToken: '<your-sts-token>', // use STS Token
      endpoint: this.envService.get('OCR_API'),
      apiVersion: this.envService.get('OCR_API_VERSION'),
    });
  }

  async tempUrl(url: string): Promise<string> {
    const accessKeyId = this.envService.get('ALIOSS_ACCESSKEY_ID');
    const accessKeySecret = this.envService.get('ALIOSS_ACCESSKEY_SECRET');
    const fileLoadAddress = await ViapiUtil.upload(
      accessKeyId,
      accessKeySecret,
      url,
    );
    // console.log('===', fileLoadAddress);
    return fileLoadAddress;
  }

  @BaseRetry(1, 1000)
  async ocr(url: string): Promise<TRecognizeBL> {
    // url = await this.tempUrl(url);
    // url = `${url}?x-oss-process=image/resize,w_200/quality,q_70/format,webp`;
    url = `${url}?x-oss-process=image/format,webp`;
    return new Promise((resolve, reject) => {
      const params = {
        ImageURL: url,
      };
      const requestOption = {
        method: 'POST',
        timeout: 6000, // default 3000 ms
      };
      this.client
        .request('RecognizeBusinessLicense', params, requestOption)
        .then(
          (result) => {
            resolve(result['Data']);
          },
          (ex) => {
            reject(ex);
          },
        );
    });
  }
}
