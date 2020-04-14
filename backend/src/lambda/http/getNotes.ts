import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { createLogger, getWithCors } from '../../utils';
import { getNotes } from '../../businessLogic/notes';

const logger = createLogger('getNotes');
const withCors = getWithCors({
  origin: '*',
  credentials: true,
});

const getNotesHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Caller event', event);
  const items = await getNotes('vku');
  const response = {
    statusCode: 200,
    body: JSON.stringify(items),
  };
  return withCors(response);
};

export const handler = getNotesHandler;
