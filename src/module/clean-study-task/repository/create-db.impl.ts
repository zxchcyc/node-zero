import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/common';
import { CreateDbBo } from '../bo/clean-study-task.bo';
import { EStatus } from '../enum/clean-study-task.enum';
import { CreateDbAbstractRepositoryService } from './create-db.abstract';
import { CreateDbSchema } from './create-db.schema';

@Injectable()
export class CreateDbRepositoryService
  extends BaseService
  implements CreateDbAbstractRepositoryService
{
  constructor(
    @InjectModel(CreateDbSchema.name)
    private readonly createDbModel: Model<CreateDbSchema>,
  ) {
    super(CreateDbRepositoryService.name);
  }

  async save(createDb: CreateDbBo): Promise<CreateDbBo> {
    return await this.createDbModel.create(createDb);
  }

  async updateStatus(_id: string, status: EStatus) {
    await this.createDbModel.findByIdAndUpdate(_id, { $set: { status } });
    return;
  }

  async findOne(studyid: string): Promise<CreateDbBo> {
    const result = await this.createDbModel.findOne({ studyid }).exec();
    return result;
  }
}
