# This is not an official Google project.

This script is for **educational purposes only**, is **not certified** and is **not recommended** for production environments.

## Copyright 2022 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

# How to use

## Cloud Functions V1

```js
const Buffer = require('safe-buffer').Buffer;
const bq = require('./bq');

exports.clusterSizeFn = async (message, context) => {
    const data = message.data
        ? Buffer.from(message.data, 'base64').toString()
        : '{}';
    let payload = JSON.parse(data)
    bq.insert(
        payload,
        process.env.PROJECT_ID,
        process.env.DATASET,
        process.env.TABLE
    );
}
```
## Cloud Functions V2

```js
const functions = require('@google-cloud/functions-framework');
const Buffer = require('safe-buffer').Buffer;
const bq = require('./bq');

functions.cloudEvent('toBQ', cloudEvent => {
  const message = cloudEvent.data.message.data;
  const data = message
    ? Buffer.from(message, 'base64').toString()
    : '{}';
    let payload = JSON.parse(data)
    bq.insert(
        payload,
        process.env.PROJECT_ID,
        process.env.DATASET,
        process.env.TABLE
    );
});
```


## Dynamic Dataset and Table

```js
/*
{   
    "dataset": "datasetname",
    "table": "tablename",
    "project": "projectname",
    "content": {...}
}
*/
const data = message
? Buffer.from(message, 'base64').toString()
: '{}';
let payload = JSON.parse(data)
let {dataset, table, content} = payload;  

bq.insert(
    content,
    process.env.PROJECT_ID, //or payload.project
    dataset,
    table
);
```