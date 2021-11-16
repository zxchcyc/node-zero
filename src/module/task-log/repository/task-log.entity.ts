import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EStatus } from '../enum/task-log.enum';

@Entity({ name: 'TaskLog' })
export class TaskLogEntity {
  @ApiProperty({ description: '创建时间', type: Date })
  @IsDateString()
  @IsOptional()
  @CreateDateColumn({})
  createdAt: Date;

  @ApiProperty({ description: '更新时间', type: Date })
  @IsDateString()
  @IsOptional()
  @UpdateDateColumn({})
  updatedAt: Date;

  @ApiProperty({ description: '数据库ID', type: String })
  @PrimaryGeneratedColumn()
  _id: number;

  @ApiProperty({ description: '任务名称', type: String })
  @IsString()
  @Column()
  name: string;

  @ApiProperty({ description: '分割时间', type: Date })
  @IsDateString()
  @Column()
  separateAt: Date;

  @ApiProperty({ description: '状态', enum: [1, 2] })
  @Type(() => Number)
  @IsEnum(EStatus)
  @Column({ default: EStatus.enable })
  status: EStatus;
}
