# Areas

The following area endpoints are available


## Get user areas

Returns the list of areas created by the user provided

### Parameters

Parameter        |               Description               |    Type |                                          Values | Required
------------ | :-------------------------------------: | ------: | ----------------------------------------------: | -------:
application         |           Application            |    Text |                                        Any Text, values separated by commas |      No

```shell
curl -X POST https://api.resourcewatch.org/v1/area?application=<application>
-H "Authorization: Bearer <your-token>"
```

### Example

Areas created by an user for the application RW.

```shell
curl -X POST https://api.resourcewatch.org/v1/area?application=rw
-H "Authorization: Bearer <your-token>"
```

```
{
  "data": [
    {
      "type": "area",
      "id": "59ca3213d08a7d001054522b",
      "attributes": {
        "name": "Test area France",
        "application": "rw",
        "geostore": "8f77fe62cf15d5098ba0ee11c5126aa6",
        "userId": "58e22f662071c01c02f76a0f",
        "createdAt": "2017-09-26T10:55:15.990Z",
        "updatedAt": "2017-09-26T10:55:15.990Z",
        "image": "",
        "datasets": [

        ],
        "use": {

        },
        "iso": {

        }
      }
    },
    {
      "type": "area",
      "id": "59ca32ea3209db0014e9a7b7",
      "attributes": {
        "name": "Test custom area",
        "application": "rw",
        "geostore": "b12640deba9d3c5012c5359dd5572e2d",
        "userId": "58e22f662071c01c02f76a0f",
        "createdAt": "2017-09-26T10:58:50.226Z",
        "updatedAt": "2017-09-26T10:58:50.226Z",
        "image": "",
        "datasets": [

        ],
        "use": {

        },
        "iso": {

        }
      }
    }
  ]
}
```

## Create area

Creates a new area

### Parameters

Parameter        |               Description               |    Type |                                          Values | Required
------------ | :-------------------------------------: | ------: | ----------------------------------------------: | -------:
application         |           Application            |    Text |                                        Any Text, values separated by commas |      Yes
name         |           Name of the new area            |    Text |                                        Any Text |      Yes
geostore         |           Geostore ID            |    Text |                                        Any Text |      Yes

```shell
curl -X POST https://api.resourcewatch.org/v1/area \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "name": <name>,
   "application": <application>,
   "geostore": <geostore id>
 }'
```

### Example

Create an area with name 'Portugal area' and Geostore ID '713899292fc118a915741728ef84a2a7' for the Resource Watch application

```shell
curl -X POST https://api.resourcewatch.org/v1/area?application=rw \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "name": "Portugal area",
   "application": "rw",
   "geostore": "713899292fc118a915741728ef84a2a7"
 }'
```

```
{
  "data": {
    "type": "area",
    "id": "5a0da028e6d876001080c259",
    "attributes": {
      "name": "Portugal area",
      "application": "rw",
      "geostore": "713899292fc118a915741728ef84a2a7",
      "userId": "58e22f662071c01c02f76a0f",
      "createdAt": "2017-11-16T14:26:48.396Z",
      "updatedAt": "2017-11-16T14:26:48.396Z",
      "image": "",
      "datasets": [

      ],
      "use": {

      },
      "iso": {

      }
    }
  }
}
```

## Delete area

Deletes an area

```shell
curl -X DELETE https://api.resourcewatch.org/v1/area/<area-id> \
-H "Authorization: Bearer <your-token>" \
```

### Example

```shell
curl -X POST https://api.resourcewatch.org/v1/area/59ca3213d08a7d001054522b \
-H "Authorization: Bearer <your-token>" \
```

## Get area

Gets all the information from an area

```shell
curl -X GET https://api.resourcewatch.org/v1/area/<area-id> \
-H "Authorization: Bearer <your-token>" \
```

### Example

```shell
curl -X GET https://api.resourcewatch.org/v1/area/59ca32ea3209db0014e9a7b7 \
-H "Authorization: Bearer <your-token>" \
```

```
{
    "data": {
        "type": "area",
        "id": "59ca32ea3209db0014e9a7b7",
        "attributes": {
            "name": "Test custom area",
            "application": "rw",
            "geostore": "b12640deba9d3c5012c5359dd5572e2d",
            "userId": "58e22f662071c01c02f76a0f",
            "createdAt": "2017-09-26T10:58:50.226Z",
            "updatedAt": "2017-09-26T10:58:50.226Z",
            "image": "",
            "datasets": [],
            "use": {},
            "iso": {}
        }
    }
}
```
