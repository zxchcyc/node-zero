import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { BaseService, LoggerDebug } from 'src/common';
import { CrfBo, CrfFieldBo } from '../bo/clean-crf-task.bo';
import { EdcAbstractRepositoryService } from './edc.abstract';

@Injectable()
export class EdcRepositoryService
  extends BaseService
  implements EdcAbstractRepositoryService
{
  constructor(@InjectConnection('mongo-edc') private connection: Connection) {
    super(EdcRepositoryService.name);
  }

  @LoggerDebug()
  async getCrfs(studyid: string): Promise<CrfBo[]> {
    const filter = {
      studyid: new Types.ObjectId(studyid),
      env: { $ne: 'DRAFT' },
    };
    const options = {
      projection: { status: 1, env: 1, version: 1, studyid: 1 },
      limit: 2,
    };
    const crfs = await this.connection.db
      .collection('Crf')
      .find(filter, options)
      .toArray();
    return crfs.map((e) => {
      return {
        crfid: e._id.toString(),
        studyid: e.studyid.toString(),
        status: e.status,
        env: e.env,
        version: e.version,
      };
    });
  }

  @LoggerDebug()
  async getCrfFields(crfid: string): Promise<CrfFieldBo[]> {
    const filter = {
      crfid: new Types.ObjectId(crfid),
    };
    const options = {
      projection: {
        fieldid: 1,
        formName: 1,
        fieldName: 1,
        sdtmCode: 1,
        formCode: 1,
      },
    };
    const fieldLocations = await this.connection.db
      .collection('FieldLocation')
      .find(filter, options)
      .toArray();

    this.logger.debug(fieldLocations);
    if (!fieldLocations?.length) {
      return [];
    }

    const fieldids = fieldLocations.map((e) => e.fieldid);
    const ffFilter = {
      _id: { $in: fieldids },
    };
    const ffOptions = {
      projection: {
        type: 1,
      },
    };
    const formFields = await this.connection.db
      .collection('FormField')
      .find(ffFilter, ffOptions)
      .toArray();
    if (!formFields?.length) {
      return [];
    }
    const formFieldsObj = this._.keyBy(formFields, '_id');
    return fieldLocations.map((e) => {
      return {
        formCode: e.formCode,
        sdtmCode: e.sdtmCode,
        type: formFieldsObj[e.fieldid.toString()].type,
        formName: e.formCode,
        fieldName: e.fieldName,
      };
    });
  }
}
