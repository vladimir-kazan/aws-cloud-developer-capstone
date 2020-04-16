import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { createLogger, getWithCors } from '../../utils';
import { getNoteById } from '../../businessLogic/notes';

const logger = createLogger('getNotes');
const withCors = getWithCors({
  origin: '*',
  credentials: true,
});

const noteByIdHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // const userId = event.requestContext.authorizer.principalId;
  const { noteId = '' } = event.pathParameters || {};
  logger.info('Caller event', event);
  let item = await getNoteById('vku', noteId);
  const response = {
    statusCode: 200,
    body: JSON.stringify(item),
  };
  return withCors(response);
};

export const handler = noteByIdHandler;
