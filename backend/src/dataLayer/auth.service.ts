import 'source-map-support/register';

import axios from 'axios';
import { createLogger } from '../utils';

const { AUTH_JWKS = '' } = process.env;
const logger = createLogger('DL/AuthService');

const certToPEM = (cert: string) => {
  const match = cert.match(/.{1,64}/g) || [];
  cert = match.join('\n');
  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
  return cert;
};

export class AuthService {
  private pem = '';

  async getPublicKey(forceDownload: boolean = false): Promise<string> {
    if (!this.pem || forceDownload) {
      const { data } = await axios.get(AUTH_JWKS);
      const [key] = data.keys;
      const x5c = key.x5c[0];
      this.pem = certToPEM(x5c);
    }
    logger.info('PEM generated', { pem: this.pem });
    return this.pem;
  }
}
