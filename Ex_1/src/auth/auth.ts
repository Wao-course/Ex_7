// auth.ts

import jwt from 'jsonwebtoken';
import fs from 'fs';

export const generateToken = (userId: string): string => {
  const secretData = fs.readFileSync('./Secret.json', 'utf-8');
  const { secret } = JSON.parse(secretData);
  const token = jwt.sign({ userId }, secret, { expiresIn: '1h' });
  return token;
};

export const verifyToken = (token: string): string | object => {
  try {
    const secretData = fs.readFileSync('./Secret.json', 'utf-8');
  const { secret } = JSON.parse(secretData);
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    throw new Error('Invalid/Expired token');
  }
};
