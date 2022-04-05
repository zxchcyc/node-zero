import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import { HttpService } from '../http/http.service';

@Injectable()
export class XxljobService extends BaseService {
  constructor(private readonly httpService: HttpService) {
    super(XxljobService.name);
  }

  async run(data) {
    console.debug('===触发任务执行===', data);
    await this.bullmqService.add(
      {
        queue: 'xxljob',
        topic: 'xxljob',
        tag: data.executorHandler,
      },
      data,
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

  async callback(error, { logId, result }) {
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
