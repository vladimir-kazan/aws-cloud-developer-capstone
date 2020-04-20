import 'source-map-support/register';

import { verify } from 'jsonwebtoken';
import { createLogger } from '../utils';
import { AuthService } from '../dataLayer/auth.service';

const { AUTH_CLIENT_ID, AUTH_ISSUER } = process.env;

const authAccess = new AuthService();
const logger = createLogger('BL/auth');

export interface JwtPayload {
  iss: string;
  sub: string;
  iat: number;
  exp: number;
}

export const verifyToken = async (token: string): Promise<JwtPayload> => {
  const pem = await authAccess.getPublicKey();
  logger.info('PEM & token', { pem, token });
  const decoded = verify(token, pem, {
    audience: AUTH_CLIENT_ID,
    issuer: AUTH_ISSUER,
  });
  logger.info('decoded', { decoded });
  return <JwtPayload>decoded;
};
