import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { createLogger, getWithCors } from '../../utils';
import { addNote } from '../../businessLogic/notes';
import { NoteModel } from '../../dataLayer/notes.service';

const logger = createLogger('addNote');
const withCors = getWithCors({
  origin: '*',
  credentials: true,
});

const addNoteHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const { authorizer } = event.requestContext || {};
  const { principalId = '' } = authorizer || {};
  const { body = '' } = event || {};
  logger.info('Caller event', event);
  const dto: Pick<NoteModel, 'title' | 'body'> = JSON.parse(body || '');
  let item = await addNote(principalId, dto);
  const response = {
    statusCode: 200,
    body: JSON.stringify(item),
  };
  return withCors(response);
};

export const handler = addNoteHandler;
