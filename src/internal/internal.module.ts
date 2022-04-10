import { Global, Module } from '@nestjs/common';
import { MyBullModule } from './bull/bull.module';
import { EnvModule } from './env/env.module';
import { MyKafkaModule } from './kafka/kafka.module';
import { LimitModule } from './limit/limit.module';
import { LockModule } from './lock/lock.module';
import { MyLoggerModule } from './logger/logger.module';
import { OssModule } from './oss/oss.module';
// import { MyMongooseModule } from './mongoose/mongoose.module';
import { IoRedisModule } from './redis/redis.module';
import { MyTypeOrmModule } from './typeorm/typeorm.module';

@Global()
@Module({
  imports: [
    EnvModule.register({ folder: process.env.CONFIG_FOLDER }),
    MyTypeOrmModule,
    // MyMongooseModule,
    MyKafkaModule,
    MyLoggerModule,
    MyBullModule,
    IoRedisModule,
    LockModule,
    LimitModule,
    OssModule,
  ],
  exports: [
    EnvModule.register({ folder: process.env.CONFIG_FOLDER }),
    MyTypeOrmModule,
    // MyMongooseModule,
    MyKafkaModule,
    MyLoggerModule,
    MyBullModule,
    IoRedisModule,
    LockModule,
    LimitModule,
    OssModule,
  ],
})
export class InternalModule {}
