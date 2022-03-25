import { Injectable, HttpException, Logger } from '@nestjs/common';
import * as axios from 'axios';
import * as qs from 'qs';
import { EnvService } from 'src/internal/env/env.service';

/**
 * http服务类
 */
@Injectable()
export class HttpService {
  public readonly axios: axios.AxiosInstance;
  private readonly baseConfig: axios.AxiosRequestConfig;
  public readonly smsAxios: axios.AxiosInstance;
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

    // 验证码请求实例
    this.smsAxios = axios.default.create({
      ...this.baseConfig,
      baseURL: this.envService.get('SMS_API'),
      headers: {
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    });
  }

  async dingRequest(data: any) {
    this.logger.verbose(`## 请求第三方服务企业微信: ${JSON.stringify(data)}`);
    try {
      const result = await this.dingAxios.post('', data);
      this.logger.debug(result.data);
      return result.data;
    } catch (error) {
      const res = error['response']?.['data'];
      this.logger.error('## 请求企业微信失败', res);
      throw new HttpException({ errorCode: 'C0001', message: res }, 500);
    }
  }

  async smsRequest(
    method: axios.Method,
    url: string,
    data: any,
    options?: axios.AxiosRequestConfig,
  ) {
    data = Object.assign(
      {
        apikey: this.envService.get('SMS_API_KEY'),
      },
      data,
    );
    const reqConfig = {
      url,
      method,
      data: qs.stringify(data),
      ...options,
    };
    try {
      const result = await this.smsAxios.request(reqConfig);
      return result.data;
    } catch (error) {
      const res = error['response']?.['data'];
      this.logger.error('## 请求第三方服务云片验证码失败', res);
      throw new HttpException({ errorCode: 'C0001', message: res }, 500);
    }
  }
}
