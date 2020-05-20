import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { createLogger, getWithCors } from '../../utils';
import { getNotes } from '../../businessLogic/notes';

const logger = createLogger('getNotes');
const withCors = getWithCors({
  origin: '*',
  credentials: true,
});

const validSortings = ['title', '-title', 'updated', '-updated'];

const notesByUserHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Caller event', event);
  const { authorizer } = event.requestContext || {};
  const { principalId = '' } = authorizer || {};
  let { sort = 'title' } = event.queryStringParameters || {};
  sort = sort.toLowerCase();
  if (!validSortings.includes(sort)) {
    sort = 'title';
  }
  let items = (await getNotes(principalId, sort)).map((n) => ({ ...n, body: undefined }));
  const response = {
    statusCode: 200,
    body: JSON.stringify(items),
  };

  return withCors(response);
};

export const handler = notesByUserHandler;
