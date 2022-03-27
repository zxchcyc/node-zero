import { ELoginTerminal, ELoginWebSite } from 'src/common';
import { EUserType } from 'src/module/system/user/enum/user.enum';

export interface IJwtPayload {
  id: number;
  terminal: ELoginTerminal;
  type: EUserType;
  website?: ELoginWebSite;
}
