import { Injectable } from '@nestjs/common';
import { BaseService, LoggerDebug } from 'src/common';
import { CrfBo, StudyBo } from '../bo/clean-crf-task.bo';
import { EdcAbstractRepositoryService } from '../repository/edc.abstract';
import { TableAbstractRepositoryService } from '../repository/table.abstract';
import { BASE_FIELDS, BASE_INDEXS } from '../constant/base-fields-constant';
import { EFieldType, Field, Index, TableTemplate } from './table-template';
import {
  TESTITEM_FIELDS,
  TESTITEM_INDEXS,
} from '../constant/testitem-fields-constant';
import {
  VTESTITEM_FIELDS,
  VTESTITEM_INDEXS,
} from '../constant/vtestitem-fields-constant';
import { EEdcFieldType } from '../enum/clean-crf-task.enum';

@Injectable()
export class CleanCrfTaskService extends BaseService {
  constructor(
    private readonly edcRepositoryService: EdcAbstractRepositoryService,
    private readonly tableRepositoryService: TableAbstractRepositoryService,
  ) {
    super(CleanCrfTaskService.name);
  }

  /**
   * @description: 开始批任务 增量扫 CRF 表分发批任务
   * @param {StudyBo} study
   * @return {*}
   * @author: archer zheng
   */
  @LoggerDebug()
  async start(study: StudyBo): Promise<void> {
    const { studyid } = study;
    const crfs = await this.edcRepositoryService.getCrfs(studyid);
    await this.mqService.addBulk(
      {
        queue: 'cleanCrfTask',
        topic: 'cleanCrfTask',
        tag: 'createTabel',
      },
      crfs,
      { delay: 1000 },
    );
    return;
  }

  /**
   * @description: 1、mongo 基础数据不需要生成表 2、mysql 动态生成三张明细表
   * @param {CrfBo} crf
   * @return {*}
   * @author: archer zheng
   */
  @LoggerDebug()
  async createTabel(crf: CrfBo): Promise<void> {
    const { version, env, studyid, crfid } = crf;
    // 创建 env_version_vtestitem
    const vtestItemTemplate = new TableTemplate({
      dbName: studyid,
      tableName: this.tableName(env, version, 'vtestitem'),
      indexs: this.vtestitemIndexs(),
      fields: this.vtestitemFields(),
    });
    await this.tableRepositoryService.createdTable(
      vtestItemTemplate.configToSQL(),
    );

    // 创建 env_version_testitem
    const testitemTemplate = new TableTemplate({
      dbName: studyid,
      tableName: this.tableName(env, version, 'testitem'),
      indexs: this.testitemIndexs(),
      fields: this.testitemFields(),
    });
    await this.tableRepositoryService.createdTable(
      testitemTemplate.configToSQL(),
    );

    // 创建 env_version_base
    const baseTemplate = new TableTemplate({
      dbName: studyid,
      tableName: this.tableName(env, version, 'base'),
      indexs: this.baseIndexs(),
      fields: await this.baseFields(crfid),
    });
    await this.tableRepositoryService.createdTable(baseTemplate.configToSQL());

    return;
  }

  private tableName(env: string, version: string, name: string) {
    return `${env}_${version.replace(/\./g, '_')}_${name}`;
  }

  private vtestitemIndexs(): Index[] {
    return VTESTITEM_INDEXS;
  }

  private vtestitemFields(): Field[] {
    return VTESTITEM_FIELDS;
  }

  private testitemIndexs(): Index[] {
    return TESTITEM_INDEXS;
  }

  private testitemFields(): Field[] {
    return TESTITEM_FIELDS;
  }

  private baseIndexs(): Index[] {
    return BASE_INDEXS;
  }

  @LoggerDebug()
  private async baseFields(crfid: string): Promise<Field[]> {
    const result: Field[] = [];
    // 数据源获取 crf 下所有字段以下信息 formCode sdtmCode type formName fieldName
    const crfFields = await this.edcRepositoryService.getCrfFields(crfid);
    // 根据上面获取到的信息生成 固定字段
    const ffField = crfFields.map((e) => {
      return {
        name: `${e.formCode}_${e.sdtmCode}`,
        comment: `${e.formName}${e.fieldName}`,
        type: this.fieldTypeToValueType(e.type),
        default: null,
      };
    });
    this.logger.debug(ffField);

    // 规则字段
    const baseFields = BASE_FIELDS;
    const baseFieldsObj = this._.keyBy(baseFields, 'name');
    ffField.forEach((e) => {
      // 需求固定字段和自动生成的固定字段有可能重复 以需求为主 覆盖一下即可
      if (!baseFieldsObj[e.name]) {
        result.push(e);
      }
    });
    return baseFields.concat(result);
  }

  private fieldTypeToValueType(type: EEdcFieldType): EFieldType {
    if (type === EEdcFieldType.DateInput) {
      return EFieldType.timestamp;
    }
    if (type === EEdcFieldType.NumberInput) {
      return EFieldType.number;
    }
    return EFieldType.string;
  }
}
