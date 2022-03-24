import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MysqlService } from './mysql.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: MysqlService,
    }),
  ],
})
export class MyTypeOrmModule {}
