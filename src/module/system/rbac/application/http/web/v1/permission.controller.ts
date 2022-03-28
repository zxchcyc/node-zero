import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiExtension,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionGuard, BaseController, ApiCommResponse } from 'src/common';
import { JwtAuthGuard } from 'src/module/system/auth/guard/jwt-auth.guard';
import { FindPermissionResDto } from 'src/module/system/rbac/dto/permission.dto';
import { PermissionService } from 'src/module/system/rbac/service/permission.service';

@ApiTags('WebV1Role')
@Controller('web/v1')
@UseGuards(PermissionGuard)
@UseGuards(JwtAuthGuard)
export class PermissionWebController extends BaseController {
  constructor(private readonly permissionService: PermissionService) {
    super(PermissionWebController.name);
  }

  @ApiExtension('x-permission', {
    moduleName: '角色管理',
    groupName: ['角色管理'],
  })
  @Get('/permission/list')
  @ApiOperation({ summary: '获取权限包分页列表' })
  @ApiCommResponse('paging', FindPermissionResDto)
  @ApiExtraModels(FindPermissionResDto)
  async getPaging() {
    const result = await this.permissionService.find();
    return { result: { data: result } };
  }
}
