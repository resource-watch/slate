# User Management

When communicating with the Authorization microservice from other microservices, you have access to additional endpoints that are not available when using the public API. This section details these endpoints.


## Finding users by ids

```shell
curl -X POST https://api.resourcewatch.org/auth/user/find-by-ids \
-H "Authorization: Bearer <your-token>"
-H "Content-Type: application/json"  -d \
 '{ "ids": ["5e4d273dce77c53768bc24f9"] }'
```

> Example response:

```json

{
    "data": [
        {
            "id": "5e4d273dce77c53768bc24f9",
            "_id": "5e4d273dce77c53768bc24f9",
            "email": "your@email.com",
            "name": "",
            "createdAt": "2021-03-24T09:19:25.000Z",
            "updatedAt": "2021-03-26T09:54:08.000Z",
            "role": "USER",
            "provider": "local",
            "extraUserData": { "apps": ["gfw"] }
        }
    ]
}
```

You can find a set of users given their ids using the following endpoint. The ids of the users to find should be provided in the `ids` field of the request body.

Please keep in mind that, under the hood, user management relies on Okta - for this reason, this endpoint depends on Okta's user search functionalities to find users by ids, and thus, inherits Okta's limitations. Okta limits user search at a maximum of 200 users per request, so in practice, this means we can only fetch pages of 200 users at a time. If you try to find, for instance, 400 users by ids, 2 requests will need to be made to Okta to fulfill this request, and as such, the performance of this endpoint might be degraded.

**Due to these limitations, we advise only resort to this endpoint when you have no other valid alternative to find users. Even in that case, you might run into slow response times or, ultimately, not receiving the expected results when calling this endpoint.**

## Finding user ids by role

> Request structure to find user ids by role:

```shell
curl -X GET https://api.resourcewatch.org/auth/user/ids/:role \
-H "Authorization: Bearer <your-token>"
```

> Example request to find user ids of ADMIN users:

```shell
curl -X GET https://api.resourcewatch.org/auth/user/ids/ADMIN \
-H "Authorization: Bearer <your-token>"
```

> Example response:

```json

{
    "data": [
        "5e4d273dce77c53768bc24f9",
        "5e4d273dce77c53768bc24f8",
        "5e4d273dce77c53768bc24f7",
        "5e4d273dce77c53768bc24f6",
        "5e4d273dce77c53768bc24f5",
        "5e4d273dce77c53768bc24f4",
        "5e4d273dce77c53768bc24f3"
    ]
}
```

You can find the ids of the users for a given role using the following endpoint. Valid roles include "USER", "MANAGER" and "ADMIN". The response includes the array of ids matching the role provided in the `data` field.

Please keep in mind that, under the hood, user management relies on Okta - for this reason, this endpoint depends on Okta's user search functionalities to find users by role, and thus, inherits Okta's limitations. Okta limits user search at a maximum of 200 users per request, so in practice, this means we can only fetch pages of 200 users at a time. If you try to find, for instance, users for the "USER" role, since there's a high number of "USER" users, many requests will have to be made to Okta to fulfill this request. As such, the performance of this endpoint might be degraded.

**Due to these limitations, we advise only resort to this endpoint when you have no other valid alternative to find users. Even in that case, you might run into slow response times or, ultimately, not receiving the expected results when calling this endpoint.**

Also, please note that existing endpoints may rely on this endpoint to be able to fulfill their requests. This is the case of sorting or filtering datasets/widgets/layers by user role, for instance. As such, the performance of these endpoints may also be affected by the degradation of performance of this endpoint. 
