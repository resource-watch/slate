# Subscriptions

When communicating with the Subscriptions microservice from other microservices, you have access to special actions that are not available when using the public API. This section concerns subscriptions endpoints that offer special functionality when handling requests from other microservices.

## Creating a subscription for another user

> Creating a subscription for user with ID 123 - only works when called by other MS!

```shell
curl -X POST https://api.resourcewatch.org/v1/subscriptions \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
    "name": "<name>",
    "datasets": ["<dataset>"],
    "params": { "geostore": "35a6d982388ee5c4e141c2bceac3fb72" },
    "datasetsQuery": [
        {
            "id": ":subscription_dataset_id",
            "type": "test_subscription",
            "threshold": 1
        }
    ],
    "application": "rw",
    "language": "en",
    "env": <environment>,
    "resource": { "type": "EMAIL", "content": "email@address.com" },
    "userId": "123"
}'
```

You can create a subscription for another user by providing the user id in the body of the request.

This can only be done when performing requests from another microservice.

Field         |                            Description                            |               Type | Required
------------- | :---------------------------------------------------------------: | -----------------: |-----------:
userId        | Id of the owner of the subscription - if not provided, it's set as the id of the user in the token. | String | No


## Updating a subscription for another user

If the request comes from another microservice, then it is possible to modify subscriptions belonging to other users. Otherwise, you can only modify subscriptions if you are the owner of the subscription.

The following fields are available to be provided when modifying a subscription:

Field         |                            Description                            |               Type | Required
------------- | :---------------------------------------------------------------: | -----------------: |-----------:
userId        | [Check here for more info](/developer.html#updating-a-subscription-for-another-user) | String | No


## Finding subscriptions by ids

```shell
curl -X POST https://api.resourcewatch.org/v1/subscriptions/find-by-ids \
-H "Authorization: Bearer <your-token>"
-H "Content-Type: application/json"  -d \
 '{ "ids": ["5e4d273dce77c53768bc24f9"] }'
```

> Example response:

```json

{
    "data": [
        {
            "type": "subscription",
            "id": "5e4d273dce77c53768bc24f9",
            "attributes": {
                "createdAt": "2020-02-19T12:17:01.176Z",
                "userId": "5e2f0eaf9de40a6c87dd9b7d",
                "resource": {
                    "type": "EMAIL",
                    "content": "henrique.pacheco@vizzuality.com"
                },
                "datasets": [
                    "20cc5eca-8c63-4c41-8e8e-134dcf1e6d76"
                ],
                "params": {},
                "confirmed": false,
                "language": "en",
                "datasetsQuery": [
                    {
                        "threshold": 1,
                        "lastSentDate": "2020-02-19T12:17:01.175Z",
                        "historical": [],
                        "id": "20cc5eca-8c63-4c41-8e8e-134dcf1e6d76",
                        "type": "COUNT"
                    }
                ],
                "env": "production"
            }
        }
    ]
}
```

You can find a set of subscriptions given their ids using the following endpoint.

## Finding subscriptions for a given user

```shell
curl -X POST https://api.resourcewatch.org/v1/subscriptions/user/5e2f0eaf9de40a6c87dd9b7d \
-H "Authorization: Bearer <your-token>"
```

> Example response:

```json

{
    "data": [
        {
            "type": "subscription",
            "id": "5e4d273dce77c53768bc24f9",
            "attributes": {
                "createdAt": "2020-02-19T12:17:01.176Z",
                "userId": "5e2f0eaf9de40a6c87dd9b7d",
                "resource": {
                    "type": "EMAIL",
                    "content": "henrique.pacheco@vizzuality.com"
                },
                "datasets": [
                    "20cc5eca-8c63-4c41-8e8e-134dcf1e6d76"
                ],
                "params": {},
                "confirmed": false,
                "language": "en",
                "datasetsQuery": [
                    {
                        "threshold": 1,
                        "lastSentDate": "2020-02-19T12:17:01.175Z",
                        "historical": [],
                        "id": "20cc5eca-8c63-4c41-8e8e-134dcf1e6d76",
                        "type": "COUNT"
                    }
                ],
                "env": "production"
            }
        }
    ]
}
```

You can find all the subscriptions associated with a given user id using the following endpoint.

This endpoint supports the following optional query parameters as filters:

Field       |             Description                              |   Type |
----------- | :--------------------------------------------------: | -----: |
application | Application to which the subscription is associated. | String |
env         | Environment to which the subscription is associated. | String |
