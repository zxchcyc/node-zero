import { Injectable } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { BaseBullProcessor } from 'src/common/processor/base-bull.processor';
import { BullTagService } from './bull-tag.service';
import { ProcessContext } from 'src/common';

@Injectable()
@Processor('xxljob')
export class BullProcessor extends BaseBullProcessor {
  constructor(private readonly bullTagService: BullTagService) {
    super(BullProcessor.name);
  }

  @Process('xxljob')
  @ProcessContext()
  async router(job: Job) {
    const { tag, data } = job.data;
    const routes = Reflect.getMetadata('MQTag', BullTagService);
    if (typeof routes?.[tag] === 'function') {
      await routes[tag].bind(this.bullTagService)(data);
    } else {
      this.logger.warn('非法消费');
    }
    return true;
  }
}
