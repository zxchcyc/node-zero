import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable, Subject } from 'rxjs';
import { BaseService } from 'src/common';
import { GetPagingTaskLogBo, TaskLogBo } from '../bo/task-log.bo';
import { AbstractRepositoryService } from './repository.abstract';

interface DemoService {
  find(data: TaskLogBo): Observable<TaskLogBo>;
}

export class RepositoryService
  extends BaseService
  implements OnModuleInit, AbstractRepositoryService
{
  private demoService: DemoService;
  constructor(@Inject('DEMO_PACKAGE') private readonly client: ClientGrpc) {
    super(RepositoryService.name);
  }
  onModuleInit() {
    this.demoService = this.client.getService<DemoService>('DemoService');
  }

  async find(query: GetPagingTaskLogBo): Promise<TaskLogBo[]> {
    const result$ = this.demoService.find({
      _id: 1,
      name: 'A',
      separateAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 1,
    });
    this.logger.log(query);
    return new Promise((resolve) => {
      const res = [];
      const demo$ = new Subject<TaskLogBo>();
      const onNext = (taskLog: TaskLogBo) => {
        res.push(taskLog);
        demo$.next(taskLog);
      };
      const onComplete = () => {
        resolve(res);
        demo$.complete();
      };
      result$.subscribe({
        next: onNext,
        complete: onComplete,
      });
    });
  }

  async save(): Promise<void> {
    this.logger.log('save');
    return;
  }
}
