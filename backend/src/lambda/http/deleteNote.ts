import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { createLogger, getWithCors } from '../../utils';
import { deleteNoteById } from '../../businessLogic/notes';

const logger = createLogger('deleteNoteById');
const withCors = getWithCors({
  origin: '*',
  credentials: true,
});

const deleteNoteByIdHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const { authorizer } = event.requestContext || {};
  const { principalId = '' } = authorizer || {};
  const { noteId = '' } = event.pathParameters || {};
  logger.info('Caller event', event);
  await deleteNoteById(principalId, noteId);
  const response = {
    statusCode: 200,
    body: '',
  };
  return withCors(response);
};

export const handler = deleteNoteByIdHandler;
