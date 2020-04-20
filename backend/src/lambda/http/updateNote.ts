import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { createLogger, getWithCors } from '../../utils';
import { updateNote } from '../../businessLogic/notes';
import { NoteModel } from '../../dataLayer/notes.service';

const logger = createLogger('getNotes');
const withCors = getWithCors({
  origin: '*',
  credentials: true,
});

const updateNoteHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { authorizer } = event.requestContext || {};
  const { principalId = '' } = authorizer || {};
  const { body = '' } = event || {};
  logger.info('Caller event', event);
  const dto: Pick<NoteModel, 'title' | 'body' | 'noteId' | 'createdAt'> = JSON.parse(body || '');
  logger.info('Caller event', event);
  let item = await updateNote(principalId, dto);
  const response = {
    statusCode: 200,
    body: JSON.stringify(item),
  };
  return withCors(response);
};

export const handler = updateNoteHandler;
