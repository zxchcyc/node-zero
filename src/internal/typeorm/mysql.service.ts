import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { EnvService } from '../env/env.service';

@Injectable()
export class MysqlService implements TypeOrmOptionsFactory {
  constructor(private readonly envService: EnvService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.envService.get('MYSQL_HOST'),
      port: Number(this.envService.get('MYSQL_PORT')),
      username: this.envService.get('MYSQL_USERNAME'),
      password: this.envService.get('MYSQL_PASSWORD'),
      database: this.envService.get('MYSQL_DATABASE'),
      autoLoadEntities: true,
      synchronize: false,
      logging: true,
      logger: 'advanced-console',
      maxQueryExecutionTime: 1000,
    };
  }
}
