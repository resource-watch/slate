# Tasks

## What is a task?

In the context of this API, a task is a process in charge of performing certain actions on datasets of the document type.
These actions can be creating a dataset or overwriting its content.

A task may contains the following fields:

Field             |                                     Description                                      |    Type
----------------- | :----------------------------------------------------------------------------------: | ------:
id                |                                   Id of the task                                     |    Text
type              |  Task type - see full list [here](https://github.com/resource-watch/doc-importer-messages/blob/master/task.messages.js#L4) |   Text
message           |                        Task message, which parametrizes the task                     |   Object
status            |  Status of the task - see full list [here](https://github.com/resource-watch/doc-orchestrator/blob/master/app/src/app.constants.js#L3) |    Text
reads             |                     Number of data reads performed by the task                       |  Number
writes            |                     Number of data writes performed by the task                      |  Number
index             |                     Name of the Elasticsearch index used in this task                |    Text
datasetId         |                     Id of the dataset to which this task relates                     |    Text
logs              |                     List of the individual operations carried out by this task       |   Array
error             |                     Error message generated should the task fail                     |    Text
createdAt         | Date and time in which the task was created                                          | DateTime
updatedAt         | Date and time in which the task was last updated                                     | DateTime

A task is fundamentally an internal element to the API, and it's visibility and interaction is limited to maintenance and debug actions.
At its core, a task represents a single package that contains:

- An action to be carried out.
- A message that parametrises that action.
- A status that identifies the progress stage of the task.
- A dataset to which that action should relate.
- An Elasticsearch index identifier where the resulting data will be saved.
- Counters for read and write operations.
- Logs for those operations.
- An optional error field that identifies what happened in case of failure.

    
## Get all tasks

To obtain all tasks:

```shell
curl -X GET https://api.resourcewatch.org/v1/doc-importer/task
```

> Example response:

```json
{
    "data": [
        {
            "id": "55b02cfd-dabf-4ad0-a04d-5501cf248a0c",
            "type": "task",
            "attributes": {
                "type": "TASK_CREATE",
                "message": {
                    "id": "55b02cfd-dabf-4ad0-a04d-5501cf248a0c",
                    "type": "TASK_CREATE",
                    "datasetId": "65593fee-26e0-4c3c-84b3-cc0921bf8bc1",
                    "fileUrl": "http://gfw2-data.s3.amazonaws.com/country-pages/fire_alerts_all.csv",
                    "provider": "csv",
                    "legend": {
                        "date": [],
                        "region": [],
                        "country": [],
                        "nested": []
                    },
                    "verified": false,
                    "dataPath": "rows"
                },
                "status": "SAVED",
                "reads": 973,
                "writes": 973,
                "createdAt": "2019-02-20T07:39:31.295Z",
                "updatedAt": "2019-02-20T10:10:07.147Z",
                "index": "index_65593fee26e04c3c84b3cc0921bf8bc1_1550648371365",
                "datasetId": "65593fee-26e0-4c3c-84b3-cc0921bf8bc1",
                "logs": [
                    {
                        "id": "a67f2557-9237-4435-82fd-3a0ad64b0292",
                        "type": "STATUS_INDEX_CREATED",
                        "taskId": "55b02cfd-dabf-4ad0-a04d-5501cf248a0c",
                        "index": "index_65593fee26e04c3c84b3cc0921bf8bc1_1550648371365"
                    },
                    {
                        "id": "53ac8e83-167b-4c77-9b61-6642b1764b32",
                        "type": "STATUS_READ_DATA",
                        "taskId": "55b02cfd-dabf-4ad0-a04d-5501cf248a0c"
                    }
                ]
            }
        },
        {
        
            "id": "415ecb4e-ed9a-4b0f-9f8b-7755775b08f5",
            "type": "task",
            "attributes": {
                "type": "TASK_CREATE",
                "message": {
                    "id": "415ecb4e-ed9a-4b0f-9f8b-7755775b08f5",
                    "type": "TASK_CREATE",
                    "datasetId": "638cce8c-3e97-4bdd-b4de-41cd28254370",
                    "fileUrl": "http://gfw2-data.s3.amazonaws.com/country-pages/fire_alerts_all.csv",
                    "provider": "csv",
                    "legend": {
                        "date": [],
                        "region": [],
                        "country": [],
                        "nested": []
                    },
                    "verified": false,
                    "dataPath": "rows"
                },
                "status": "SAVED",
                "reads": 973,
                "writes": 973,
                "createdAt": "2019-02-20T07:39:36.421Z",
                "updatedAt": "2019-02-20T10:10:09.175Z",
                "index": "index_638cce8c3e974bddb4de41cd28254370_1550652900017",
                "datasetId": "638cce8c-3e97-4bdd-b4de-41cd28254370",
                "logs": [
                    {
                        "id": "8f5b6b0c-9132-4b5c-b7c4-b58582b3cb0b",
                        "type": "STATUS_INDEX_CREATED",
                        "taskId": "415ecb4e-ed9a-4b0f-9f8b-7755775b08f5",
                        "index": "index_638cce8c3e974bddb4de41cd28254370_1550652900017"
                    },
                    {
                        "id": "63c69b2b-31cd-4bdb-9794-f6d4ec155e7b",
                        "type": "STATUS_READ_DATA",
                        "taskId": "415ecb4e-ed9a-4b0f-9f8b-7755775b08f5"
                    }
                ]
            }
        }
    ],
    "links": {
        "self": "https://api.resourcewatch.org/v1/doc-importer/task?page[number]=1&page[size]=10",
        "first": "https://api.resourcewatch.org/v1/doc-importer/task?page[number]=1&page[size]=10",
        "last": "https://api.resourcewatch.org/v1/doc-importer/task?page[number]=23&page[size]=10",
        "prev": "https://api.resourcewatch.org/v1/doc-importer/task?page[number]=1&page[size]=10",
        "next": "https://api.resourcewatch.org/v1/doc-importer/task?page[number]=2&page[size]=10"
    },
    "meta": {
        "total-pages": 23,
        "total-items": 227,
        "size": 10
    }
}
```


### Pagination

Field        |         Description          |   Type|   Default value
------------ | :--------------------------: | -----:| -----:
page[size]   | The number elements per page. The maximum allowed value is 100 | Number|   10
page[number] |       The page number        | Number|   1


### Filter params

Available filters:

Field           |                                     Description                                      |    Type
--------------- | :----------------------------------------------------------------------------------: | ------:
type            |  Task type                                                                           |    Text
status          |  Task status                                                                         |    Text
datasetID       |  Id of the dataset to which the task refers                                          |    Text
createdAt       |  Tasks created on the given date                                                     |    Date
updatedAt       |  Tasks last updated on the given date                                                |    Date
createdBefore   |  Tasks created before the given date                                                 |    Date
createdAfter    |  Tasks created after the given date                                                  |    Date
updatedBefore   |  Tasks last updated before the given date                                            |    Date
updatedAfter    |  Tasks last updated after the given date                                             |    Date

> Return tasks with type TASK_OVERWRITE

```shell
curl -X GET https://api.resourcewatch.org/v1/doc-importer/task?type=TASK_OVERWRITE
```

> Return the tasks with status SAVED

```shell
curl -X GET https://api.resourcewatch.org/v1/doc-importer/task?status=SAVED
```

> Return the tasks created on Feb 1st 2019

```shell
curl -X GET https://api.resourcewatch.org/v1/doc-importer/task?createdAt=2019-02-01
```

> Return the tasks last updated between Jan 2nd and Feb 2nd 2019

```shell
curl -X GET https://api.resourcewatch.org/v1/doc-importer/task?updatedAfter=2019-01-02&updatedBefore=2019-02-02
```

> Return the tasks last updated before and Feb 2nd 2019 and with status ERROR

```shell
curl -X GET https://api.resourcewatch.org/v1/doc-importer/task?updatedBefore=2019-02-02&status=ERROR
```



## Get a single task

To obtain the task:

```shell
curl -X GET https://api.resourcewatch.org/v1/doc-importer/task/55b02cfd-dabf-4ad0-a04d-5501cf248a0c
```

> Example response:

```json
{
    "data": {
        "id": "55b02cfd-dabf-4ad0-a04d-5501cf248a0c",
        "type": "task",
        "attributes": {
            "type": "TASK_CREATE",
            "message": {
                "id": "55b02cfd-dabf-4ad0-a04d-5501cf248a0c",
                "type": "TASK_CREATE",
                "datasetId": "65593fee-26e0-4c3c-84b3-cc0921bf8bc1",
                "fileUrl": "http://gfw2-data.s3.amazonaws.com/country-pages/fire_alerts_all.csv",
                "provider": "csv",
                "legend": {
                    "date": [],
                    "region": [],
                    "country": [],
                    "nested": []
                },
                "verified": false,
                "dataPath": "rows"
            },
            "status": "SAVED",
            "reads": 973,
            "writes": 973,
            "createdAt": "2019-02-20T07:39:31.295Z",
            "updatedAt": "2019-02-20T10:10:07.147Z",
            "index": "index_65593fee26e04c3c84b3cc0921bf8bc1_1550648371365",
            "datasetId": "65593fee-26e0-4c3c-84b3-cc0921bf8bc1",
            "logs": [
                {
                    "id": "a67f2557-9237-4435-82fd-3a0ad64b0292",
                    "type": "STATUS_INDEX_CREATED",
                    "taskId": "55b02cfd-dabf-4ad0-a04d-5501cf248a0c",
                    "index": "index_65593fee26e04c3c84b3cc0921bf8bc1_1550648371365"
                },
                {
                    "id": "53ac8e83-167b-4c77-9b61-6642b1764b32",
                    "type": "STATUS_READ_DATA",
                    "taskId": "55b02cfd-dabf-4ad0-a04d-5501cf248a0c"
                }
            ]
        }
    }
}
```

## Delete a task

You can delete a task if, for example, it is stuck on a running state, but it's not actually running. This should
be considered a "only do it if you know what you are doing" operation, and requires ADMIN permission.

```shell
curl -X DELETE https://api.resourcewatch.org/v1/doc-importer/task/<task_id> \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```
