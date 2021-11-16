/*
 * @Author: archer zheng
 * @Date: 2021-10-12 16:09:41
 * @LastEditTime: 2021-11-16 09:32:33
 * @LastEditors: archer zheng
 * @Description: 生成签名
 * @FilePath: /node-zero/src/common/content-security/content-security-sign.ts
 */
import {
  createHmac,
  createHash,
  publicEncrypt,
  constants,
  generateKeyPairSync,
  KeyObject,
} from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// const HEADERS_FIELD = 'X-Content-Security';

type OptionsType = {
  envs: {
    publicKey: KeyObject;
  };
};

type reqTpye = {
  method: string;
  path: string;
  query: any;
  body: any;
};

export class ContentSecuritySign {
  private publicKey: KeyObject;
  constructor(options: OptionsType) {
    this.publicKey = options.envs.publicKey;
  }

  private hmacSha256Encrypt(content: string, secret: string) {
    return createHmac('sha256', secret).update(content).digest('base64');
  }

  private sha256Encrypt(content: string) {
    return createHash('sha256').update(content).digest('base64');
  }

  private encrypt(content: string) {
    return publicEncrypt(
      {
        key: this.publicKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      // We convert the data string to a buffer using `Buffer.from`
      Buffer.from(content),
    );
  }

  private genFingerprint() {
    return createHash('sha256').update(String(this.publicKey)).digest('base64');
  }

  private base64Encode(key: string) {
    return Buffer.from(key).toString('base64');
  }

  static async generateKeyPair() {
    return generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: 'top secret',
      },
    });
  }

  /**
   * 签名 演示签名生成
   * @param {*} url 相对路径的地址
   * @param {*} query url 参数
   * @param {*} method 请求方式
   * @param {*} data 请求体
   */
  public httpSign(req: reqTpye) {
    const { path, method, query, body } = req;
    // 随机生成秘钥
    const key = uuidv4();
    // 请求体要是string
    const newBody = typeof body === 'string' ? body : JSON.stringify(body);
    const newQuery = typeof query === 'string' ? query : JSON.stringify(query);
    // 拿到当前时间戳
    const timestamp = new Date().getTime();
    // 对请求体做 sha256 加密
    const hexString = this.sha256Encrypt(newBody);
    const signatureData = [
      timestamp.toString(),
      method.toUpperCase(),
      path,
      newQuery,
      hexString,
    ];
    const secretData = [
      'type==0',
      'key==' + this.base64Encode(key),
      'time==' + timestamp,
    ];
    // 使用公钥对 secretData 以;分割的字符串进行 rsa 加密
    const secret = this.encrypt(secretData.join(';'));
    // 对signatureData 以 \n 分割的字符串先hmac在进行 sha256 加密
    const signature = this.hmacSha256Encrypt(signatureData.join('\n'), key);
    // res 就是所得的放在请求头 X-Content-Security 中的签名字符串
    const res =
      'key==' +
      this.genFingerprint() +
      ';secret==' +
      secret.toString('base64') +
      ';signature==' +
      signature;
    // console.log('客户端', res);
    return res;
  }
}
