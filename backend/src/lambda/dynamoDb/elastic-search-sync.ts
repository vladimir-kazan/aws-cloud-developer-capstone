import 'source-map-support/register';

import { DynamoDBStreamHandler, DynamoDBStreamEvent, DynamoDBRecord } from 'aws-lambda';
import * as ElasticSearch from 'elasticsearch';
// import { Client } from '@elastic/elasticsearch';

import { createLogger } from '../../utils';

const { ES_ENDPOINT = '' } = process.env;
const ES_INDEX_NAME = 'search-notes';
const ES_DOC_TYPE = 'markdown-document';

const logger = createLogger('eleasticSearchSync');
const es = new ElasticSearch.Client({
  hosts: [ES_ENDPOINT],
  connectionClass: require('http-aws-es'),
});
// const node = ES_ENDPOINT.startsWith('https://') ? ES_ENDPOINT : `https://${ES_ENDPOINT}`;
// const es = new Client({
//   node,
//   auth: {
//     username: 'test',
//     password: '_WnPn1azG4KG',
//   },
// });

const getNoteIndexData = (record: DynamoDBRecord): [string, any] => {
  const { NewImage: newItem = {} } = record.dynamodb || {};
  const emptyS = { S: '' };
  const {
    noteId = emptyS,
    userId = emptyS,
    title = emptyS,
    body = emptyS,
    createdAt = emptyS,
    updatedAt = emptyS,
  } = newItem;
  const payload = {
    noteId: noteId.S,
    userId: userId.S,
    title: title.S,
    body: body.S,
    createdAt: createdAt.S,
    updatedAt: updatedAt.S,
  };
  return [`${userId.S}__${noteId.S}`, payload];
};

const insert = async (record: DynamoDBRecord) => {
  const [id, body] = getNoteIndexData(record);
  await es.index({
    index: ES_INDEX_NAME,
    type: ES_DOC_TYPE,
    id,
    body,
  });
};

const eleasticSearchSyncHandler: DynamoDBStreamHandler = async (
  event: DynamoDBStreamEvent,
): Promise<void> => {
  logger.info('Caller event', event);
  for (const record of event.Records) {
    logger.info('Processing record',record);
    if (record.eventName === 'INSERT') {
      await insert(record);
    }
    const { NewImage: newItem = {} } = record.dynamodb || {};
    logger.info('Processed item', newItem);
  }
};

export const handler = eleasticSearchSyncHandler;
