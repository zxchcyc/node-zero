export function captchaKey(prefix: string) {
  return `captcha:${prefix}`;
}

export function validateCaptchaKey(prefix: string) {
  return `validate:captcha:${prefix}`;
}

export function verifyCodeLimitKey(prefix: string) {
  return `verifyCode:count:limit:${prefix}`;
}

export function verifyCodeUseKey(prefix: string) {
  return `verifyCode:use:${prefix}`;
}
