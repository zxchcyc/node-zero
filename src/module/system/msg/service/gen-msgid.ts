import { EMsgTag } from '../enum/msg.enum';

export function genMsgId(
  uid: number,
  tag: EMsgTag,
  attachedId: string | number,
) {
  return attachedId ? `${tag}_${uid}_${attachedId}` : `${tag}_${uid}`;
}
