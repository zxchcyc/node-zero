import {
  OnQueueFailed,
  OnQueueError,
  OnGlobalQueueError,
  OnQueueRemoved,
  // OnQueueCompleted,
  OnQueueStalled,
  // OnQueueWaiting,
  // OnQueueActive,
  // OnQueueProgress,
  // OnQueuePaused,
  // OnQueueResumed,
  // OnQueueCleaned,
  // OnQueueDrained,
} from '@nestjs/bull';
import { Logger, Injectable } from '@nestjs/common';
import { Job } from 'bull';

/**
 * 抽象BULL队列监听器基础服务
 *
 */
@Injectable()
export class BaseBullProcessor {
  protected logger: Logger;

  protected constructor(serviceName: string) {
    this.logger = new Logger(serviceName);
  }

  @OnQueueStalled()
  async onQueueStalled(job: Job) {
    this.logger.log(job, 'OnQueueStalled');
  }

  @OnGlobalQueueError()
  onGlobalQueueError(job: Job, error: Error) {
    this.logger.error(error, 'OnGlobalQueueError');
  }

  @OnQueueFailed()
  async onFailed(job: Job, error: Error) {
    this.logger.error(error, 'OnQueueFailed');
  }

  @OnQueueError()
  onError(job: Job, error: Error) {
    this.logger.error(error, 'OnQueueError');
  }

  @OnQueueRemoved()
  onQueueRemoved(job: Job) {
    this.logger.log(job, 'onQueueRemoved');
  }

  // @OnQueueWaiting()
  // onQueueWaiting(jobId: number) {
  //   this.logger.log(jobId, 'OnQueueWaiting');
  // }

  // @OnQueueActive()
  // onQueueActive(job: Job) {
  //   this.logger.log(job, 'OnQueueActive');
  // }

  // @OnQueueProgress()
  // onQueueProgress(job: Job, progress: number) {
  //   this.logger.log(job, 'OnQueueProgress', progress);
  // }

  // @OnQueuePaused()
  // onQueuePaused(job: Job) {
  //   this.logger.log(job, 'OnQueuePaused');
  // }

  // @OnQueueResumed()
  // onQueueResumed(job: Job) {
  //   this.logger.log(job, 'OnQueueResumed');
  // }

  // @OnQueueCleaned()
  // onQueueCleaned(job: Job) {
  //   this.logger.log(job, 'OnQueueCleaned');
  // }

  // @OnQueueDrained()
  // onQueueDrained(job: Job) {
  //   this.logger.log(job, 'OnQueueDrained');
  // }

  // @OnQueueCompleted()
  // async onQueueCompleted(job: Job, result: any) {
  //   this.logger.log(job, 'OnQueueCompleted', result);
  //   if (!result) {
  //     this.logger.log('任务完成得不正常');
  //   }
  // }
}
