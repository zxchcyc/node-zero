/**
 * 分页器返回结果接口
 *
 * @export IPaginator
 * @interface IPaginator
 * @template T Model
 */
export interface IPaginator<T> {
  data: T[];
}
