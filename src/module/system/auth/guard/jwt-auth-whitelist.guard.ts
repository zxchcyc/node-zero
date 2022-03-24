import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { getContext } from 'src/common';

@Injectable()
export class JwtAuthWhiteListGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const token = getContext('token');
    if (!token) {
      return true;
    }
    return super.canActivate(context);
  }
}
