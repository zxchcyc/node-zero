type Options = {
  type?: string;
  character?: string;
  collate?: string;
};

export class DbTemplate {
  // 数据库类型
  private readonly type: string;
  // 数据库字符集
  private readonly character: string;
  private readonly collate: string;

  constructor(options?: Options) {
    options = Object.assign(
      {
        type: 'mysql',
        character: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
      },
      options,
    );
    this.type = options.type;
    this.character = options.character;
    this.collate = options.collate;
  }

  // 创建数据库
  getCreateDbSql(studyid: string): string {
    return `CREATE DATABASE IF NOT EXISTS ${studyid} CHARACTER SET ${this.character} COLLATE ${this.collate};`;
  }

  // 新增用户
  getAddUserSql(studyid: string, user: string, password: string): string {
    return `grant select on ${studyid}.* to ${user}@'%' identified by '${password}' WITH GRANT OPTION;`;
    // return `grant all on ${studyid}.* to ${user}@'%' identified by '${password}' WITH GRANT OPTION;`;
  }

  flushSql(): string {
    return `FLUSH PRIVILEGES;`;
  }

  // 修改用户权限
  lockUser(user: string): string {
    return `ALTER USER ${user} ACCOUNT LOCK;`;
  }

  // 修改用户权限
  unlockUser(user: string): string {
    return `ALTER USER ${user} ACCOUNT UNLOCK;`;
  }
}
