export enum EFieldType {
  'timestamp' = 'timestamp',
  'number' = 'number',
  'boolean' = 'boolean',
  'string' = 'string',
}

export type Field = {
  name: string;
  type: EFieldType;
  comment: string;
  default: any;
};

export type Index = {
  keys: string[];
  comment?: string;
  name?: string;
};

type Options = {
  // 表字段配置
  // fields 来源：1 CRF 结构 2 数据库表结构(已知的写死)
  fields?: Field[];
  // 索引
  indexs?: Index[];
  // 表名
  tableName: string;
  // 库名
  dbName: string;
  // 数据库类型
  dbType?: string;
};

export class TableTemplate {
  private readonly fields: Field[];
  private readonly indexs: Index[];
  private readonly tableName: string;
  private readonly dbName: string;
  private readonly dbType: string;

  constructor(options: Options) {
    options = Object.assign(
      {
        dbType: 'mysql',
      },
      options,
    );
    this.fields = options.fields;
    this.indexs = options.indexs;
    this.dbType = options.dbType;
    this.dbName = options.dbName;
    this.tableName = options.tableName;
  }

  // `$createdAt` timestamp NULL DEFAULT NULL COMMENT '时间类型',
  // `$subjid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '字符串类型',
  // `$subjid` double(16, 0) NULL DEFAULT NULL COMMENT '数字类型',
  // `$subjid` tinyint(1) NULL DEFAULT NULL COMMENT '布尔类型',
  // JS 类型转换成 SQL 类型
  private jsTypeToSqlType(type: EFieldType) {
    const map = {
      [EFieldType.timestamp]: 'timestamp',
      [EFieldType.number]: 'double(16, 0)',
      [EFieldType.boolean]: 'tinyint(1)',
      [EFieldType.string]: 'varchar(255)',
    };
    return map[type];
  }

  // 字段
  // `${name} ${type} NULL DEFAULT ${default} COMMENT '${comment}'`,
  private fieldSql() {
    return (
      this.fields
        .map((field) => {
          let defaultFlag = '';
          if (field.default) {
            defaultFlag = `DEFAULT ${field.default}`;
          }
          return ` ${field.name} ${this.jsTypeToSqlType(
            field.type,
          )} NULL ${defaultFlag} COMMENT '${field.comment}'`;
        })
        .join(',') + ','
    );
  }

  // 索引
  // `subjid_index` (`subjid`,`app_id`) USING BTREE COMMENT 'subjid索引'
  // `${name}` (${key[0]},${key[1]}) USING BTREE COMMENT '${comment}'`
  private indexSql() {
    return this.indexs
      .map((index) => {
        return ` ,KEY ${index.name} (${index.keys.join(
          ',',
        )}) USING BTREE COMMENT '${index.comment}'`;
      })
      .join('');
  }

  // 获取建表语句
  configToSQL() {
    const dropSql = ` DROP TABLE IF EXISTS ${this.dbName}.${this.tableName};`;
    const createSqlInit = ` CREATE TABLE ${this.dbName}.${this.tableName} (id int(16) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',$updatedAt timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',$createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',`;
    const createSqlPrimaryKey = ` PRIMARY KEY (id)`;
    const creteSqlEnd = ` )ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;`;
    const fieldSql = this.fieldSql();
    const indexSql = this.indexSql();
    const createSql =
      createSqlInit + fieldSql + createSqlPrimaryKey + indexSql + creteSqlEnd;
    return { dropSql, createSql };
  }

  // 校验记录值
  validateValue(value: Record<string, unknown>): boolean {
    console.log(value);
    return;
  }

  // 获取记录值默认值
  defaultValue(): Record<string, unknown> {
    return;
  }
}
