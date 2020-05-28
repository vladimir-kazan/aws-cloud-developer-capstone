import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as ElasticSearch from 'elasticsearch';

import { createLogger, getWithCors } from '../../utils';
import { SearchParams } from 'elasticsearch';
import { NoteModel } from '../../dataLayer/notes.service';

const logger = createLogger('searchNotes');
const withCors = getWithCors({
  origin: '*',
  credentials: true,
});

const { ES_ENDPOINT = '' } = process.env;
const ES_INDEX_NAME = 'search-notes';
const ES_DOC_TYPE = 'markdown-document';

const es = new ElasticSearch.Client({
  hosts: [ES_ENDPOINT],
  connectionClass: require('http-aws-es'),
});

const searchNotesHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Caller event', event);
  const { expression = '' } = event.pathParameters || {};
  const { authorizer } = event.requestContext || {};
  const { principalId = '' } = authorizer || {};
  const queryExpression = `(title:${expression}* OR body:${expression}*) AND userId:"${principalId}"`;
  const params: SearchParams = {
    index: ES_INDEX_NAME,
    type: ES_DOC_TYPE,
    body: {
      query: {
        bool: {
          must: [
            {
              query_string: {
                query: queryExpression,
              },
            },
          ],
        },
      },
    },
  };
  try {
    const result = await es.search<NoteModel>(params);
    const items = result.hits.hits
      .map((i) => i._source)
      .filter((n) => n.userId === principalId)
      .map((n) => {
        n.body = '';
        return n;
      });
    const response = {
      statusCode: 200,
      body: JSON.stringify(items),
    };
    return withCors(response);
  } catch (err) {
    logger.error('Caller error', err);
    const response = {
      statusCode: 500,
      body: JSON.stringify(err),
    };
    return withCors(response);
  }
};

export const handler = searchNotesHandler;
