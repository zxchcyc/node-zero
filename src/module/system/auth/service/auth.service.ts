import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtPayload } from '../interface/jwt-payload.interface';
import { jwtConstants } from '../constant/constant';
import { BaseService, ELoginWebSite } from 'src/common';
import { getContext } from 'src/awesome';

type Token = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: string;
};

@Injectable()
export class AuthService extends BaseService {
  constructor(private readonly jwtService: JwtService) {
    super(AuthService.name);
  }

  private key(type: string, payload: IJwtPayload) {
    return `${type}:${payload.terminal}:${payload.id}`;
  }

  async genToken(payload: IJwtPayload): Promise<Token> {
    payload.website = ELoginWebSite.nodeZero;
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: jwtConstants.refreshTokenExpiresIn,
    });
    await this.lockService.redis.set(
      this.key('accessToken', payload),
      accessToken,
      'EX',
      jwtConstants.redisAccessTokenExpiresIn,
    );
    await this.lockService.redis.set(
      this.key('refreshToken', payload),
      refreshToken,
      'EX',
      jwtConstants.redisRefreshTokenExpiresIn,
    );
    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn: jwtConstants.accessTokenExpiresIn,
    };
  }

  async destroyToken(payload: IJwtPayload): Promise<void> {
    await this.lockService.redis.del(this.key('accessToken', payload));
    await this.lockService.redis.del(this.key('refreshToken', payload));
    return;
  }

  async auth(payload: IJwtPayload, headerToken?: string): Promise<boolean> {
    const accessToken = await this.lockService.redis.get(
      this.key('accessToken', payload),
    );
    const refreshToken = await this.lockService.redis.get(
      this.key('refreshToken', payload),
    );
    if (!headerToken) {
      headerToken = getContext('token');
    }
    if (accessToken && accessToken === headerToken) {
      return true;
    }
    if (refreshToken && refreshToken === headerToken) {
      return true;
    }
    return false;
  }
}
