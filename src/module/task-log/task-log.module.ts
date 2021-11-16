import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
import { AbstractFacadeService } from './facade/facade.abstract';
import { FacadeService } from './facade/facade.impl';
import { AbstractRepositoryService } from './repository/repository.abstract';
// import { RepositoryService } from './repository/typeorm.impl';
// import { TaskLogEntity } from './repository/task-log.entity';
import { TaskLogService } from './service/task-log.service';
import { WebTaskLogController } from './application/http/web/v1/task-log.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskLogSchema, taskLogSchema } from './repository/task-log.schema';
import { RepositoryService } from './repository/mongoose.impl';
import { DemoRpcController } from './application/rpc/rpc.controller';
import { ClientsModule } from '@nestjs/microservices';
import { grpcClientOptions } from 'src/rpc/grpc-client.options';
// import { RepositoryService } from './repository/rpc.impl';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DEMO_PACKAGE',
        ...grpcClientOptions,
      },
    ]),
    // TypeOrmModule.forFeature([TaskLogEntity], 'mysql'),
    MongooseModule.forFeature(
      [
        {
          name: TaskLogSchema.name,
          schema: taskLogSchema,
        },
      ],
      'mongo-edc-dw',
    ),
  ],
  controllers: [WebTaskLogController, DemoRpcController],
  providers: [
    {
      provide: AbstractFacadeService,
      useClass: FacadeService,
    },
    {
      provide: AbstractRepositoryService,
      useClass: RepositoryService,
    },
    TaskLogService,
  ],
  exports: [AbstractFacadeService],
})
export class TaskLogModule {}
