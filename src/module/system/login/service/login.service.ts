import { BadRequestException, Injectable } from '@nestjs/common';
import {
  BaseService,
  ELoginDesc,
  ELoginStatus,
  ELoginTerminal,
  ELoginWay,
  ELoginWebSite,
  EStatus,
  ESystem,
  EVerifyCodeType,
} from 'src/common';
import {
  LoginByPhoneReqBo,
  LoginLogBo,
  LoginReqBo,
  LoginResBo,
} from '../bo/login.bo';
import { comparePassword } from './password';
import { verifyCodeUseKey } from './key';
import { LoginAbstractRepoService } from '../repository/login.abstract';
import { getContext } from 'src/awesome';
import { UserBo } from 'src/module/system/user/bo/user.bo';
import { EUserType } from 'src/module/system/user/enum/user.enum';
import { IJwtPayload } from '../../auth/interface/jwt-payload.interface';
import { AuthService } from '../../auth/service/auth.service';
import { UserAbstractFacadeService } from 'src/module/system/user/facade/user.facade.abstract';

@Injectable()
export class LoginService extends BaseService {
  constructor(
    private readonly loginRepoService: LoginAbstractRepoService,
    private readonly authService: AuthService,
    private readonly userFacadeService: UserAbstractFacadeService,
  ) {
    super(LoginService.name);
  }

  async refreshToken(payload: IJwtPayload) {
    // 禁用处理
    const user = await this.userFacadeService.findById(payload.id);
    if (!user || user.status === EStatus.disable) {
      throw new BadRequestException('A0800');
    }
    return await this.authService.genToken(payload);
  }

  async logout(payload: IJwtPayload) {
    // 销毁 token
    await this.authService.destroyToken(payload);
    return;
  }

  async login(data: LoginReqBo, terminal: ELoginTerminal): Promise<LoginResBo> {
    // 等保安全检查增加IP登录错误次数限流
    const ipErrorKey = `login:ipError:${getContext('ip')}`;
    const ipError = await this.lockService.redis.get(ipErrorKey);
    if (Number(ipError) > 1000) {
      throw new BadRequestException('A0831');
    }

    // 账号合法性检查
    const { password, account, type } = data;
    const user = await this.loginPreCond(account, type);
    if (!user) {
      await this.lockService.incrWithExpire(ipErrorKey);
      throw new BadRequestException('A0802');
    }

    const errorKey = `login:accountPasswordError:${user.id}`;
    const lockKey = `lock:login:accountPasswordError:${user.id}`;
    const lock = await this.lockService.redis.get(lockKey);
    if (lock) {
      await this.lockService.incrWithExpire(ipErrorKey);
      throw new BadRequestException('A0822');
    }
    // 登录日志
    const loginAt = new Date();
    const loginInfo = {
      uid: user.id,
      ip: getContext('ip'),
      webSite: ELoginWebSite.nodeZero,
      terminal,
      way: ELoginWay.password,
      status: ELoginStatus.success,
      desc: ELoginDesc.success,
      loginAt,
      system: ESystem.admin,
    };
    let isMatch = null;
    // 测试后门
    if (password === this.envService.get('TEST_SECRET')) {
      isMatch = true;
    } else {
      this.logger.debug(password, user.password);
      isMatch = await comparePassword(password, user.password);
    }
    if (!isMatch) {
      loginInfo.status = ELoginStatus.failure;
      loginInfo.desc = ELoginDesc.accountPasswordError;
      await this.loginRepoService.save(loginInfo);
      // 1、连续登录失败5次，锁定账号1小时,锁定提示：账号密码错误已达5次，请1小时候重试，联系我们手动处理；
      // 2、登录成功，清除前面登录失败的次数；
      const count = await this.lockService.redis.incr(errorKey);
      if (count >= 5) {
        await this.lockService.redis.del(errorKey);
        // 修改密码会删掉这个lockKey
        await this.lockService.redis.set(lockKey, 1, 'EX', 60 * 60);
        await this.lockService.incrWithExpire(ipErrorKey);
        throw new BadRequestException('A0821');
      } else {
        await this.lockService.incrWithExpire(ipErrorKey);
        throw new BadRequestException('A0802');
      }
    }
    const result = await this.loginPostCond(user, loginInfo, terminal);
    await this.lockService.redis.del(errorKey);
    return result;
  }

  async loginByPhone(
    data: LoginByPhoneReqBo,
    terminal: ELoginTerminal,
  ): Promise<LoginResBo> {
    const { phone, code, type } = data;
    // 手机号是否存在;
    const user = await this.userFacadeService.findByPhone(type, phone);
    if (!user) {
      throw new BadRequestException('A0803');
    }
    const cacheCode = await this.lockService.redis.get(
      verifyCodeUseKey(`${type}:${phone}:${EVerifyCodeType.login}`),
    );
    if (!cacheCode) {
      throw new BadRequestException('A0820');
    }
    if (cacheCode !== code) {
      throw new BadRequestException('A0806');
    }
    // 登录日志
    const loginAt = new Date();
    const loginInfo = {
      uid: user.id,
      ip: getContext('ip'),
      webSite: ELoginWebSite.nodeZero,
      terminal,
      way: ELoginWay.message,
      status: ELoginStatus.success,
      desc: ELoginDesc.success,
      loginAt,
      system: ESystem.admin,
    };
    const result = await this.loginPostCond(user, loginInfo, terminal);
    return result;
  }

  async loginPreCond(account: string, type: EUserType): Promise<UserBo> {
    let user = <UserBo>{};
    // 后台account登录
    if ([EUserType.admin, EUserType.superAdmin].includes(type)) {
      user = await this.userFacadeService.findByAccount(type, account);
      return user;
    }
  }

  async loginPostCond(
    user: UserBo,
    loginInfo: LoginLogBo,
    terminal: ELoginTerminal,
  ): Promise<LoginResBo> {
    if (user.status !== EStatus.enable) {
      loginInfo.status = ELoginStatus.failure;
      loginInfo.desc = ELoginDesc.accountDisable;
      await this.loginRepoService.save(loginInfo);
      throw new BadRequestException('A0800');
    } else {
      await this.loginRepoService.save(loginInfo);
    }
    // 更新用户最后一次登时间
    await this.userFacadeService.updateById(user.id, {
      loginAt: loginInfo.loginAt,
    });

    // 生成 token
    const token = await this.authService.genToken({
      id: user.id,
      type: user.type,
      terminal,
    });
    return Object.assign(
      {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        accessTokenExpiresIn: token.accessTokenExpiresIn,
      },
      user,
    );
  }
}
