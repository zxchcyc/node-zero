import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { BaseService } from 'src/common';
import { StudyBo } from '../bo/clean-study-task.bo';
import { EdcAbstractRepositoryService } from './edc.abstract';

@Injectable()
export class EdcRepositoryService
  extends BaseService
  implements EdcAbstractRepositoryService
{
  constructor(@InjectConnection('mongo-edc') private connection: Connection) {
    super(EdcRepositoryService.name);
  }

  async getStudys(): Promise<StudyBo[]> {
    const filter = {};
    const options = {
      projection: { status: 1 },
      limit: 1,
    };
    const studys = await this.connection.db
      .collection('Study')
      .find(filter, options)
      .toArray();
    return studys.map((e) => {
      return {
        // studyid: e._id.toString(),
        // TODO 测试项目
        // studyid: '617900dc6a8d21174114ad14',
        studyid: '61921ab788cefd572d33cbe6',
        status: e.status,
      };
    });
  }
}
