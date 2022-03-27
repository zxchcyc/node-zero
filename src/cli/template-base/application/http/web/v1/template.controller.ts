import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionGuard, BaseController, ApiCommResponse } from 'src/common';
import { TemplateService } from '../../../../service/template.service';
import { IdResDto, IdReqDto } from 'src/common/dto';
import { CountResDto } from 'src/common/dto/res-count.dto';
import {
  FindTemplateReqDto,
  FindTemplateResDto,
  CreateTemplateReqDto,
  FindOneTemplateResDto,
  UpdateTemplateReqDto,
  BatchDeleteReqDto,
  BatchUpdateReqDto,
} from '../../../../dto/template.dto';
import { JwtAuthGuard } from 'src/module/system/auth/guard/jwt-auth.guard';

@ApiTags('WebV1Template')
@Controller('web/v1')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
export class TemplateWebController extends BaseController {
  constructor(private readonly templateService: TemplateService) {
    super(TemplateWebController.name);
  }

  @Get('/template/count')
  @ApiOperation({ summary: '获取总数' })
  @ApiCommResponse('obj', CountResDto)
  @ApiExtraModels(CountResDto)
  async count(@Query() data: FindTemplateReqDto) {
    const result = await this.templateService.count(data);
    return { result: { total: result } };
  }

  @Get('/template/list')
  @ApiOperation({ summary: '获取分页列表' })
  @ApiCommResponse('paging', FindTemplateResDto)
  @ApiExtraModels(FindTemplateResDto)
  async getPaging(@Query() data: FindTemplateReqDto) {
    const result = await this.templateService.find(data);
    return { result: { data: result } };
  }

  @Post('/template')
  @ApiOperation({ summary: '创建' })
  @ApiCommResponse('obj', IdResDto)
  @ApiExtraModels(IdResDto)
  async create(@Body() data: CreateTemplateReqDto) {
    const result = await this.templateService.create(data);
    return { result };
  }

  @Get('/template/:id')
  @ApiOperation({ summary: '获取详情' })
  @ApiCommResponse('obj', FindOneTemplateResDto)
  @ApiExtraModels(FindOneTemplateResDto)
  async findById(@Param() params: IdReqDto) {
    return { result: await this.templateService.findById(params.id) };
  }

  @Put('/template/:id')
  @ApiOperation({ summary: '修改' })
  @ApiCommResponse('obj', IdResDto)
  @ApiExtraModels(IdResDto)
  async updateById(
    @Param() params: IdReqDto,
    @Body() data: UpdateTemplateReqDto,
  ) {
    const result = await this.templateService.updateById(params.id, data);
    return { result };
  }

  @Delete('/template/batch')
  @ApiOperation({ summary: '批量删除' })
  @ApiCommResponse()
  async batchDelete(@Body() data: BatchDeleteReqDto) {
    await this.templateService.batchDelete(data);
    return { result: null };
  }

  @Patch('/template/batch')
  @ApiOperation({ summary: '批量操作' })
  @ApiCommResponse()
  async batchUpdate(@Body() data: BatchUpdateReqDto) {
    await this.templateService.batchUpdate(data);
    return { result: null };
  }
}
