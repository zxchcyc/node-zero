import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { BaseService, LoggerDebug } from 'src/common';
import { Connection } from 'typeorm';
import { DbBo, StudyBo } from '../bo/clean-study-task.bo';
import { DbTemplate } from './db-template';
import { DbAbstractRepositoryService } from './db.abstract';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DbRepositoryService
  extends BaseService
  implements DbAbstractRepositoryService
{
  constructor(
    @InjectConnection('mysql')
    private connection: Connection,
  ) {
    super(DbRepositoryService.name);
  }

  @LoggerDebug()
  async lock(db: DbBo) {
    const { user } = db;
    const template = new DbTemplate();
    await this.connection.query(template.lockUser(user));
    return;
  }

  @LoggerDebug()
  async unlock(db: DbBo) {
    const { user } = db;
    const template = new DbTemplate();
    await this.connection.query(template.unlockUser(user));
    return;
  }

  @LoggerDebug()
  async createdDb(study: StudyBo): Promise<DbBo> {
    const { studyid } = study;
    const user = studyid;
    const password = uuidv4();
    const template = new DbTemplate();
    // TODO 是否需要事务
    await this.connection.query(template.getCreateDbSql(studyid));
    await this.connection.query(
      template.getAddUserSql(studyid, user, password),
    );
    await this.connection.query(template.flushSql());
    return {
      user,
      password,
    };
  }
}
