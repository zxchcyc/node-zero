import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { XxljobService } from './xxl-job.service';

@ApiTags('Xxljob')
@Controller('xxljob')
export class XxljobController {
  constructor(private readonly xxljobService: XxljobService) {
    this.xxljobService.registry() &&
      setInterval(this.xxljobService.registry.bind(this.xxljobService), 30000);
    return;
  }

  @Post('/beat')
  @ApiOperation({ summary: '心跳检测：调度中心检测执行器是否在线时使用' })
  async beat() {
    const result = { code: 200, msg: 'success' };
    return { result: { resType: 'xxljob', data: result } };
  }

  @Post('/idleBeat')
  @ApiOperation({
    summary:
      '忙碌检测：调度中心检测指定执行器上指定任务是否忙碌（运行中）时使用',
  })
  async idleBeat() {
    // const result = { code: 500, msg: 'busy' };
    const result = { code: 200, msg: 'idle' };
    return { result: { resType: 'xxljob', data: result } };
  }

  @Post('/kill')
  @ApiOperation({ summary: '终止任务' })
  async kill(@Body() data) {
    const result = { code: 500, msg: `not yet support, jobId(${data.jobId})` };
    return { result: { resType: 'xxljob', data: result } };
  }

  @Post('/log')
  @ApiOperation({ summary: '查看日志' })
  async log() {
    const result = {
      code: 200,
      content: '',
    };
    return { result: { resType: 'xxljob', data: result } };
  }

  @Post('/run')
  @ApiOperation({ summary: '触发任务执行' })
  async run(@Body() data) {
    await this.xxljobService.run(data);
    const result = { code: 200, msg: 'success' };
    return { result: { resType: 'xxljob', data: result } };
  }
}
