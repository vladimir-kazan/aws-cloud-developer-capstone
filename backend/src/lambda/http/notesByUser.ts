import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { createLogger, getWithCors } from '../../utils';
import { getNotes } from '../../businessLogic/notes';

const logger = createLogger('getNotes');
const withCors = getWithCors({
  origin: '*',
  credentials: true,
});

const notesByUserHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Caller event', event);
  let items = (await getNotes('vku')).map((n) => ({ ...n, body: undefined }));
  const response = {
    statusCode: 200,
    body: JSON.stringify(items),
  };
  return withCors(response);
};

export const handler = notesByUserHandler;
