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

const update = async (record: DynamoDBRecord) => {
  const [id, body] = getNoteIndexData(record);
  await es.update({
    index: ES_INDEX_NAME,
    type: ES_DOC_TYPE,
    id,
    body,
  });
};

const deleteIdx = async (record: DynamoDBRecord) => {
  const [id] = getNoteIndexData(record);
  await es.delete({
    index: ES_INDEX_NAME,
    type: ES_DOC_TYPE,
    id,
  });
};

const eleasticSearchSyncHandler: DynamoDBStreamHandler = async (
  event: DynamoDBStreamEvent,
): Promise<void> => {
  logger.info('Caller event', event);
  for (const record of event.Records) {
    logger.info('Processing record', record);
    switch (record.eventName) {
      case 'INSERT':
        await insert(record);
        break;
      case 'MODIFY':
        logger.info('Handle Update', '');
        await update(record);
        break;
      case 'REMOVE':
        logger.info('Handle Remove', '');
        await deleteIdx(record);
        break;
    }
    const { NewImage: newItem = {} } = record.dynamodb || {};
    logger.info('Processed item', newItem);
  }
};

export const handler = eleasticSearchSyncHandler;
