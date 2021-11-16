import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EdcMongoService } from './edc-mongo.service';
import { EdcDwMongoService } from './edc-dw-mongo.service';

@Module({
  imports: [
    // 支持多库配置
    MongooseModule.forRootAsync({
      connectionName: 'mongo-edc',
      useClass: EdcMongoService,
    }),
    MongooseModule.forRootAsync({
      connectionName: 'mongo-edc-dw',
      useClass: EdcDwMongoService,
    }),
  ],
})
export class MyMongooseModule {}
