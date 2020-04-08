import 'source-map-support/register';

import { Handler, Context, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

const { variable1 } = process.env;

const hello: Handler =  async (event: APIGatewayProxyEvent, ctx: Context): Promise<APIGatewayProxyResult> => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: Math.floor(Math.random() * 10),
      variable1,
    }),
  };

  return response;
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
}

export { hello };
