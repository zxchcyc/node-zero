import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';

@Injectable()
export class MysqlService implements TypeOrmOptionsFactory {
  constructor(private readonly envService: EnvService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      charset: 'utf8mb4',
      timezone: '+08:00',
      host: this.envService.get('MYSQL_HOST'),
      port: Number(this.envService.get('MYSQL_PORT')),
      username: this.envService.get('MYSQL_USERNAME'),
      password: this.envService.get('MYSQL_PASSWORD'),
      database: this.envService.get('MYSQL_DATABASE'),
      connectTimeout: 60 * 60 * 1000,
      acquireTimeout: 60 * 60 * 1000,
      autoLoadEntities: true,
      synchronize: this.envService.get('MYSQL_SYNCHRONIZE') === 'true',
      logging: this.envService.get('MYSQL_LOGGING') === 'true',
      logger: 'advanced-console',
      maxQueryExecutionTime: 10 * 1000 * 10,
    };
  }
}
