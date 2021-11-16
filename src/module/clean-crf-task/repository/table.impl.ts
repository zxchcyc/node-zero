import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { BaseService } from 'src/common';
import { Connection } from 'typeorm';
import { TableAbstractRepositoryService } from './table.abstract';

@Injectable()
export class TableRepositoryService
  extends BaseService
  implements TableAbstractRepositoryService
{
  constructor(
    @InjectConnection('mysql')
    private connection: Connection,
  ) {
    super(TableRepositoryService.name);
  }

  async createdTable(sql: {
    dropSql: string;
    createSql: string;
  }): Promise<void> {
    await this.connection.query(sql.dropSql);
    await this.connection.query(sql.createSql);
    return;
  }
}
