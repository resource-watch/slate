# Widget

## Cloning widgets from other microservices

```shell
curl -X POST "https://api.resourcewatch.org/v1/widget/<widget_id_or_slug>/clone" \
-H "Authorization: Bearer <microservice-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "userId": "123456789",
}'
```

Before proceeding, please review the [cloning a widget](https://resource-watch.github.io/doc-api/index-rw.html#cloning-a-widget) documentation, as this section covers a special case that builds on top of the functionality described in it.

When cloning a widget, the newly created clone will take the `userId` of the user who issued the clone request. If you call this endpoint directly as a "real" authenticated user, that means it will get that authenticated user's `userId`. 

However, if invoked by another API microservice, the widget microservice will not have access to the token of the user, and will instead receive the internal "microservice" token. In this scenario, you should pass a `userÌd` body value that will be set as the `userId` of the newly created widget. If you do not pass this parameter, the widget will inherit the user id of the internal token. 

Note that the `userId` provided in the clone request body will not be validated - it's up to the microservice issuing the clone request to ensure it's correct.

