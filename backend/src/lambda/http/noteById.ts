import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { createLogger, getWithCors } from '../../utils';
import { getNoteById } from '../../businessLogic/notes';

const logger = createLogger('getNoteById');
const withCors = getWithCors({
  origin: '*',
  credentials: true,
});

const noteByIdHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { authorizer } = event.requestContext || {};
  const { principalId = '' } = authorizer || {};
  const { noteId = '' } = event.pathParameters || {};
  logger.info('Caller event', event);
  let item = await getNoteById(principalId, noteId);
  const response = {
    statusCode: item ? 200 : 404,
    body: JSON.stringify(item),
  };
  return withCors(response);
};

export const handler = noteByIdHandler;
