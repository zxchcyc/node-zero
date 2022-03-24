import { Module } from '@nestjs/common';
import { OcrService } from './ocr.service';

@Module({
  imports: [],
  controllers: [],
  providers: [OcrService],
  exports: [OcrService],
})
export class OcrModule {}
