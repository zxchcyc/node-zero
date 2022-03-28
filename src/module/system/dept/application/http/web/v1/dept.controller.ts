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
import { DeptService } from '../../../../service/dept.service';
import { IdResDto, IdReqDto } from 'src/common/dto';
import { CountResDto } from 'src/common/dto/res-count.dto';
import {
  FindDeptReqDto,
  FindDeptResDto,
  CreateDeptReqDto,
  FindOneDeptResDto,
  UpdateDeptReqDto,
  BatchDeleteReqDto,
  BatchUpdateReqDto,
} from '../../../../dto/dept.dto';
import { JwtAuthGuard } from 'src/module/system/auth/guard/jwt-auth.guard';

@ApiTags('WebV1Dept')
@Controller('web/v1')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
export class DeptWebController extends BaseController {
  constructor(private readonly deptService: DeptService) {
    super(DeptWebController.name);
  }

  @ApiExtension('x-permission', {
    moduleName: '部门管理',
    groupName: ['部门管理'],
  })
  @Get('/dept/count')
  @ApiOperation({ summary: '获取总数' })
  @ApiCommResponse('obj', CountResDto)
  @ApiExtraModels(CountResDto)
  async count(@Query() data: FindDeptReqDto) {
    const result = await this.deptService.count(data);
    return { result: { total: result } };
  }

  @ApiExtension('x-permission', {
    moduleName: '部门管理',
    groupName: ['部门管理'],
  })
  @Get('/dept/list')
  @ApiOperation({ summary: '获取分页列表' })
  @ApiCommResponse('paging', FindDeptResDto)
  @ApiExtraModels(FindDeptResDto)
  async getPaging(@Query() data: FindDeptReqDto) {
    const result = await this.deptService.find(data);
    return { result: { data: result } };
  }

  @ApiExtension('x-permission', {
    moduleName: '部门管理',
    groupName: ['部门管理'],
  })
  @Post('/dept')
  @ApiOperation({ summary: '创建' })
  @ApiCommResponse('obj', IdResDto)
  @ApiExtraModels(IdResDto)
  async create(@Body() data: CreateDeptReqDto) {
    const result = await this.deptService.create(data);
    return { result };
  }

  @ApiExtension('x-permission', {
    moduleName: '部门管理',
    groupName: ['部门管理'],
  })
  @Get('/dept/:id')
  @ApiOperation({ summary: '获取详情' })
  @ApiCommResponse('obj', FindOneDeptResDto)
  @ApiExtraModels(FindOneDeptResDto)
  async findById(@Param() params: IdReqDto) {
    return { result: await this.deptService.findById(params.id) };
  }

  @ApiExtension('x-permission', {
    moduleName: '部门管理',
    groupName: ['部门管理'],
  })
  @Put('/dept/:id')
  @ApiOperation({ summary: '修改' })
  @ApiCommResponse('obj', IdResDto)
  @ApiExtraModels(IdResDto)
  async updateById(@Param() params: IdReqDto, @Body() data: UpdateDeptReqDto) {
    const result = await this.deptService.updateById(params.id, data);
    return { result };
  }

  @ApiExtension('x-permission', {
    moduleName: '部门管理',
    groupName: ['部门管理'],
  })
  @Delete('/dept/batch')
  @ApiOperation({ summary: '批量删除' })
  @ApiCommResponse()
  async batchDelete(@Body() data: BatchDeleteReqDto) {
    await this.deptService.batchDelete(data);
    return { result: null };
  }

  @ApiExtension('x-permission', {
    moduleName: '部门管理',
    groupName: ['部门管理'],
  })
  @Patch('/dept/batch')
  @ApiOperation({ summary: '批量操作' })
  @ApiCommResponse()
  async batchUpdate(@Body() data: BatchUpdateReqDto) {
    await this.deptService.batchUpdate(data);
    return { result: null };
  }
}
