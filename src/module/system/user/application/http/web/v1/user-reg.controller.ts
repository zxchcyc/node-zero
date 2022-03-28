import { Body, Controller, Post } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController, ApiCommResponse } from 'src/common';
import { UserAbstractFacadeService } from '../../../../facade/user.facade.abstract';
import { IdResDto } from 'src/common/dto';
import { CreateUserReqDto } from '../../../../dto/user.dto';

@ApiTags('WebV1User')
@Controller('web/v1')
export class UserRegWebController extends BaseController {
  constructor(private readonly facadeService: UserAbstractFacadeService) {
    super(UserRegWebController.name);
  }

  @Post('/user/reg')
  @ApiOperation({ summary: '注册' })
  @ApiCommResponse('obj', IdResDto)
  @ApiExtraModels(IdResDto)
  async create(@Body() data: CreateUserReqDto) {
    const result = await this.facadeService.create(data);
    return { result };
  }
}
