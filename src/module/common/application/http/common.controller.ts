import { Controller, Get, Head, Query } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiCommResponse, EHttpErrorCode } from 'src/common';
import { OssService } from 'src/internal/oss/oss.service';
import { EnvService } from '../../../../internal/env/env.service';
import { GetPostPolicyResDto, GetPostPolicyReqDto } from '../../dto/common.dto';

@ApiTags('Common')
@Controller('common')
export class CommonController {
  constructor(
    protected readonly envService: EnvService,
    private readonly ossService: OssService,
  ) {}

  @Head('/')
  @ApiOperation({ summary: '健康检查' })
  @ApiCommResponse()
  async alive() {
    return {};
  }

  @Get('/error-code')
  @ApiOperation({ summary: '获取错误码列表' })
  @ApiExtraModels()
  @ApiCommResponse()
  async errorCode() {
    return { result: EHttpErrorCode };
  }

  @Get('/server-time')
  @ApiOperation({ summary: '获取系统时间' })
  @ApiExtraModels()
  @ApiCommResponse()
  async serverTime() {
    return {
      result: {
        now: new Date(),
      },
    };
  }

  @Get('/oss/up-token')
  @ApiOperation({ summary: '获取OSS上传权限' })
  @ApiCommResponse('obj', GetPostPolicyResDto)
  @ApiExtraModels(GetPostPolicyResDto)
  async getPostPolicy(@Query() data: GetPostPolicyReqDto) {
    const result = this.ossService.getPostPolicy(data.prefix);
    return { result };
  }
}
