import { Injectable } from '@nestjs/common';
import { EnvService } from 'src/internal/env/env.service';
import { HttpService } from '../http/http.service';

/**
 * webhook 服务类
 */
@Injectable()
export class WebhookService {
  constructor(
    private readonly httpService: HttpService,
    private readonly envService: EnvService,
  ) {}

  /**
   * 发送警报
   *
   * @param {string} message 警报消息
   * @param {string} [stack] 错误栈
   * @memberof WebhookService
   */
  async send(message: string, stack?: string) {
    if (this.envService.get('ENABLE_WEBHOOK')) {
      const markdown = {
        content: `### 【${process.env.NODE_ENV}】${process.env.SERVICE_NAME} \n #### 错误信息：\n > ${message} \n\n #### 错误栈： \n > ${stack}`,
      };
      const data = {
        msgtype: 'markdown',
        markdown,
      };
      await this.httpService.dingRequest(data);
    }
  }
}
