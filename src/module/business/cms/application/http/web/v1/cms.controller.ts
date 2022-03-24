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
import { CmsAbstractFacadeService } from 'src/module/business/cms/facade/cms.facade.abstract';
import { JwtAuthGuard } from 'src/module/system/auth/guard/jwt-auth.guard';
import { IdResDto, IdReqDto } from 'src/common/dto';
import { CountResDto } from 'src/common/dto/res-count.dto';
import {
  FindCmsReqDto,
  FindCmsResDto,
  CreateCmsReqDto,
  FindOneCmsResDto,
  UpdateCmsReqDto,
  BatchDeleteReqDto,
  BatchUpdateReqDto,
} from 'src/module/business/cms/dto/cms.dto';

@ApiTags('WebV1Cms')
@Controller('web/v1')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
export class CmsWebController extends BaseController {
  constructor(private readonly facadeService: CmsAbstractFacadeService) {
    super(CmsWebController.name);
  }

  @Get('/cms/count')
  @ApiOperation({ summary: '获取总数' })
  @ApiCommResponse('obj', CountResDto)
  @ApiExtraModels(CountResDto)
  async count(@Query() data: FindCmsReqDto) {
    const result = await this.facadeService.count(data);
    return { result: { total: result } };
  }

  @Get('/cms/list')
  @ApiOperation({ summary: '获取分页列表' })
  @ApiCommResponse('paging', FindCmsResDto)
  @ApiExtraModels(FindCmsResDto)
  async getPaging(@Query() data: FindCmsReqDto) {
    const result = await this.facadeService.getPaging(data);
    return { result: { data: result } };
  }

  @Post('/cms')
  @ApiOperation({ summary: '创建' })
  @ApiCommResponse('obj', IdResDto)
  @ApiExtraModels(IdResDto)
  async create(@Body() data: CreateCmsReqDto) {
    const result = await this.facadeService.create(data);
    return { result };
  }

  @Get('/cms/:id')
  @ApiOperation({ summary: '获取详情' })
  @ApiCommResponse('obj', FindOneCmsResDto)
  @ApiExtraModels(FindOneCmsResDto)
  async findById(@Param() params: IdReqDto) {
    return { result: await this.facadeService.findById(params.id) };
  }

  @Put('/cms/:id')
  @ApiOperation({ summary: '修改' })
  @ApiCommResponse('obj', IdResDto)
  @ApiExtraModels(IdResDto)
  async updateById(@Param() params: IdReqDto, @Body() data: UpdateCmsReqDto) {
    const result = await this.facadeService.updateById(params.id, data);
    return { result };
  }

  @Delete('/cms/batch')
  @ApiOperation({ summary: '批量删除' })
  @ApiCommResponse()
  async batchDelete(@Body() data: BatchDeleteReqDto) {
    await this.facadeService.batchDelete(data);
    return { result: null };
  }

  @Patch('/cms/batch')
  @ApiOperation({ summary: '批量操作' })
  @ApiCommResponse()
  async batchUpdate(@Body() data: BatchUpdateReqDto) {
    await this.facadeService.batchUpdate(data);
    return { result: null };
  }
}
