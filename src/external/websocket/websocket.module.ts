/*
 * @Author: archer zheng
 * @Date: 2020-09-01 10:05:27
 * @LastEditTime: 2022-03-24 14:20:23
 * @LastEditors: archer zheng
 * @Description: websocket client 服务模块
 * @FilePath: /node-zero/src/external/websocket/websocket.module.ts
 */
import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';

@Module({
  providers: [WebsocketService],
  exports: [WebsocketService],
})
export class WebsocketModule {}
