import crypto from 'crypto';

export const generateResetCode = (): string => {
  return crypto.randomInt(100000, 1000000).toString();
};
