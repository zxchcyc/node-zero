import { Injectable } from '@nestjs/common';
import { BaseService, LoggerDebug } from 'src/common';
import { HttpService } from '../http/http.service';

@Injectable()
export class XxljobService extends BaseService {
  constructor(private readonly httpService: HttpService) {
    super(XxljobService.name);
  }

  async kill(data) {
    const { jobId } = data;
    const jobs = await this.getJob(jobId);
    for (const job of jobs) {
      // 全部任务都清除
      await job?.remove();
    }
    await this.lockService.redis.del(`xxljob:${jobId}`);
  }

  async idleBeat(data) {
    const { jobId } = data;
    const jobs = await this.getJob(jobId);
    let completed: boolean;
    for (const job of jobs) {
      completed = await job.isCompleted();
      // 有一个没有完成就算没完成
      if (!completed) {
        break;
      }
    }
    return completed;
  }

  @LoggerDebug()
  async getJob(jobId: string) {
    const jobSet = await this.lockService.redis.smembers(`xxljob:${jobId}`);
    // this.logger.debug(`getJob: ${jobId} -> ${jobs}`);
    const result = [];
    for (const e of jobSet) {
      const queue = e.split('_')[0];
      const job = await this.bullmqService.getJob(queue, e);
      if (job) {
        result.push(job);
      }
    }
    return result;
  }

  @LoggerDebug()
  async run(data) {
    // "jobId":1,                                  // 任务ID
    // "executorHandler":"demoJobHandler",         // 任务标识
    // "executorParams":"demoJobHandler",          // 任务参数
    // "executorBlockStrategy":"COVER_EARLY",      // 任务阻塞策略，可选值参考 com.xxl.job.core.enums.ExecutorBlockStrategyEnum
    // "executorTimeout":0,                        // 任务超时时间，单位秒，大于零时生效
    // "logId":1,                                  // 本次调度日志ID
    // "logDateTime":1586629003729,                // 本次调度日志时间
    // "glueType":"BEAN",                          // 任务模式，可选值参考 com.xxl.job.core.glue.GlueTypeEnum
    // "glueSource":"xxx",                         // GLUE脚本代码
    // "glueUpdatetime":1586629003727,             // GLUE脚本更新时间，用于判定脚本是否变更以及是否需要刷新
    // "broadcastIndex":0,                         // 分片参数：当前分片
    // "broadcastTotal":0                          // 分片参数：总分片
    const { executorHandler, jobId, logId } = data;
    const queue = executorHandler.split('_')[0];
    const topic = executorHandler.split('_')[0];
    const tag = executorHandler.split('_')[1];
    await this.bullmqService.add(
      {
        queue,
        topic,
        tag,
      },
      data,
      {
        jobId: `${queue}_${jobId}_${logId}`,
      },
    );
    // xxljob_jobId -> bull_jobId 关系保存到redis中
    await this.lockService.redis.sadd(
      `xxljob:${jobId}`,
      `${queue}_${jobId}_${logId}`,
    );
    return;
  }

  async registry() {
    const url = `/api/registry`;
    const data = {
      registryGroup: 'EXECUTOR',
      registryKey: this.envService.get('XXL_JOB_EXECUTOR_KEY'),
      registryValue: this.envService.get('XXL_JOB_EXECUTOR_URL'),
    };
    await this.httpService.xxljobRequest(url, data);
  }

  async registryRemove() {
    const url = `/api/registryRemove`;
    const data = {
      registryGroup: 'EXECUTOR',
      registryKey: this.envService.get('XXL_JOB_EXECUTOR_KEY'),
      registryValue: this.envService.get('XXL_JOB_EXECUTOR_URL'),
    };
    await this.httpService.xxljobRequest(url, data);
  }

  async callback(error: Error, { logId, result }) {
    const url = `/api/callback`;
    const handleCode = error ? 500 : 200;
    const handleMsg = error
      ? error.message || error.toString()
      : result
      ? JSON.stringify(result)
      : 'success';
    const data = [{ logId, logDateTim: Date.now(), handleCode, handleMsg }];
    await this.httpService.xxljobRequest(url, data);
  }
}
