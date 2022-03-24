/*
 * @Author: archer zheng
 * @Date: 2021-10-08 13:19:01
 * @LastEditTime: 2021-12-17 17:48:56
 * @LastEditors: archer zheng
 * @Description: MapReduce workerThreads worker
 */
import { parentPort, threadId, workerData } from 'worker_threads';
// Child process
const { data, cores, funcMap } = workerData;
const map = eval(funcMap);
const position = threadId % cores;
let piecesProcessed = 0;
let workPiece = data[position - 1];
let workIntermediate = [];
while (workPiece) {
  // Map
  const key = workPiece[0];
  const value = workPiece[1];
  workIntermediate = workIntermediate.concat(map(key, value));
  // 多个工作线程对多个任务进行分配
  piecesProcessed++;
  workPiece = data[position - 1 + piecesProcessed * cores];
}
parentPort.postMessage({
  from: threadId,
  about: 'mapfinish',
  intermediate: workIntermediate,
});
