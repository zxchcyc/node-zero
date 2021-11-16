import { Injectable, HttpException, Logger } from '@nestjs/common';
import * as axios from 'axios';
import { EnvService } from 'src/internal/env/env.service';

/**
 * http服务类
 */
@Injectable()
export class HttpService {
  public readonly axios: axios.AxiosInstance;
  private readonly baseConfig: axios.AxiosRequestConfig;
  public readonly dingAxios: axios.AxiosInstance;

  private logger: Logger = new Logger(HttpService.name);
  constructor(private readonly envService: EnvService) {
    this.baseConfig = {
      timeout: Number(this.envService.get('AXIOS_TIMEOUT')),
    };
    this.axios = axios.default.create(this.baseConfig);

    // 警报请求实例
    this.dingAxios = axios.default.create({
      ...this.baseConfig,
      baseURL: this.envService.get('WEBHOOK_URL'),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async dingRequest(data: any) {
    this.logger.log(`## 请求第三方服务企业微信: ${JSON.stringify(data)}`);
    try {
      const result = await this.dingAxios.post('', data);
      this.logger.debug(result.data);
      return result.data;
    } catch (error) {
      this.logger.error('## 请求企业微信失败', error.stack);
      throw new HttpException({ errorCode: 'C0001', message: error }, 500);
    }
  }
}
