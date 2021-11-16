export abstract class TableAbstractRepositoryService {
  abstract createdTable(sql: {
    dropSql: string;
    createSql: string;
  }): Promise<void>;
}
