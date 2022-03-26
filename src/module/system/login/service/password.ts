import * as bcrypt from 'bcryptjs';
const SALT_WORK_FACTOR = 8;

export async function genPassword(
  password: string,
): Promise<{ salt: string; hash: string }> {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(SALT_WORK_FACTOR, (error, salt) => {
      if (error) {
        reject(error);
      }
      bcrypt.hash(password, salt, (error, hash) => {
        if (error) {
          reject(error);
        }
        resolve({ salt, hash });
      });
    });
  });
}

export async function comparePassword(_password: string, password: string) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(_password, password, (error, isMatch) => {
      if (!error) {
        resolve(isMatch);
      } else {
        reject(error);
      }
    });
  });
}
