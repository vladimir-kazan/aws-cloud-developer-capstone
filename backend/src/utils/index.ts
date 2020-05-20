import 'source-map-support/register';

import { APIGatewayProxyResult } from 'aws-lambda';
import { Logger } from './logger';

export const createLogger = (loggerName: string) => {
  return new Logger({
    level: 'info',
    meta: { name: loggerName },
  });
};

interface CorsOptions {
  origin: string;
  credentials: boolean;
}

export const getWithCors = (options: CorsOptions) => {
  return (response: APIGatewayProxyResult) => {
    if (!response.headers) {
      response.headers = {};
    }
    response.headers['Access-Control-Allow-Credentials'] = options.credentials;
    response.headers['Access-Control-Allow-Origin'] = options.origin;
    return response;
  };
};
