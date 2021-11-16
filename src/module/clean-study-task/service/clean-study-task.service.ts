import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common';
import { StudyBo } from '../bo/clean-study-task.bo';
import { EStatus } from '../enum/clean-study-task.enum';
import { CreateDbAbstractRepositoryService } from '../repository/create-db.abstract';
import { DbAbstractRepositoryService } from '../repository/db.abstract';
import { EdcAbstractRepositoryService } from '../repository/edc.abstract';

@Injectable()
export class CleanStudyTaskService extends BaseService {
  constructor(
    private readonly edcRepositoryService: EdcAbstractRepositoryService,
    private readonly createDbRepositoryService: CreateDbAbstractRepositoryService,
    private readonly dbRepositoryService: DbAbstractRepositoryService,
  ) {
    super(CleanStudyTaskService.name);
  }

  /**
   * @description:开始执行批任务 全量扫 study 表分发任务
   * @param {*}
   * @return {*}
   * @author: archer zheng
   */
  async start(): Promise<void> {
    const studys = await this.edcRepositoryService.getStudys();
    await this.mqService.addBulk(
      {
        queue: 'cleanStudyTask',
        topic: 'cleanStudyTask',
        tag: 'createDb',
      },
      studys,
      { delay: 1000 },
    );
  }

  /**
   * @description: 开始执行任务
   * @param {StudyBo} study
   * @return {*}
   * @author: archer zheng
   */
  async createDb(study: StudyBo): Promise<void> {
    this.logger.log('createDb', study);
    const { status, studyid } = study;
    let trigger = true;
    // 获取数据库生成信息
    const createInfo = await this.createDbRepositoryService.findOne(studyid);

    // 如果没有生成过数据库 且 项目启用 生成数据库即可
    if (!createInfo && status === EStatus.enable) {
      // 创建数据库
      const dbInfo = await this.dbRepositoryService.createdDb(study);
      // 保存数据库生成信息
      await this.createDbRepositoryService.save({
        status,
        studyid,
        user: dbInfo.user,
        password: dbInfo.password,
      });
    }
    // 如果已经生成过数据库 且启用中 且项目禁用
    if (createInfo?.status === EStatus.enable && status === EStatus.disable) {
      // 禁用用户权限
      await this.dbRepositoryService.lock({
        studyid,
        user: createInfo.user,
      });
      // 更新数据库生成信息
      await this.createDbRepositoryService.updateStatus(createInfo._id, status);
      trigger = false;
    }
    // 如果已经生成过数据库 且禁用中 且项目启用
    if (createInfo?.status === EStatus.disable && status === EStatus.enable) {
      // 启用用户权限
      await this.dbRepositoryService.unlock({
        studyid,
        user: createInfo.user,
      });
      // 更新数据库生成信息
      await this.createDbRepositoryService.updateStatus(createInfo._id, status);
    }

    if (trigger) {
      await this.mqService.add(
        {
          queue: 'cleanCrfTask',
          topic: 'cleanCrfTask',
          tag: 'start',
        },
        study,
        { delay: 1000 },
      );
    }
    return;
  }
}
