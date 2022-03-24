import { AuthService } from '../auth.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../constant/constant';
import { IJwtPayload } from '../jwt-payload.interface';
import { setContext } from 'src/awesome';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: IJwtPayload) {
    const pass = await this.authService.auth(payload);
    if (!pass) {
      throw new BadRequestException('A0007');
    }

    // 全局注入用户信息
    // 这两个不要注入
    // iat: 1641955525,
    // exp: 1642041925
    setContext('user', {
      id: payload.id,
      terminal: payload.terminal,
      type: payload.type,
      website: payload.website,
    });

    // 返回的对象注入到 request.user
    return {};
  }
}
