/*
 * @Author: archer zheng
 * @Date: 2021-10-12 16:09:41
 * @LastEditTime: 2021-10-14 09:34:56
 * @LastEditors: archer zheng
 * @Description: 验签 处理过的请求（随机key）是不是要丢掉？
 * @FilePath: /node-zero/src/common/guard/content-security.ts
 */
import {
  createHmac,
  createHash,
  publicEncrypt,
  privateDecrypt,
  constants,
  generateKeyPairSync,
  KeyObject,
} from 'crypto';

// const HEADERS_FIELD = 'X-Content-Security';

// X-Content-Security 拼接字段
const FINGERPRINT_FIELD = 'key';
const SECRET_FIELD = 'secret';
const SIGNATURE_FIELD = 'signature';

// secret 拼接字段
const TPYE_FIELD = 'type';
const KEY_FIELD = 'key';
const TIME_FIELD = 'time';

enum EHttpErrorCode {
  'ErrInvalidHeader' = 'invalid X-Content-Security header',
  'ErrInvalidContentType' = 'invalid content type',
  'ErrInvalidKey' = 'invalid key',
  'ErrInvalidTime' = 'invalid time',
  'ErrInvalidPublicKey' = 'invalid public key',
  'ErrInvalidSecret' = 'invalid secret',
  'ErrInvalidSignature' = 'invalid signature',
}
type OptionsType = {
  contentSecurity: string;
  envs: {
    publicKey: KeyObject;
    privateKey: KeyObject;
  };
};
type SecretType = {
  key: string;
  time: number;
  type: string;
};

type reqTpye = {
  method: string;
  path: string;
  query: any;
  body: any;
};

export class ContentSecurity {
  private publicKey: KeyObject;
  private privateKey: KeyObject;
  private fingerprint: string;
  private secret: Buffer;
  private signature: string;
  constructor(options: OptionsType) {
    const contentSecurity = options.contentSecurity;
    this.publicKey = options.envs.publicKey;
    this.privateKey = options.envs.privateKey;
    const attrs = this.parseHeader(contentSecurity);
    this.fingerprint = attrs[FINGERPRINT_FIELD];
    this.secret = Buffer.from(attrs[SECRET_FIELD], 'base64');
    this.signature = attrs[SIGNATURE_FIELD];
  }

  public parseContentSecurity(): SecretType {
    // console.log('this.fingerprint', this.fingerprint);
    // console.log('this.secret', this.secret);
    // console.log('this.signature', this.signature);
    // ErrInvalidHeader
    if (
      !this.fingerprint.length ||
      !this.secret.length ||
      !this.signature.length
    ) {
      throw Error(EHttpErrorCode.ErrInvalidHeader);
    }

    // ErrInvalidPublicKey
    if (this.genFingerprint() !== this.fingerprint) {
      throw Error(EHttpErrorCode.ErrInvalidPublicKey);
    }

    // ErrInvalidSecret
    const decryptSecret = this.decrypt(this.secret);
    if (!decryptSecret) {
      throw Error(EHttpErrorCode.ErrInvalidSecret);
    }

    const attrs = this.parseHeader(decryptSecret.toString());
    const base64Key = attrs[KEY_FIELD];
    const time = Number(attrs[TIME_FIELD]);
    const type = attrs[TPYE_FIELD];
    // ErrInvalidKey
    const key = this.base64Decode(base64Key);
    if (!key) {
      throw Error(EHttpErrorCode.ErrInvalidKey);
    }

    // ErrInvalidContentType 预留位
    if (![0, 1].includes(Number(type))) {
      throw Error(EHttpErrorCode.ErrInvalidContentType);
    }
    return { key, time, type };
  }

  public verifySignature(
    secretHeader: SecretType,
    req: reqTpye,
    tolerance: number,
  ) {
    // 时间合法性检测 ms
    const now = new Date().getTime();
    console.log(now, secretHeader.time, tolerance);
    if (
      secretHeader.time + tolerance < now ||
      now + tolerance < secretHeader.time
    ) {
      throw Error(EHttpErrorCode.ErrInvalidTime);
    }

    // 生成 signature 对比
    const signature = this.parseRequest(req);
    signature.unshift(String(secretHeader.time));
    const signatureContent = signature.join('\n');
    const actualSignature = this.hmacSha256Encrypt(
      signatureContent,
      secretHeader.key,
    );
    if (actualSignature !== this.signature) {
      throw Error(EHttpErrorCode.ErrInvalidSignature);
    }

    return true;
  }

  private hmacSha256Encrypt(content: string, secret: string) {
    return createHmac('sha256', secret).update(content).digest('base64');
  }

  private sha256Encrypt(content: string) {
    return createHash('sha256').update(content).digest('base64');
  }

  private decrypt(content: Buffer) {
    return privateDecrypt(
      {
        key: this.privateKey,
        // In order to decrypt the data, we need to specify the
        // same hashing function and padding scheme that we used to
        // encrypt the data in the previous step
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      content,
    );
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

  private base64Decode(key: string) {
    return Buffer.from(key, 'base64').toString();
  }

  private base64Encode(key: string) {
    return Buffer.from(key).toString('base64');
  }

  private parseHeader(content: string) {
    const keys = content.split(';');
    const res: Record<string, string> = {};
    keys.forEach((e) => {
      const ele = e.split('==');
      res[ele[0]] = ele[1];
    });
    console.log('服务端解析', res);
    return res;
  }

  private parseRequest(req: reqTpye) {
    const { path, method, query, body } = req;
    return [
      method.toUpperCase(),
      path,
      JSON.stringify(query),
      this.sha256Encrypt(JSON.stringify(body)),
    ];
  }

  static async generateKeyPair() {
    return generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });
  }
}
