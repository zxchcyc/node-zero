import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';

@Schema({
  collection: 'FlowConfig',
  timestamps: true,
})
export class FlowConfig {
  // 当前节点
  @Prop({ required: true })
  cur: string;
  // 当前节点名称
  @Prop({ required: true })
  curName: string;

  // 前一个节点
  @Prop({ required: false, default: null })
  pre: string;
  // 通往前一个节点支持的动作
  @Prop({ required: false, default: [] })
  preAction: string[];
  // 当前节点通往上一个节点时，处于并发状态中前端显示名称
  @Prop({ required: false, default: null })
  preIngName: string;
  // 当前节点通往前一个节点时，并发动作要求
  @Prop(
    raw({
      // 最少回退动作数
      count: { type: Number, default: null, required: false },
      // 必须回退的动作
      action: { type: Array, default: [], required: false },
    }),
  )
  preRequire: Record<string, number | string[]>;

  // 下一个节点
  @Prop({ required: false, default: null })
  next: string;
  // 通往下一个节点支持的动作
  @Prop({ required: false, default: [] })
  nextAction: string[];
  // 当前节点通往下一个节点时，处于并发状态中前端显示名称
  @Prop({ required: false, default: null })
  nextIngName: string;
  // 当前节点通往下一个节点时，并发动作要求
  @Prop(
    raw({
      // 最少完成动作数
      count: { type: Number, default: null, required: false },
      // 必须完成的动作
      action: { type: Array, default: [], required: false },
    }),
  )
  nextRequire: Record<string, number | string[]>;
}

export const flowConfigSchema = SchemaFactory.createForClass(FlowConfig);
