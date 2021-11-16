import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EStatus } from '../enum/clean-study-task.enum';

@Schema({
  collection: 'CreateDb',
  timestamps: true,
})
export class CreateDbSchema {
  @Prop({})
  createdAt: Date;

  @Prop({})
  updatedAt: Date;

  @Prop({})
  studyid: string;

  @Prop({ default: EStatus.enable })
  status: EStatus;

  @Prop({})
  user: string;

  @Prop({})
  password: string;
}

export const createDbSchema = SchemaFactory.createForClass(CreateDbSchema);
