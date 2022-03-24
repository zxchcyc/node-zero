import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ModulesModule } from './module/module.module';
import { ScriptModule } from './script/script.module';
import { InternalModule } from './internal/internal.module';
import { ExternalModule } from './external/external.module';
import {
  AllExceptionFilter,
  HttpExceptionFilter,
  JsonBodyMiddleware,
  PrivateApiMiddleware,
  ResTimeInterceptor,
  TraceIdMiddleware,
} from './common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    // 基础设施加载
    ExternalModule,

    // 基础设施加载
    InternalModule,

    // 业务模块加载
    ModulesModule,

    // 任务模块加载
    ScheduleModule.forRoot(),

    // 限流模块加载
    ThrottlerModule.forRoot(),

    // 初始化脚本加载
    ScriptModule,
  ],
  providers: [
    // 全局使用请求成功拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: ResTimeInterceptor,
    },
    // 全局捕获并处理 未知 异常
    // 先注册慢调用 这个顺序不能乱来
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    // 全局捕获并处理Http异常
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JsonBodyMiddleware).forRoutes('*');
    consumer.apply(PrivateApiMiddleware).forRoutes('private/');
    consumer.apply(TraceIdMiddleware).forRoutes('*');
  }
}
