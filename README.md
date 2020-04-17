# Capstone Project

## Development

```sh

sls dynamodb install
sls dynamodb seed --seed=demo

 sls invoke local --function getNotes --data '{ "queryStringParameters": {"sorting": "title"} }'


```

```js
dynamodb
  .scan({
    TableName: 'notes-dev-v1',
  })
  .eachPage(function (err, data) {
    if (err) console.log(err);
    else if (data) console.log(data);
  });
```
