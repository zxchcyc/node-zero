import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionGuard, BaseController, ApiCommResponse } from 'src/common';
import { RegionService } from '../../../../service/region.service';
import { CountResDto } from 'src/common/dto/res-count.dto';
import { FindRegionReqDto, FindRegionResDto } from '../../../../dto/region.dto';
import { JwtAuthGuard } from 'src/module/system/auth/guard/jwt-auth.guard';

@ApiTags('WebV1Region')
@Controller('web/v1')
// @UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
export class RegionWebController extends BaseController {
  constructor(private readonly regionService: RegionService) {
    super(RegionWebController.name);
  }

  
  @Get('/region/count')
  @ApiOperation({ summary: '获取总数' })
  @ApiCommResponse('obj', CountResDto)
  @ApiExtraModels(CountResDto)
  async count(@Query() data: FindRegionReqDto) {
    const result = await this.regionService.count(data);
    return { result: { total: result } };
  }

  @Get('/region/list')
  @ApiOperation({ summary: '获取分页列表' })
  @ApiCommResponse('paging', FindRegionResDto)
  @ApiExtraModels(FindRegionResDto)
  async getPaging(@Query() data: FindRegionReqDto) {
    const result = await this.regionService.find(data);
    return { result: { data: result } };
  }
}
