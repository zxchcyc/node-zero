import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiCommResponse, PermissionGuard, BaseController } from 'src/common';
import {
  GetPagingTaskLogDto,
  TaskLogDto,
} from 'src/module/task-log/dto/task-log.dto';
import { AbstractFacadeService } from 'src/module/task-log/facade/facade.abstract';

@ApiTags('WebV1TaskLog')
@Controller('web/v1')
@UseGuards(PermissionGuard)
export class WebTaskLogController extends BaseController {
  constructor(private readonly taskLogfacadeService: AbstractFacadeService) {
    super(WebTaskLogController.name);
  }

  @Get('/task-log/list')
  @ApiOperation({ summary: '获取分页任务日志库列表' })
  @ApiCommResponse('paging', TaskLogDto)
  @ApiExtraModels(TaskLogDto)
  async getPagingTaskLogs(@Query() query: GetPagingTaskLogDto) {
    const result = await this.taskLogfacadeService.getPaging(query);
    return { result };
  }
}
