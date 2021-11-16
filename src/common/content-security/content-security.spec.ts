import { ContentSecurity } from './content-security';
import { ContentSecuritySign } from './content-security-sign';
const path = '/v1/web/test';
const method = 'POST';
const query = { a: 1 };
const body = { a: 1, b: 2 };

describe('ContentSecurity', () => {
  test('ContentSecurity 实例化', async () => {
    const { privateKey, publicKey } = await ContentSecurity.generateKeyPair();
    // console.log(privateKey.toString(), publicKey.toString());
    const req = {
      path,
      method,
      query,
      body,
    };
    const css = new ContentSecuritySign({ envs: { publicKey } });
    const sign = css.httpSign(req);
    // console.log(sign);

    const cs = new ContentSecurity({
      contentSecurity: sign,
      envs: {
        publicKey,
        privateKey,
      },
    });
    const res = cs.verifySignature(cs.parseContentSecurity(), req, 1000);
    expect(res).toEqual(true);
  });
});
