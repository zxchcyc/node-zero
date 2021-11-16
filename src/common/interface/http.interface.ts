import { EHttpErrorCode } from '../enum';
interface IBaseHttpResponse {
  errorCode?: string;
  message?: EHttpErrorCode | string;
  traceId?: string;
}
export type THttpErrorResponse = IBaseHttpResponse & {
  error?: any;
  stack?: any;
  result?: Record<string, any>;
};
export type THttpSuccessResponse = IBaseHttpResponse & {
  result?: Record<string, any>;
};
export type THttpResponse = THttpErrorResponse | THttpSuccessResponse;
