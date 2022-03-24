/*
 * @Author: archer zheng
 * @Date: 2022-03-23 13:22:36
 * @LastEditTime: 2022-03-23 13:55:21
 * @LastEditors: archer zheng
 * @Description: RocketMQ消费基础类
 * @FilePath: /da-api/src/external/rocketmq/consumer/consumer.ts
 */
import { MQConsumer } from '@aliyunmq/mq-http-sdk';
import { autoBind } from './bind';
import { EventEmitter } from 'events';
import * as Debug from 'debug';
const debug = Debug('rocketmq:consumer');

export interface ConsumerOpt {
  consumerClient: MQConsumer;
  handleMessage(message: MqMessage): Promise<void>;
  pollingWaitTimeMs?: number;
}

interface Events {
  responseProcessed: [];
  empty: [];
  messageReceived: [MqMessage];
  messageProcessed: [MqMessage];
  error: [Error, void | MqMessage | MqMessage[]];
  timeoutError: [Error, MqMessage];
  processingError: [Error, MqMessage];
  warn: [Error, MqMessage];
  stopped: [];
}

interface MqResponseBody {
  code: number;
  requestId: string;
  body: MqMessage[];
}

export interface MqMessage {
  MessageId?: string;
  MessageBody?: string;
  MessageBodyMD5?: string;
  ReceiptHandle?: string;
  PublishTime?: string;
  FirstConsumeTime?: string;
  NextConsumeTime?: string;
  ConsumedTimes?: string;
  Properties?: Record<string, any>;
  MessageKey?: string;
  MessageTag?: string;
}

export interface MessageBody {
  header: header;
  body: any;
}
export interface header {
  requestId: string;
  messageId?: string;
  messageName?: string;
  sourceSystemCode: string;
}

interface TimeoutResponse {
  timeout: NodeJS.Timeout;
  pending: Promise<void>;
}

function createTimeout(duration: number): TimeoutResponse[] {
  let timeout;
  const pending: Promise<void> = new Promise((_, reject) => {
    timeout = setTimeout((): void => {
      reject(new TimeoutError());
    }, duration);
  });
  return [timeout, pending];
}

class TimeoutError extends Error {
  constructor(message = 'Operation timed out.') {
    super(message);
    this.message = message;
    this.name = 'TimeoutError';
  }
}

function hasMessages(response: MqResponseBody) {
  return response.body && response.body.length > 0;
}

export class Consumer extends EventEmitter {
  handleMessage: (message: MqMessage) => Promise<void>;
  private handleMessageTimeout: number;
  private consumerClient: MQConsumer;
  private stopped: boolean;
  private pollingWaitTimeMs: number;

  constructor(options: ConsumerOpt) {
    super();
    this.handleMessage = options.handleMessage;
    this.stopped = true;
    this.consumerClient = options.consumerClient;
    this.pollingWaitTimeMs = options.pollingWaitTimeMs || 0;
    autoBind(this);
  }

  emit<T extends keyof Events>(event: T, ...args: Events[T]) {
    return super.emit(event, ...args);
  }

  on<T extends keyof Events>(
    event: T,
    listener: (...args: Events[T]) => void,
  ): this {
    return super.on(event, listener);
  }

  once<T extends keyof Events>(
    event: T,
    listener: (...args: Events[T]) => void,
  ): this {
    return super.once(event, listener);
  }

  public static create(options: ConsumerOpt): Consumer {
    return new Consumer(options);
  }

  public get isRunning(): boolean {
    return !this.stopped;
  }

  public stop(): void {
    debug('stop consumer');
    this.stopped = true;
  }

  public start() {
    if (this.stopped) {
      debug('start consumer');
      this.stopped = false;
      this.poll();
    }
  }

  private async poll() {
    if (this.stopped) {
      return;
    }
    debug('Polling for rocketmq message');
    const currentPollTimeOut = this.pollingWaitTimeMs;
    this.consumerClient
      .consumeMessage()
      .then(this.handleMqResponse)
      .catch((error) => {
        if (error.Code && error.Code.indexOf('MessageNotExist') > -1) {
          // 没有消息，则继续长轮询服务器
          debug(
            'Consume Message: no new message, RequestId:%s, Code:%s',
            error.RequestId,
            error.Code,
          );
        } else {
          this.emit('error', error);
        }
        return;
      })
      .then(() => {
        setTimeout(this.poll, currentPollTimeOut);
      });
  }

  private async handleMqResponse(response: MqResponseBody): Promise<void> {
    debug('receive rocketmq response', response);
    if (response) {
      if (hasMessages(response)) {
        await Promise.all(response.body.map(this.processMessage));
        this.emit('responseProcessed');
      }
    }
  }

  private async processMessage(message: MqMessage): Promise<void> {
    this.emit('messageReceived', message);
    try {
      await this.executeHandler(message);
      await this.deleteMessage(message);
      debug('consumer successfully', message.MessageId);
      this.emit('messageProcessed', message);
    } catch (error) {
      this.emit('error', error, message);
    }
  }

  private async executeHandler(message: MqMessage): Promise<void> {
    debug('handle message');
    let timeout;
    let pending: any;
    try {
      if (this.handleMessageTimeout) {
        [timeout, pending] = createTimeout(this.handleMessageTimeout);
        await Promise.race([this.handleMessage(message), pending]);
      } else {
        await this.handleMessage(message);
      }
    } catch (error) {
      if (error instanceof TimeoutError) {
        error.message = `Message handler timed out after ${this.handleMessageTimeout}ms: Operation timed out.`;
      } else {
        error.message = `Unexpected message handler failure: ${error.message}`;
      }

      // 如果到达最大重试次数16次,发送警报
      if (Number(message.ConsumedTimes) >= 16) {
        const maxRetryerr = new Error('mq消费重试次数达到上限,将进入死信队列');
        this.emit('warn', maxRetryerr, message);
        return;
      }

      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  private async deleteMessage(message: MqMessage): Promise<void> {
    debug(`deleteing message`, message.MessageId);
    try {
      const res = await this.consumerClient.ackMessage([message.ReceiptHandle]);
      if (res.code != 204) {
        throw new Error(res);
      }
    } catch (error) {
      throw new Error(`MQ delete message failed: ${error.message}`);
    }
  }
}
