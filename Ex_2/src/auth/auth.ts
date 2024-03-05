import jwt from 'jsonwebtoken';
import fs from 'fs';

interface DecodedToken {
  userId: string;
}

interface SecretData {
  secret: string;
}

export const generateToken = (userId: string): string => {
  try {
    const secretData = fs.readFileSync('./Secret.json', 'utf-8');
    const { secret } = JSON.parse(secretData) as SecretData;
    const token = jwt.sign({ userId }, secret, { expiresIn: '1h' });
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Token generation failed');
  }
};

export const verifyToken = (token: string): DecodedToken => {
  try {
    const secretData = fs.readFileSync('./Secret.json', 'utf-8');
    const { secret } = JSON.parse(secretData) as SecretData;
    const decoded = jwt.verify(token, secret) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw new Error('Invalid/Expired token');
  }
};
