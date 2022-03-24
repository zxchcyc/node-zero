import { EnvService } from 'src/internal/env/env.service';
import { Injectable } from '@nestjs/common';
import { MQClient } from '@aliyunmq/mq-http-sdk';

/**
 * RocketMQ 链接服务类
 */

@Injectable()
export class RocketmqClientService {
  readonly client = new MQClient(
    this.envService.get('MQ_ENDPOINT'),
    this.envService.get('MQ_ALI_ACCESS_KEY_ID'),
    this.envService.get('MQ_ALI_SECRET_ACCESS_KEY'),
  );
  constructor(private readonly envService: EnvService) {}
}
