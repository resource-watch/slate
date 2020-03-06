# Subscriptions

When communicating with the Subscriptions MS making requests from other MSs, you might bump into the need of managing other users subscriptions. This section concerns the usage of subscriptions by making requests from other MSs.

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

You can create a subscription for another user providing the user id in the body of the request.

This can only be done when performing requests from another microservice.

Field         |                            Description                            |               Type | Required
------------- | :---------------------------------------------------------------: | -----------------: |-----------:
userId        | Id of the owner of the subscription - if not provided, it's set as the id of the user in the token. | String | No

## Updating a subscription for another user

If the request comes from another micro service, then it is possible to modify subscriptions belonging to other users. Otherwise, you can only modify subscriptions if you are the owner of the subscription.
