import auth0, { Auth0DecodedHash, Auth0ParseHashError } from 'auth0-js';
import { authConfig } from '../config';

export class AuthService {
  auth0 = new auth0.WebAuth({
    domain: authConfig.domain,
    clientID: authConfig.clientId,
    redirectUri: authConfig.callbackUrl,
    responseType: 'token id_token',
    scope: 'openid',
  });
  window = window;
  expiresAt = 0;
  accessToken = '';
  idToken = '';

  constructor(private readonly history: any, private readonly storage: Storage) {
    this.tryRestoreSession();
  }

  getIdToken = () => {
    return this.storage.getItem('token') || null;
  };

  handleAuthentication = () => {
    console.log('handleAuthentication');
    this.auth0.parseHash(this.handleParseHash);
  };

  private handleParseHash = (err: Auth0ParseHashError | null, result?: Auth0DecodedHash | null) => {
    if (result && result.accessToken && result.idToken) {
      this.setSession(result);
      return;
    }
    this.clearSession();
    if (err) {
      console.log(err);
      alert(`Error: ${err.error}. Check the console for further details.`);
    }
    this.history.replace('/');
  };

  private setSession(result: Auth0DecodedHash) {
    const { expiresIn = 0, accessToken = '', idToken = '' } = result;
    this.accessToken = accessToken;
    this.idToken = idToken;
    this.expiresAt = expiresIn * 1000 + new Date().getTime();
    this.storage.setItem('token', idToken);
    this.storage.setItem('token_exp', String(this.expiresAt));
    this.history.replace('/');
  }

  private clearSession() {
    this.accessToken = '';
    this.idToken = '';
    this.expiresAt = 0;
    this.storage.removeItem('token');
    this.storage.removeItem('token_exp');
  }

  login = () => {
    this.auth0.authorize();
  };

  logout = () => {
    this.clearSession();
    this.auth0.logout({
      returnTo: this.window.location.origin,
    });
    this.history.replace('/');
  };

  isAuthenticated = () => {
    return new Date().getTime() < this.expiresAt;
  };

  private tryRestoreSession() {
    const exp = Number(this.storage.getItem('token_exp'));
    const expired = new Date().getTime() > exp;
    const token = this.storage.getItem('token');
    if (expired || !token) {
      this.clearSession();
      return;
    }
    this.expiresAt = exp;
    this.idToken = token;
  }
}
