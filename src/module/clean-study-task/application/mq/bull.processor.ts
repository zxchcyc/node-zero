import { Injectable } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { BaseBullProcessor } from 'src/common/processor/base-bull.processor';
import { TagService } from './tag.service';
import { ProcessContext } from 'src/common';

@Injectable()
@Processor('cleanStudyTask')
export class BullProcessor extends BaseBullProcessor {
  constructor(private readonly tagService: TagService) {
    super(BullProcessor.name);
  }

  @Process('cleanStudyTask')
  @ProcessContext()
  async cleanStudyTask(job: Job) {
    const { tag, data } = job.data;
    const routes = Reflect.getMetadata('MQTag', TagService);
    if (typeof routes?.[tag] === 'function') {
      await routes[tag].bind(this.tagService)(data);
    } else {
      this.logger.warn('非法消费');
    }
    return true;
  }
}
