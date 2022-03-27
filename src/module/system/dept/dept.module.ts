import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeptWebController } from './application/http/web/v1/dept.controller';
import { DeptAbstractRepoService } from './repository/dept.abstract';
import { DeptRepoService } from './repository/dept.cache.impl';
import { DeptEntity } from './repository/dept.entity';
import { DeptService } from './service/dept.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeptEntity])],
  controllers: [DeptWebController],
  providers: [
    {
      provide: DeptAbstractRepoService,
      useClass: DeptRepoService,
    },
    DeptService,
  ],
  exports: [],
})
export class DeptModule {}
