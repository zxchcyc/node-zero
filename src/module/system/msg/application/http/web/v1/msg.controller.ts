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
import { MsgAbstractFacadeService } from '../../../../facade/msg.facade.abstract';
import { IdResDto, IdReqDto } from 'src/common/dto';
import { CountResDto } from 'src/common/dto/res-count.dto';
import {
  FindMsgReqDto,
  FindMsgResDto,
  CreateMsgReqDto,
  FindOneMsgResDto,
  UpdateMsgReqDto,
  BatchDeleteReqDto,
  BatchUpdateReqDto,
} from '../../../../dto/msg.dto';
import { JwtAuthGuard } from 'src/module/system/auth/guard/jwt-auth.guard';

@ApiTags('WebV1Msg')
@Controller('web/v1')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
export class MsgWebController extends BaseController {
  constructor(private readonly facadeService: MsgAbstractFacadeService) {
    super(MsgWebController.name);
  }

  @ApiExtension('x-permission', {
    moduleName: '消息管理',
    groupName: ['消息管理'],
  })
  @Get('/msg/count')
  @ApiOperation({ summary: '获取总数' })
  @ApiCommResponse('obj', CountResDto)
  @ApiExtraModels(CountResDto)
  async count(@Query() data: FindMsgReqDto) {
    const result = await this.facadeService.count(data);
    return { result: { total: result } };
  }

  @ApiExtension('x-permission', {
    moduleName: '消息管理',
    groupName: ['消息管理'],
  })
  @Get('/msg/list')
  @ApiOperation({ summary: '获取分页列表' })
  @ApiCommResponse('paging', FindMsgResDto)
  @ApiExtraModels(FindMsgResDto)
  async getPaging(@Query() data: FindMsgReqDto) {
    const result = await this.facadeService.find(data);
    return { result: { data: result } };
  }

  @ApiExtension('x-permission', {
    moduleName: '消息管理',
    groupName: ['消息管理'],
  })
  @Post('/msg')
  @ApiOperation({ summary: '创建' })
  @ApiCommResponse('obj', IdResDto)
  @ApiExtraModels(IdResDto)
  async create(@Body() data: CreateMsgReqDto) {
    const result = await this.facadeService.create(data);
    return { result };
  }

  @ApiExtension('x-permission', {
    moduleName: '消息管理',
    groupName: ['消息管理'],
  })
  @Get('/msg/:id')
  @ApiOperation({ summary: '获取详情' })
  @ApiCommResponse('obj', FindOneMsgResDto)
  @ApiExtraModels(FindOneMsgResDto)
  async findById(@Param() params: IdReqDto) {
    return { result: await this.facadeService.findById(params.id) };
  }

  @ApiExtension('x-permission', {
    moduleName: '消息管理',
    groupName: ['消息管理'],
  })
  @Put('/msg/:id')
  @ApiOperation({ summary: '修改' })
  @ApiCommResponse('obj', IdResDto)
  @ApiExtraModels(IdResDto)
  async updateById(@Param() params: IdReqDto, @Body() data: UpdateMsgReqDto) {
    const result = await this.facadeService.updateById(params.id, data);
    return { result };
  }

  @ApiExtension('x-permission', {
    moduleName: '消息管理',
    groupName: ['消息管理'],
  })
  @Delete('/msg/batch')
  @ApiOperation({ summary: '批量删除' })
  @ApiCommResponse()
  async batchDelete(@Body() data: BatchDeleteReqDto) {
    await this.facadeService.batchDelete(data);
    return { result: null };
  }

  @ApiExtension('x-permission', {
    moduleName: '消息管理',
    groupName: ['消息管理'],
  })
  @Patch('/msg/batch')
  @ApiOperation({ summary: '批量操作' })
  @ApiCommResponse()
  async batchUpdate(@Body() data: BatchUpdateReqDto) {
    await this.facadeService.batchUpdate(data);
    return { result: null };
  }
}
