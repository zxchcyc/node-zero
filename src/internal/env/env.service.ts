import { Inject, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { parse } from 'dotenv';
import { ENV_OPTIONS } from './constants';
import { EnvConfig, EnvOptions } from './interface';

@Injectable()
export class EnvService {
  private envConfig: EnvConfig;

  constructor(@Inject(ENV_OPTIONS) options: EnvOptions) {
    const filePath = `.env.${
      process.env.NODE_ENV ? process.env.NODE_ENV : 'dev'
    }`;
    const envFile = resolve(__dirname, '../../', options.folder, filePath);
    this.envConfig = parse(readFileSync(envFile));
  }

  set(config: EnvConfig) {
    this.envConfig = config;
  }

  /**
   * @param key
   * @param byEnv 是否由 node 的环境变量中获取
   * @param defaultVal 默认值
   */
  get(key: string, byNodeEnv = false, defaultVal?: any): string {
    return (byNodeEnv ? process.env[key] : this.envConfig[key]) || defaultVal;
  }

  isProd(): boolean {
    return process.env.NODE_ENV === 'prod';
  }
}
