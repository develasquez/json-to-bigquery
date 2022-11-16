/*
# This is not an official Google project.

This script is for **educational purposes only**, is **not certified** and is **not recommended** for production environments.

## Copyright 2021 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

const {BigQuery} = require('@google-cloud/bigquery');
const _ = require('lodash');

function getDate(d) {
    const date = new Date(d);
    const day = `${date.getDate()}`;
    const month = `${date.getMonth() + 1}`;
    const year = `${date.getFullYear()}`;
    const hours = `${date.getHours()}`;
    const minutes = `${date.getMinutes()}`;
    const seconds = `${date.getSeconds()}`;
    return `${year}-${month.length === 1 ? '0' + month : month}-${day.length === 1 ? '0' + day : day} ${hours.length === 1 ? '0' + hours : hours}:${minutes.length === 1 ? '0' + minutes : minutes}:${seconds.length === 1 ? '0' + seconds : seconds}`;
}

function formatDate(data) {
  _.mapKeys(data, (v, k) => {
    if ((v + "").match(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/)) {
      let t = getDate(data[k]);
      if (t != "NaN-NaN-NaN NaN:NaN:NaN") {
        data[k] = t;
      }
    }
  });
  return data;
}

const bq = {
    insert: (data, projectId, store, catallog) => {
        console.log(data);
        return new Promise((resolve, reject) => {
            try {
                const bigquery = new BigQuery({ projectId });
                const formatedData = formatDate(data);
                console.log(formatedData);
                bigquery
                .dataset(store)
                .table(catallog)
                .insert(formatedData)
                .then(resolve)
                .catch((err) => {
                    reject({
                        dbError: err.errors[0].errors[0],
                        insertErrors: err.response.insertErrors[0].errors[0]
                    });
                })
            } catch (err) {
                reject(err);
            }

        });
    }
}

module.exports = bq;
