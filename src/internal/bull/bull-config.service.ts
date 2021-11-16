/*
 * @Author: archer zheng
 * @Date: 2021-11-08 14:25:12
 * @LastEditTime: 2021-11-09 15:17:21
 * @LastEditors: archer zheng
 * @Description:
 * @FilePath: /node-zero/src/internal/bull/bull-config.service.ts
 */
import { EnvService } from '../env/env.service';
import { Injectable } from '@nestjs/common';
import { BullModuleOptions, BullOptionsFactory } from '@nestjs/bull';

@Injectable()
export class BullConfigService implements BullOptionsFactory {
  constructor(private readonly envService: EnvService) {}

  createBullOptions(): Promise<BullModuleOptions> | BullModuleOptions {
    return {
      prefix: this.envService.get('REDIS_KEYPREFIX'),
      redis: {
        // name: envService.get('REDIS_NAME'),
        host: this.envService.get('REDIS_HOST'),
        port: Number(this.envService.get('REDIS_PORT')),
        db: Number(this.envService.get('REDIS_DATABASE')),
        password: this.envService.get('REDIS_PASSWORD'),
        // reconnectOnError: (error: Error) => 1,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
      },
      defaultJobOptions: {
        attempts: 0,
        removeOnComplete: 100,
        // removeOnFail: true,
      },
      settings: {
        maxStalledCount: 1,
        retryProcessDelay: 5000,
      },
      limiter: {
        max: 1, // Max number of jobs processed
        duration: 100, // per duration in milliseconds
        bounceBack: false, // When jobs get rate limited, they stay in the waiting queue and are not moved to the delayed queue,
      },
    };
  }
}
