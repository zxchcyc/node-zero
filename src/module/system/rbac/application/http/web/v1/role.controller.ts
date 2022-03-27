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
import { RoleService } from '../../../../service/role.service';
import { IdResDto, IdReqDto } from 'src/common/dto';
import { CountResDto } from 'src/common/dto/res-count.dto';
import {
  FindRoleReqDto,
  FindRoleResDto,
  CreateRoleReqDto,
  FindOneRoleResDto,
  UpdateRoleReqDto,
  BatchDeleteReqDto,
  BatchUpdateReqDto,
} from '../../../../dto/role.dto';
import { JwtAuthGuard } from 'src/module/system/auth/guard/jwt-auth.guard';

@ApiTags('WebV1Role')
@Controller('web/v1')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
export class RoleWebController extends BaseController {
  constructor(private readonly roleService: RoleService) {
    super(RoleWebController.name);
  }

  @Get('/role/count')
  @ApiOperation({ summary: '获取总数' })
  @ApiCommResponse('obj', CountResDto)
  @ApiExtraModels(CountResDto)
  async count(@Query() data: FindRoleReqDto) {
    const result = await this.roleService.count(data);
    return { result: { total: result } };
  }

  @Get('/role/list')
  @ApiOperation({ summary: '获取分页列表' })
  @ApiCommResponse('paging', FindRoleResDto)
  @ApiExtraModels(FindRoleResDto)
  async getPaging(@Query() data: FindRoleReqDto) {
    const result = await this.roleService.find(data);
    return { result: { data: result } };
  }

  @Post('/role')
  @ApiOperation({ summary: '创建' })
  @ApiCommResponse('obj', IdResDto)
  @ApiExtraModels(IdResDto)
  async create(@Body() data: CreateRoleReqDto) {
    const result = await this.roleService.create(data);
    return { result };
  }

  @Get('/role/:id')
  @ApiOperation({ summary: '获取详情' })
  @ApiCommResponse('obj', FindOneRoleResDto)
  @ApiExtraModels(FindOneRoleResDto)
  async findById(@Param() params: IdReqDto) {
    return { result: await this.roleService.findById(params.id) };
  }

  @Put('/role/:id')
  @ApiOperation({ summary: '修改' })
  @ApiCommResponse('obj', IdResDto)
  @ApiExtraModels(IdResDto)
  async updateById(@Param() params: IdReqDto, @Body() data: UpdateRoleReqDto) {
    const result = await this.roleService.updateById(params.id, data);
    return { result };
  }

  @Delete('/role/batch')
  @ApiOperation({ summary: '批量删除' })
  @ApiCommResponse()
  async batchDelete(@Body() data: BatchDeleteReqDto) {
    await this.roleService.batchDelete(data);
    return { result: null };
  }

  @Patch('/role/batch')
  @ApiOperation({ summary: '批量操作' })
  @ApiCommResponse()
  async batchUpdate(@Body() data: BatchUpdateReqDto) {
    await this.roleService.batchUpdate(data);
    return { result: null };
  }
}
