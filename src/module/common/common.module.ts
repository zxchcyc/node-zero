import { Module } from '@nestjs/common';
import { CommonController } from './application/http/common.controller';

@Module({
  imports: [],
  controllers: [CommonController],
  providers: [],
  exports: [],
})
export class CommonModule {}
