import { Logger, Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';
import * as mongoose from 'mongoose';
import {
  MongooseOptionsFactory,
  MongooseModuleOptions,
} from '@nestjs/mongoose';

/**
 * mongo配置服务
 */
@Injectable()
export class EdcDwMongoService implements MongooseOptionsFactory {
  private logger: Logger = new Logger(EdcDwMongoService.name);
  constructor(private readonly envService: EnvService) {}
  createMongooseOptions(): MongooseModuleOptions {
    // 副本集
    // const uri: string = `mongodb+srv://${this.envService.get(
    //   'TRACE_MONGODB_USERNAME',
    // )}:${this.envService.get('TRACE_MONGODB_PASSWORD')}@${this.envService.get(
    //   'TRACE_MONGODB_ENDPOINT',
    // )}/${this.envService.get('TRACE_MONGODB_DATABASE')}`;

    let uri: string;
    if (this.envService.get('MONGODB_RS')) {
      // aliyun 副本集
      uri = `mongodb://${this.envService.get(
        'MONGODB_USERNAME',
      )}:${this.envService.get('MONGODB_PASSWORD')}@${this.envService.get(
        'MONGODB_ENDPOINT',
      )}/${this.envService.get(
        'MONGODB_DATABASE',
      )}?replicaSet=${this.envService.get('MONGODB_RS')}`;
    } else {
      // 单体
      uri = `mongodb://${this.envService.get(
        'MONGODB_USERNAME',
      )}:${this.envService.get('MONGODB_PASSWORD')}@${this.envService.get(
        'MONGODB_ENDPOINT',
      )}/${this.envService.get('MONGODB_DATABASE')}`;
    }
    this.logger.debug(uri);
    // 生产 log 可以关闭
    if (!this.envService.isProd()) {
      mongoose.set('debug', true);
    }

    return {
      uri,
      socketTimeoutMS: 60 * 1000,
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          this.logger.log('Mongo connected');
          this.logger.log(uri);
        });
        connection.on('error', (error) => {
          this.logger.error(error);
        });
        connection.on('reconnected', () => {
          this.logger.log('Mongo re-connected');
          this.logger.log(uri);
        });
        connection.on('disconnected', () => {
          this.logger.error('Mongo disconnected');
        });
        return connection;
      },
    };
  }
}
