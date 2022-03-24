import { Injectable } from '@nestjs/common';
import { ListenService } from 'src/external/rocketmq/consumer/listen.service';
import { EnvService } from 'src/internal/env/env.service';
import { DemoTagService } from './tag.service';

@Injectable()
export class RocketmqProcessor {
  constructor(
    private readonly demoTagService: DemoTagService,
    private readonly listenService: ListenService,
    private readonly envService: EnvService,
  ) {
    this.listen();
  }

  async listen() {
    await this.listenService.genListenFunc(
      this.envService.get('MQ_DA_TOPIC'),
      this.envService.get('MQ_DA_TAG'),
      DemoTagService,
      this.demoTagService,
    )();
  }
}
