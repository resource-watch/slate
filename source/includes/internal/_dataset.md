# Dataset

Besides the dataset types documented on the core dataset docs, there are additional dataset types that are available to internal developers only.


### NEXGDDP

> Example of creating a dataset based on NEXGDDP data with the minimum fields required

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
   "dataset": {
     "application": [
       "rw"
     ],
     "name": "Average low temperature (decadal under rcp45 scenario)",
     "connectorType": "rest",
     "provider": "nexgddp",
     "tableName": "tasmin/rcp45_decadal"
   }
 }'
```

To create a dataset using NEXGDDP as data source, besides the common required fields, you must provide the following required data:

Field           | Description                                                                            | Example value  |
--------------- | :------------------------------------------------------------------------------------: | ------------:  |
`connectorType` | The type of connector. Must be set to `rest`.                                          | `rest`         |
`provider`      | The provider should be set to `nexgddp`.                                               | `nexgddp`          |
`tableName`     |                                                                                        | tasmin/rcp45_decadal |


This dataset type assumes that data is already present in WRI's Rasdaman server, and makes no attempt to put it there. It should be accessible via the `tableName` specified in the request.

The RW API will use the information above to directly query the NEXGDDP dataset specified on the `tableName` field that should live on WRI's Rasdaman server, whenever this dataset is accessed on the RW API. This has a few implications that you should be aware of:

- Any changes made to the data hosted on the Rasdaman server will be automatically reflected on the data served by the RW API for this dataset.
- If you restructure or delete your NEXGDDP dataset, the corresponding RW API dataset will be in an invalid state, and you should delete it.

When creating a NEXGDDP dataset, the RW API will try to validate it by connecting to the corresponding dataset on the Rasdaman server - the result of this will determine if the dataset's status will be set to `saved` or `error`.

### Loca

> Example of creating a dataset based on Loca data with the minimum fields required

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
   "dataset": {
     "application": [
       "rw"
     ],
     "name": "Average low temperature (decadal under rcp45 scenario)",
     "connectorType": "rest",
     "provider": "loca",
     "tableName": "loca_tasavg/rcp85_decadal"
   }
 }'
```

To create a dataset using Loca as data source, besides the common required fields, you must provide the following required data:

Field           | Description                                                                            | Example value  |
--------------- | :------------------------------------------------------------------------------------: | ------------:  |
`connectorType` | The type of connector. Must be set to `rest`.                                          | `rest`         |
`provider`      | The provider should be set to `loca`.                                                  | `loca`         |
`tableName`     |                                                                                        | loca_tasavg/rcp85_decadal |


This dataset type assumes that data is already present in WRI's Rasdaman server, and makes no attempt to put it there. It should be accessible via the `tableName` specified in the request.

The RW API will use the information above to directly query the Loca dataset specified on the `tableName` field that should live on WRI's Rasdaman server, whenever this dataset is accessed on the RW API. This has a few implications that you should be aware of:

- Any changes made to the data hosted on the Rasdaman server will be automatically reflected on the data served by the RW API for this dataset.
- If you restructure or delete your Loca dataset, the corresponding RW API dataset will be in an invalid state, and you should delete it.

When creating a Loca dataset, the RW API will try to validate it by connecting to the corresponding dataset on the Rasdaman server - the result of this will determine if the dataset's status will be set to `saved` or `error`.



### BigQuery

> Example of creating a dataset based on BigQuery data with the minimum fields required

```shell
curl -X POST 'https://api.resourcewatch.org/v1/dataset' -d \
-H 'Authorization: Bearer <your-token>'  \
-H 'Content-Type: application/json' -d \
'{"
  dataset": {
   	"name": "World Bank: Education Data. Contains key education statistics from a variety of sources to provide a look at global literacy, spending, and access",
	"tableName": "[bigquery-public-data.world_bank_intl_education.international_education]",
	"connectorType":"rest",
	"provider":"bigquery", 
	"application": ["rw"]
  }
}'
```

To create a dataset using Loca as data source, besides the common required fields, you must provide the following required data:

Field           | Description                                                                            | Example value  |
--------------- | :------------------------------------------------------------------------------------: | ------------:  |
`connectorType` | The type of connector. Must be set to `rest`.                                          | `rest`         |
`provider`      | The provider should be set to `bigquery`.                                              | `bigquery`     |
`tableName`     | Dataset's reference in [owner:dataset.table] format                                    | [bigquery-public-data.world_bank_intl_education.international_education] |


This dataset type assumes that data is already present on the location identified by the value in `tableName`, and makes no attempt to put it there.

The RW API will use the information above to directly query the BigQuery dataset specified above whenever this dataset is accessed on the RW API. This has a few implications that you should be aware of:

- Any changes made to the data hosted on the BigQuery dataset will be automatically reflected on the data served by the RW API for this dataset.
- If you restructure or delete your BigQuery dataset, the corresponding RW API dataset will be in an invalid state, and you should delete it.

When creating a Loca dataset, the RW API will try to validate it by connecting to the corresponding dataset on BigQuery - the result of this will determine if the dataset's status will be set to `saved` or `error`.

**Important**: as BigQuery is billed by query, opening this connector to the world could have a large impact on the API's cost. As such, creating BigQuery datasets is restricted to specific users. 
