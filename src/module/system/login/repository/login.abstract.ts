import { LoginLogBo } from '../bo/login.bo';

export abstract class LoginAbstractRepoService {
  abstract save(loginLog: LoginLogBo): Promise<void>;
}
