import { FlowEngine, EDirection, ITrace } from './flow-engine';
import { configs } from './flow-config';
import { EFlowNode, EFlowAction } from '../enum/flow-config.enum';

const traces = [];
let nextAction = [];
let preAction = [];
let runRet: {
  cur: string;
  curName: string;
  traces: ITrace[];
};

const flow = new FlowEngine(configs, EFlowNode.noEntry, traces);

describe('FlowEngine', () => {
  test('FlowEngine 实例化', () => {
    nextAction = flow.nextAction();
    preAction = flow.preAction();
    expect(nextAction.sort()).toEqual(
      [
        EFlowAction.savingBlank,
        EFlowAction.deactivated,
        EFlowAction.save,
        EFlowAction.commit,
      ].sort(),
    );
    expect(preAction).toEqual([]);

    runRet = flow.run(EFlowAction.savingBlank, EDirection.next);
    expect(runRet.cur).toEqual(EFlowNode.savingBlank);

    nextAction = flow.nextAction();
    preAction = flow.preAction();
    expect(nextAction).toEqual([EFlowAction.recapture]);
    expect(preAction).toEqual([]);

    runRet = flow.run(EFlowAction.recapture, EDirection.next);
    expect(runRet.cur).toEqual(EFlowNode.entering);

    nextAction = flow.nextAction();
    preAction = flow.preAction();
    expect(nextAction.sort()).toEqual(
      [
        EFlowAction.savingBlank,
        EFlowAction.deactivated,
        EFlowAction.commit,
      ].sort(),
    );
    expect(preAction).toEqual([]);

    runRet = flow.run(EFlowAction.commit, EDirection.next);
    expect(runRet.cur).toEqual(EFlowNode.done);

    nextAction = flow.nextAction();
    preAction = flow.preAction();
    expect(nextAction.sort()).toEqual(
      [EFlowAction.sdv, EFlowAction.review, EFlowAction.medicalReview].sort(),
    );
    expect(preAction).toEqual([]);

    runRet = flow.run(EFlowAction.sdv, EDirection.next);
    expect(runRet.cur).toEqual(EFlowNode.done);

    nextAction = flow.nextAction();
    preAction = flow.preAction();
    expect(nextAction.sort()).toEqual(
      [EFlowAction.review, EFlowAction.medicalReview].sort(),
    );
    expect(preAction).toEqual([EFlowAction.sdv]);

    runRet = flow.run(EFlowAction.review, EDirection.next);
    expect(runRet.cur).toEqual(EFlowNode.done);

    nextAction = flow.nextAction();
    preAction = flow.preAction();
    expect(nextAction.sort()).toEqual([EFlowAction.medicalReview].sort());
    expect(preAction.sort()).toEqual(
      [EFlowAction.review, EFlowAction.sdv].sort(),
    );

    runRet = flow.run(EFlowAction.sdv, EDirection.pre);
    expect(runRet.cur).toEqual(EFlowNode.done);

    nextAction = flow.nextAction();
    preAction = flow.preAction();
    expect(nextAction.sort()).toEqual(
      [EFlowAction.sdv, EFlowAction.medicalReview].sort(),
    );
    expect(preAction.sort()).toEqual([EFlowAction.review].sort());

    runRet = flow.run(EFlowAction.review, EDirection.pre);
    expect(runRet.cur).toEqual(EFlowNode.done);

    nextAction = flow.nextAction();
    preAction = flow.preAction();
    expect(nextAction.sort()).toEqual(
      [EFlowAction.review, EFlowAction.sdv, EFlowAction.medicalReview].sort(),
    );
    expect(preAction.sort()).toEqual([].sort());

    runRet = flow.run(EFlowAction.sdv, EDirection.next);
    expect(runRet.cur).toEqual(EFlowNode.done);

    runRet = flow.run(EFlowAction.review, EDirection.next);
    expect(runRet.cur).toEqual(EFlowNode.done);

    runRet = flow.run(EFlowAction.medicalReview, EDirection.next);
    expect(runRet.cur).toEqual(EFlowNode.verified);

    nextAction = flow.nextAction();
    preAction = flow.preAction();
    expect(nextAction.sort()).toEqual([EFlowAction.freeze].sort());
    expect(preAction.sort()).toEqual(
      [EFlowAction.sdv, EFlowAction.review, EFlowAction.medicalReview].sort(),
    );

    runRet = flow.run(EFlowAction.medicalReview, EDirection.pre);
    expect(runRet.cur).toEqual(EFlowNode.done);
    nextAction = flow.nextAction();
    preAction = flow.preAction();
    expect(nextAction.sort()).toEqual([EFlowAction.medicalReview].sort());
    expect(preAction.sort()).toEqual(
      [EFlowAction.sdv, EFlowAction.review].sort(),
    );

    runRet = flow.run(EFlowAction.medicalReview, EDirection.next);
    expect(runRet.cur).toEqual(EFlowNode.verified);
    nextAction = flow.nextAction();
    preAction = flow.preAction();
    expect(nextAction.sort()).toEqual([EFlowAction.freeze].sort());
    expect(preAction.sort()).toEqual(
      [EFlowAction.sdv, EFlowAction.review, EFlowAction.medicalReview].sort(),
    );

    runRet = flow.run(EFlowAction.freeze, EDirection.next);
    expect(runRet.cur).toEqual(EFlowNode.freezed);
    nextAction = flow.nextAction();
    preAction = flow.preAction();
    expect(nextAction.sort()).toEqual([EFlowAction.signature].sort());
    expect(preAction.sort()).toEqual([EFlowAction.freeze].sort());

    runRet = flow.run(EFlowAction.signature, EDirection.next);
    expect(runRet.cur).toEqual(EFlowNode.signed);
    nextAction = flow.nextAction();
    preAction = flow.preAction();
    expect(nextAction.sort()).toEqual([EFlowAction.lock].sort());
    expect(preAction.sort()).toEqual([EFlowAction.signature].sort());

    runRet = flow.run(EFlowAction.signature, EDirection.pre);
    expect(runRet.cur).toEqual(EFlowNode.freezed);
    nextAction = flow.nextAction();
    preAction = flow.preAction();
    expect(nextAction.sort()).toEqual([EFlowAction.signature].sort());
    expect(preAction.sort()).toEqual([EFlowAction.freeze].sort());

    runRet = flow.run(EFlowAction.signature, EDirection.next);
    expect(runRet.cur).toEqual(EFlowNode.signed);
    nextAction = flow.nextAction();
    preAction = flow.preAction();
    expect(nextAction.sort()).toEqual([EFlowAction.lock].sort());
    expect(preAction.sort()).toEqual([EFlowAction.signature].sort());

    runRet = flow.run(EFlowAction.lock, EDirection.next);
    expect(runRet.cur).toEqual(EFlowNode.locked);
    nextAction = flow.nextAction();
    preAction = flow.preAction();
    expect(nextAction.sort()).toEqual([].sort());
    expect(preAction.sort()).toEqual([EFlowAction.lock].sort());
  });
});
