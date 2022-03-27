import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullProcessor } from './application/bullmq/bull.processor';
import { BullTagService } from './application/bullmq/bull-tag.service';
import { UserWebController } from './application/http/web/v1/user.controller';
import { UserScheduleService } from './application/schedule/schedule.service';
import { UserAbstractFacadeService } from './facade/user.facade.abstract';
import { UserFacadeService } from './facade/user.facade.impl';
import { UserAbstractRepoService } from './repository/user.abstract';
import { UserRepoService } from './repository/user.cache.impl';
import { UserEntity } from './repository/user.entity';
import { UserService } from './service/user.service';
import { RocketTagService } from './application/rocketmq/rocket-tag.service';
import { RocketmqProcessor } from './application/rocketmq/rocketmq.processor';
import { UserAggService } from './service/user-agg.service';
import { UserRoleEntity } from './repository/user-role.entity';
import { UserRoleService } from './service/user-role.service';
import { UserDeptService } from './service/user-dept.service';
import { UserDeptEntity } from './repository/user-dept.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserRoleEntity, UserDeptEntity]),
  ],
  controllers: [UserWebController],
  providers: [
    {
      provide: UserAbstractFacadeService,
      useClass: UserFacadeService,
    },
    {
      provide: UserAbstractRepoService,
      useClass: UserRepoService,
    },
    UserService,
    UserAggService,
    UserRoleService,
    UserDeptService,
    UserScheduleService,
    BullTagService,
    BullProcessor,
    RocketTagService,
    RocketmqProcessor,
  ],
  exports: [UserAbstractFacadeService],
})
export class UserModule {}
