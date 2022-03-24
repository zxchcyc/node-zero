import { createDecipheriv } from 'crypto';

export function decryptData(appId, sessionKey, encryptedData, iv) {
  // base64 decode
  const sessionKeyBf = Buffer.from(sessionKey, 'base64');
  const encryptedDataBf: any = Buffer.from(encryptedData, 'base64');
  const ivBf = Buffer.from(iv, 'base64');

  let decoded;
  try {
    // 解密
    const decipher = createDecipheriv('aes-128-cbc', sessionKeyBf, ivBf);
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true);
    decoded = decipher.update(encryptedDataBf, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    // console.log(decoded);
    decoded = JSON.parse(decoded);
  } catch (error) {
    throw new Error(error);
  }
  // console.log(decoded);
  if (decoded.watermark.appid !== appId) {
    throw new Error('Illegal Buffer');
  }
  return decoded;
}
