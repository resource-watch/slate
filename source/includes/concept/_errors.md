## Errors

The following error codes are used across the API. Each endpoint also documents resource-specific error codes and associated messages in the [reference docs](reference.html).

Error Code | Meaning
---------- | -------
400 | Bad Request -- Your request is incomplete or contains errors.
401 | Unauthorized -- Your JWT is missing or out of date.
403 | Forbidden -- You do not have permission to access this resource.
404 | Not Found -- The resource requested could not be found.
409 | Conflict -- The resource requested is currently locked and cannot be edited.
422 | Unprocessable -- The request cannot be processed. Certain required fields may be missing or incorrect.
500 | Internal Server Error -- The server encountered an error while processing your request. Try again later.
