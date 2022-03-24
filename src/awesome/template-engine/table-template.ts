import * as _ from 'lodash';
import * as moment from 'moment';
import charLength from './char-length';
import preventAttacks from './prevent-attacks';

export enum EFieldType {
  'timestamp' = 'timestamp',
  'number' = 'number',
  'boolean' = 'boolean',
  'string' = 'string',
  'text' = 'text',
}

export type Field = {
  name: string;
  type: EFieldType;
  comment: string;
  default: any;
  require?: boolean;
  code?: string;
  level?: number;
  charMaxLength?: number;
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
  // `$subjid` double(16, 4) NULL DEFAULT NULL COMMENT '数字类型',
  // `$subjid` tinyint(1) NULL DEFAULT NULL COMMENT '布尔类型',
  // JS 类型转换成 SQL 类型
  private jsTypeToSqlType(type: EFieldType) {
    const map = {
      [EFieldType.timestamp]: 'datetime',
      [EFieldType.number]: 'double(16, 4)',
      [EFieldType.boolean]: 'tinyint(1)',
      [EFieldType.string]: 'varchar(255)',
      [EFieldType.text]: 'text',
    };
    return map[type];
  }

  static sqlTypeToJsype(type: string) {
    const map = {
      datetime: EFieldType.timestamp,
      double: EFieldType.number,
      tinyint: EFieldType.boolean,
      varchar: EFieldType.string,
      text: EFieldType.string,
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

  // 唯一索引
  // `subjid_index` (`subjid`,`app_id`) USING BTREE COMMENT 'subjid索引'
  // `${name}` (${key[0]},${key[1]}) USING BTREE COMMENT '${comment}'`
  private indexSql() {
    return (
      this.indexs
        ?.map((index) => {
          return ` ,UNIQUE KEY ${index.name} (${index.keys.join(
            ',',
          )}) USING BTREE COMMENT '${index.comment}'`;
        })
        ?.join('') || ''
    );
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
  upsertSql(data: Record<string, unknown>): string | null {
    // 先验证 data 规则引擎 基础定位数据洗出来的
    const fieldsObj = _.keyBy(this.fields, (o) => {
      return o.name;
    });
    const filterData = Object.entries(data).filter(
      ([key, value]) =>
        (value !== undefined && fieldsObj[key]) ||
        (key === 'id' &&
          value &&
          typeof value === 'number' &&
          parseInt(String(value)) === value),
    );

    // console.log('===this.fields===', this.fields);
    // console.log('===filterData===', filterData);

    // eslint-disable-next-line prefer-const
    for (let [key, value] of filterData.filter(([key]) => key !== 'id')) {
      if (value === null) value = undefined;
      // 字段名验证
      if (!fieldsObj[key]) {
        // console.debug('字段名验证不通过', key, value);
        return null;
      }
      // 跳过 undefined 字段
      if (value === undefined) {
        continue;
      }
      // 字段类型验证
      if (
        [EFieldType.timestamp].includes(fieldsObj[key].type) &&
        !moment(value).isValid()
      ) {
        // console.debug('时间类型字段名验证不通过', key, value);
        return null;
      }
      if (
        ![EFieldType.timestamp].includes(fieldsObj[key].type) &&
        fieldsObj[key].type !== typeof value
      ) {
        // console.debug(
        //   '非时间类型字段名验证不通过',
        //   key,
        //   value,
        //   fieldsObj[key].type,
        //   typeof value,
        // );
        return null;
      }

      // 字段长度校验
      if ([EFieldType.string].includes(fieldsObj[key].type)) {
        // console.log(
        //   'fieldsObj[key].charMaxLength ',
        //   value,
        //   chatLength(String(value)),
        //   fieldsObj[key],
        // );
        if (fieldsObj[key].charMaxLength < charLength(String(value))) {
          // console.debug(
          //   '字段长度校验不通过',
          //   key,
          //   value,
          //   fieldsObj[key].type,
          //   typeof value,
          // );
          value = undefined;
          // return null;
        }

        // 字符串防止 SQL 注入 （必要性 这里不是业务系统 ）
        if (preventAttacks(String(value))) {
          value = undefined;
        }
      }
    }

    // 后拼接
    let keyString = '';
    let valueString = '';
    let first = true;
    for (const [key, value] of filterData) {
      const v = typeof value === 'string' ? `'${value}'` : `${value}`;
      keyString += first ? `${key}` : `,${key}`;
      valueString += first ? `${v}` : `,${v}`;
      first = false;
    }
    return `REPLACE INTO ${this.dbName}.${this.tableName} (${keyString}) VALUES(${valueString})`;
  }

  // 获取表结构
  // Field[]
  static defaultStructure(dbName: string, tableName: string): string {
    return `SELECT
        COLUMN_NAME AS 'name',
        COLUMN_DEFAULT AS 'default',
        IS_NULLABLE AS 'require',
        DATA_TYPE AS 'type',
        COLUMN_COMMENT AS 'comment',
        CHARACTER_MAXIMUM_LENGTH AS 'charMaxLength'
    FROM
        information_schema.COLUMNS
    WHERE
        TABLE_SCHEMA = '${dbName}'
        AND
        TABLE_NAME = '${tableName}'
    ORDER BY
        TABLE_NAME,
        ORDINAL_POSITION;`;
  }

  // 获取表数据
  static selectSql(
    dbName: string,
    tableName: string,
    where: string,
    select: string[],
  ): string {
    return `SELECT
        ${select.join(',')}
    FROM
        ${dbName}.${tableName}
    WHERE
        ${where}
    `;
  }
}
