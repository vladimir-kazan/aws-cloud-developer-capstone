import * as AWS from 'aws-sdk';
// import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

let XAWS: any = AWS;
const { NOTES_TABLE = '', IS_OFFLINE } = process.env;
if (!IS_OFFLINE) {
  // it adds 10MB
  // XAWS = AWSXRay.captureAWS(AWS);
}

const createDynamoDbClient = () => {
  if (IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance');
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
}

export interface NoteModel {
  noteId: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}
