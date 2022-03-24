import { ELoginTerminal, ELoginWebSite, EUserType } from 'src/common';

export interface IJwtPayload {
  id: number;
  terminal: ELoginTerminal;
  type: EUserType;
  website?: ELoginWebSite;
}
