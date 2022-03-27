declare const module: any;
import { install } from 'source-map-support';
import {
  BadRequestException,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createBullBoard } from 'bull-board';
import { BullAdapter } from 'bull-board/bullAdapter';
import { Queue } from 'bull';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvService } from './internal/env/env.service';
import { BULL_QUEUES } from './external/bullmq/constant/constant';
import { LoggerService } from './internal/logger/logger.service';
import { privateApiMiddlewareFunction } from './common';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import { ExpressAdapter } from '@nestjs/platform-express';
initializeTransactionalContext();
patchTypeORMRepositoryWithBaseRepository();

async function bootstrap() {
  install();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(), {
    cors: true,
    bodyParser: false,
  });

  // 配置全局日志
  app.useLogger(app.get(LoggerService));
  const logger = new Logger('bootstrap');

  // 配置全局参数校验
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) => {
        console.error('参数校验不通过', errors);
        throw new BadRequestException(errors, 'A0006');
      },
      enableDebugMessages: true,
      // @Type(() => Number)
      transform: true,
      // 只有添加了验证装饰器的属性才能被定义 其他被过滤掉
      whitelist: true,
      validationError: {
        // 这两个属性不暴露
        target: false,
        value: false,
      },
    }),
  );
  const envService = app.get(EnvService);
  // 配置全局根路由
  app.setGlobalPrefix('api');

  // bull UI
  const { router } = createBullBoard(
    BULL_QUEUES.map((e) => new BullAdapter(app.get<Queue>(`BullQueue_${e}`))),
  );
  app.use(
    '/api/private/admin/queues',
    privateApiMiddlewareFunction(envService),
    router,
  );

  // 配置 Swagger API 文档
  const options = new DocumentBuilder()
    .setTitle('NODE ZERO API')
    .setDescription('NODE ZERO API')
    .setVersion('V1.0.0')
    .addBearerAuth()
    .addServer('http://localhost:3002', 'Local')
    .addServer('https://node-zero-api-dev.zxchcyc.com', 'Dev')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  // docs 插入配置 权限分散管理
  envService.set(
    Object.assign(
      {},
      { openapiPaths: document['paths'] },
      envService['envConfig'],
    ),
  );

  await app.listen(process.env.PORT, () => {
    logger.debug(
      `Swagger API Docs started on: http://localhost:${process.env.PORT}/docs/`,
    );
    logger.debug(
      `Bull UI started on: http://localhost:${process.env.PORT}/api/private/admin/queues/`,
    );
  });

  // webpack 热加载
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  process.on('unhandledRejection', (error: Error, promise) => {
    logger.error(error, promise);
  });

  process.on('uncaughtException', (error: Error) => {
    logger.error(error);
  });
}

bootstrap();
