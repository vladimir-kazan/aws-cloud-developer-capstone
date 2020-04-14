import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { createLogger, getWithCors } from '../../utils';

const logger = createLogger('getNotes');
const withCors = getWithCors({
  origin: '*',
  credentials: true,
});

const getNotesHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Caller event', event);
  const response = {
    statusCode: 200,
    body: JSON.stringify({ msg: 'Hello world' }),
  };
  return withCors(response);
};

export const handler = getNotesHandler;
