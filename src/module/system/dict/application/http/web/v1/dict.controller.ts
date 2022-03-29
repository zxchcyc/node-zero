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
import {
  ApiExtension,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionGuard, BaseController, ApiCommResponse } from 'src/common';
import { DictService } from '../../../../service/dict.service';
import { IdResDto, IdReqDto } from 'src/common/dto';
import { CountResDto } from 'src/common/dto/res-count.dto';
import {
  FindDictReqDto,
  FindDictResDto,
  CreateDictReqDto,
  FindOneDictResDto,
  UpdateDictReqDto,
  BatchDeleteReqDto,
  BatchUpdateReqDto,
} from '../../../../dto/dict.dto';
import { JwtAuthGuard } from 'src/module/system/auth/guard/jwt-auth.guard';

@ApiTags('WebV1Dict')
@Controller('web/v1')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
export class DictWebController extends BaseController {
  constructor(private readonly dictService: DictService) {
    super(DictWebController.name);
  }

  @ApiExtension('x-permission', {
    moduleName: '字典管理',
    groupName: ['字典管理'],
  })
  @Get('/dict/count')
  @ApiOperation({ summary: '获取总数' })
  @ApiCommResponse('obj', CountResDto)
  @ApiExtraModels(CountResDto)
  async count(@Query() data: FindDictReqDto) {
    const result = await this.dictService.count(data);
    return { result: { total: result } };
  }

  @ApiExtension('x-permission', {
    moduleName: '字典管理',
    groupName: ['字典管理'],
  })
  @Get('/dict/list')
  @ApiOperation({ summary: '获取分页列表' })
  @ApiCommResponse('paging', FindDictResDto)
  @ApiExtraModels(FindDictResDto)
  async getPaging(@Query() data: FindDictReqDto) {
    const result = await this.dictService.find(data);
    return { result: { data: result } };
  }

  @ApiExtension('x-permission', {
    moduleName: '字典管理',
    groupName: ['字典管理'],
  })
  @Post('/dict')
  @ApiOperation({ summary: '创建' })
  @ApiCommResponse('obj', IdResDto)
  @ApiExtraModels(IdResDto)
  async create(@Body() data: CreateDictReqDto) {
    const result = await this.dictService.create(data);
    return { result };
  }

  @ApiExtension('x-permission', {
    moduleName: '字典管理',
    groupName: ['字典管理'],
  })
  @Get('/dict/:id')
  @ApiOperation({ summary: '获取详情' })
  @ApiCommResponse('obj', FindOneDictResDto)
  @ApiExtraModels(FindOneDictResDto)
  async findById(@Param() params: IdReqDto) {
    return { result: await this.dictService.findById(params.id) };
  }

  @ApiExtension('x-permission', {
    moduleName: '字典管理',
    groupName: ['字典管理'],
  })
  @Put('/dict/:id')
  @ApiOperation({ summary: '修改' })
  @ApiCommResponse('obj', IdResDto)
  @ApiExtraModels(IdResDto)
  async updateById(@Param() params: IdReqDto, @Body() data: UpdateDictReqDto) {
    const result = await this.dictService.updateById(params.id, data);
    return { result };
  }

  @ApiExtension('x-permission', {
    moduleName: '字典管理',
    groupName: ['字典管理'],
  })
  @Delete('/dict/batch')
  @ApiOperation({ summary: '批量删除' })
  @ApiCommResponse()
  async batchDelete(@Body() data: BatchDeleteReqDto) {
    await this.dictService.batchDelete(data);
    return { result: null };
  }

  @ApiExtension('x-permission', {
    moduleName: '字典管理',
    groupName: ['字典管理'],
  })
  @Patch('/dict/batch')
  @ApiOperation({ summary: '批量操作' })
  @ApiCommResponse()
  async batchUpdate(@Body() data: BatchUpdateReqDto) {
    await this.dictService.batchUpdate(data);
    return { result: null };
  }
}
