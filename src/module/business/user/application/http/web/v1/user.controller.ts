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
import { UserAbstractFacadeService } from '../../../../facade/user.facade.abstract';
import { IdResDto, IdReqDto } from 'src/common/dto';
import { CountResDto } from 'src/common/dto/res-count.dto';
import {
  FindUserReqDto,
  FindUserResDto,
  CreateUserReqDto,
  FindOneUserResDto,
  UpdateUserReqDto,
  BatchDeleteReqDto,
  BatchUpdateReqDto,
} from '../../../../dto/user.dto';
import { JwtAuthWhiteListGuard } from 'src/module/system/auth/guard/jwt-auth-whitelist.guard';

@ApiTags('WebV1User')
@Controller('web/v1')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthWhiteListGuard)
export class UserWebController extends BaseController {
  constructor(private readonly facadeService: UserAbstractFacadeService) {
    super(UserWebController.name);
  }

  @Get('/user/count')
  @ApiOperation({ summary: '获取总数' })
  @ApiCommResponse('obj', CountResDto)
  @ApiExtraModels(CountResDto)
  async count(@Query() data: FindUserReqDto) {
    const result = await this.facadeService.count(data);
    return { result: { total: result } };
  }

  @Get('/user/list')
  @ApiOperation({ summary: '获取分页列表' })
  @ApiCommResponse('paging', FindUserResDto)
  @ApiExtraModels(FindUserResDto)
  async getPaging(@Query() data: FindUserReqDto) {
    const result = await this.facadeService.getPaging(data);
    return { result: { data: result } };
  }

  @Post('/user')
  @ApiOperation({ summary: '创建' })
  @ApiCommResponse('obj', IdResDto)
  @ApiExtraModels(IdResDto)
  async create(@Body() data: CreateUserReqDto) {
    const result = await this.facadeService.create(data);
    return { result };
  }

  @Get('/user/:id')
  @ApiOperation({ summary: '获取详情' })
  @ApiCommResponse('obj', FindOneUserResDto)
  @ApiExtraModels(FindOneUserResDto)
  async findById(@Param() params: IdReqDto) {
    return { result: await this.facadeService.findById(params.id) };
  }

  @Put('/user/:id')
  @ApiOperation({ summary: '修改' })
  @ApiCommResponse('obj', IdResDto)
  @ApiExtraModels(IdResDto)
  async updateById(
    @Param() params: IdReqDto,
    @Body() data: UpdateUserReqDto,
  ) {
    const result = await this.facadeService.updateById(params.id, data);
    return { result };
  }

  @Delete('/user/batch')
  @ApiOperation({ summary: '批量删除' })
  @ApiCommResponse()
  async batchDelete(@Body() data: BatchDeleteReqDto) {
    await this.facadeService.batchDelete(data);
    return { result: null };
  }

  @Patch('/user/batch')
  @ApiOperation({ summary: '批量操作' })
  @ApiCommResponse()
  async batchUpdate(@Body() data: BatchUpdateReqDto) {
    await this.facadeService.batchUpdate(data);
    return { result: null };
  }
}
