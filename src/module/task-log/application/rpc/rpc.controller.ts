import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { from, Observable } from 'rxjs';
import { TaskLogDto } from '../../dto/task-log.dto';

@Controller()
export class DemoRpcController {
  private readonly items: TaskLogDto[] = [
    {
      _id: 1,
      name: 'A',
      separateAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 1,
    },
    {
      _id: 2,
      name: 'B',
      separateAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 2,
    },
  ];

  @GrpcMethod('DemoService')
  find(data: TaskLogDto): Observable<TaskLogDto> {
    console.log('rpc-server', data);
    return from(this.items);
  }
}
