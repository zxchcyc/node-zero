import { DynamicModule, Module } from '@nestjs/common';
import { EnvService } from './env.service';
import { ENV_OPTIONS } from './constants';
import { EnvOptions } from './interface';

@Module({})
export class EnvModule {
  static register(options: EnvOptions): DynamicModule {
    return {
      module: EnvModule,
      providers: [
        {
          provide: ENV_OPTIONS,
          useValue: options,
        },
        EnvService,
      ],
      exports: [EnvService],
    };
  }
}
