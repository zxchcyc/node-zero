import { Module } from '@nestjs/common';
import { RocketmqService } from './adapter/rocketmq.impl.service';
import { AbstractRocketmqService } from './adapter/rocketmq.service.abstract';
import { RocketmqClientService } from './client/client.service';
import { ListenService } from './consumer/listen.service';

@Module({
  providers: [
    {
      provide: AbstractRocketmqService,
      useClass: RocketmqService,
    },
    RocketmqClientService,
    ListenService,
  ],
  exports: [AbstractRocketmqService, ListenService],
})
export class RocketmqModule {}
