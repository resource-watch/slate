# Endpoints

This section of the documentation refers to endpoints that can only be used for the purposes of development. These endpoints can only be called by other micro services via Control Tower.

## Finding users by ids

To retrieve the information of multiple users by ids, use the `/auth/user/find-by-ids` endpoint.

This endpoint requires authentication, and can only be called from another micro service.

```shell
# retrieve info for multiple users with the given ids
curl -X POST https://api.resourcewatch.org/auth/user/find-by-ids \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
'{
    "ids": [
        "0706f055b929453eb1547392123ae99e",
        "0c630aeb81464fcca9bebe5adcb731c8",
    ]
}'
```

> Example response:

```shell
    {
        "data": [
            {
                "provider": "local",
                "role": "USER",
                "_id": "0706f055b929453eb1547392123ae99e",
                "email": "example@user.com",
                "createdAt": "2016-08-22T11:48:51.163Z",
                "extraUserData": {
                    "apps": [
                        "rw",
                        "gfw"
                    ]
                },
                "updatedAt": "2019-12-18T15:59:57.333Z"
            },
            {
                "provider": "local",
                "role": "ADMIN",
                "_id": "0c630aeb81464fcca9bebe5adcb731c8",
                "email": "example2@user.com",
                "createdAt": "2016-08-22T11:48:51.163Z",
                "extraUserData": {
                    "apps": [
                        "rw",
                        "gfw",
                        "prep",
                        "aqueduct",
                        "forest-atlas",
                        "data4sdgs",
                        "gfw-climate",
                        "gfw-pro",
                        "ghg-gdp"
                    ]
                },
                "updatedAt": "2019-12-18T15:59:57.333Z"
            }
        ]
    }
```
