export const jwtConstants = {
  secret: 'node-zero:20211223',
  accessTokenExpiresIn: 1 * 24 * 60 * 60 + 's', // 1d
  redisAccessTokenExpiresIn: 1 * 24 * 60 * 60 + '',
  redisRefreshTokenExpiresIn: 30 * 24 * 60 * 60 + '', // 30d
  refreshTokenExpiresIn: 30 * 24 * 60 * 60 + 'h',
};
