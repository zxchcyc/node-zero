import { Injectable } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { BaseService, TaskProcess } from 'src/common';
import { ScheduleAbstractFacadeService } from '../../facade/schedule.abstract';

@Injectable()
export class ScheduleService extends BaseService {
  constructor(
    private readonly scheduleFacadeService: ScheduleAbstractFacadeService,
  ) {
    super(ScheduleService.name);
  }

  // @Timeout(1000)
  @TaskProcess({ lock: true })
  async demo() {
    this.scheduleFacadeService.demo();
  }

  // @Timeout(1000)
  @TaskProcess({ lock: true })
  async start() {
    this.scheduleFacadeService.start();
  }
}
