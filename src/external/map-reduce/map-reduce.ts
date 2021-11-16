/*
 * @Author: archer zheng
 * @Date: 2021-10-08 13:19:01
 * @LastEditTime: 2021-11-08 14:34:49
 * @LastEditors: archer zheng
 * @Description: MapReduce 三种实现：单机 多进程 多线程
 * @FilePath: /node-zero/src/internal/map-reduce/map-reduce.ts
 */
import { Worker, isMainThread } from 'worker_threads';
import { cpus } from 'os';
import { resolve } from 'path';

export enum EMapReduceType {
  'simple' = 'simple',
  'cluster' = 'cluster',
  'workerThreads' = 'workerThreads',
}
type OptionsType = {
  cores?: number;
  filename?: string;
};

export class MapReduce {
  private cores: number;
  private filename: string;
  constructor(options?: OptionsType) {
    options = Object.assign(
      {
        cores: cpus().length,
        filename: resolve(__dirname, 'map-reduce-worker.js'),
      },
      options,
    );
    this.cores = options.cores;
    this.filename = options.filename;
  }
  /**
   * MapReduce function (single thread version), based on Google works
   *
   * @param {array} pieces : information fragments to be processed
   *
   * @param {function} map : map function, which must take an input key-value
   * pair and produce a set of intermediate key-value pairs.
   *
   * @param {function} reduce : reduce function, which must accept an intermediate
   * key and a set of values for that key. It merges together these values to
   * form a possibly smaller set of values.
   */
  async simple(
    pieces: any[],
    map: (key: any, value: any) => any,
    reduce: (key: any, values: any) => any,
  ) {
    return new Promise((resolve, reject) => {
      try {
        let intermediate = [];
        let groups = null;
        pieces.forEach((e) => {
          const key = e[0];
          const value = e[1];
          intermediate = intermediate.concat(map(key, value));
        });
        intermediate.sort();
        groups = intermediate.reduce((res, cur) => {
          const group = res[cur[0]] || [];
          group.push(cur[1]);
          res[cur[0]] = group;
          return res;
        }, {});
        for (const k in groups) {
          groups[k] = reduce(k, groups[k]);
        }
        resolve(groups);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * MapReduce function (multi-core version), based on Google works
   *
   * @param {array} pieces : information fragments to be processed
   *
   * @param {function} map : map function, which must take an input key-value
   * pair and produce a set of intermediate key-value pairs.
   *
   * @param {function} reduce : reduce function, which must accept an intermediate
   * key and a set of values for that key. It merges together these values to
   * form a possibly smaller set of values.
   */
  async workerThreads(
    pieces: any[],
    map: (key: any, value: any) => any,
    reduce: (key: any, values: any) => any,
  ) {
    return new Promise((resolve, reject) => {
      try {
        if (isMainThread) {
          let groups = null;
          let finished = 0;
          let fullIntermediate = [];
          // Master process
          for (let i = 0; i < this.cores; i++) {
            const worker = new Worker(this.filename, {
              workerData: {
                data: pieces,
                cores: this.cores,
                funcMap: map.toString(),
              },
            });
            worker.on('message', (msg) => {
              if (msg.about == 'mapfinish') {
                fullIntermediate = fullIntermediate.concat(msg.intermediate);
              }
            });
            worker.on('exit', () => {
              finished++;
              if (finished === this.cores) {
                fullIntermediate.sort();
                groups = fullIntermediate.reduce((res, cur) => {
                  const group = res[cur[0]] || [];
                  group.push(cur[1]);
                  res[cur[0]] = group;
                  return res;
                }, {});
                for (const k in groups) {
                  groups[k] = reduce(k, groups[k]);
                }
                resolve(groups);
              }
            });
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
