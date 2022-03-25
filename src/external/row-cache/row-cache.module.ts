import { Module } from '@nestjs/common';
import { RowCacheService } from './row-cache.service';

@Module({
  imports: [],
  controllers: [],
  providers: [RowCacheService],
  exports: [RowCacheService],
})
export class RowCacheModule {}
