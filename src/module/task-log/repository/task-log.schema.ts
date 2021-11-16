import { EStatus } from '../enum/task-log.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'TaskLog',
  timestamps: true,
})
export class TaskLogSchema {
  @Prop({})
  createdAt: Date;

  @Prop({})
  updatedAt: Date;

  @Prop({})
  name: string;

  @Prop({})
  separateAt: Date;

  @Prop({ default: EStatus.enable })
  status: EStatus;
}

export const taskLogSchema = SchemaFactory.createForClass(TaskLogSchema);
