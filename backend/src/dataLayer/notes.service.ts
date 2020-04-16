import * as AWS from 'aws-sdk';
// import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../utils';

let XAWS: any = AWS;
const { NOTES_TABLE = '', IS_OFFLINE } = process.env;
if (!IS_OFFLINE) {
  // it adds 10MB
  // XAWS = AWSXRay.captureAWS(AWS);
}

const logger = createLogger('DL/NotesService');

const createDynamoDbClient = () => {
  if (IS_OFFLINE) {
    logger.info('Creating a local DynamoDB instance', {});
    return new (XAWS.DynamoDB as any).DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000',
      accessKeyId: 'DEFAULT_ACCESS_KEY',  // needed if you don't have aws credentials at all in env
      secretAccessKey: 'DEFAULT_SECRET',
    });
  }
  return new (XAWS.DynamoDB as any).DocumentClient({ convertEmptyValues: true });
};

export class NotesService {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDbClient(),
  ) {}

  async createItem(dto: NoteModel): Promise<NoteModel> {
    await this.docClient
      .put({
        TableName: NOTES_TABLE,
        Item: dto,
      })
      .promise();
    return dto;
  }

  async getItems(userId: string): Promise<NoteModel[]> {
    const payload = await this.docClient
      .query({
        TableName: NOTES_TABLE,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId,
        },
      })
      .promise();
    return <NoteModel[]>payload.Items;
  }

  async getById(userId: string, noteId: string): Promise<NoteModel> {
    const output = await this.docClient
      .get({
        TableName: NOTES_TABLE,
        Key: {
          userId,
          noteId,
        },
      })
      .promise();
    return <NoteModel>output.Item;
  }
}

export interface NoteModel {
  noteId: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}
