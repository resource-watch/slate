# API Smoke Tests

This chapter covers the existing API Smoke Tests, including instructions on how to manage existing tests and create new ones.

The API Smoke Tests are implemented using Canaries provided by AWS Synthetics [(docs here)](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html).

## Template for smoke tests

> Template for an AWS Synthetics Canary

```javascript
const synthetics = require('Synthetics');
const log = require('SyntheticsLogger');
const AWS = require('aws-sdk');
const https = require('https');
const http = require('http');

const apiCanaryBlueprint = async function () {

  const verifyRequest = async function (requestOption, body = null) {
    return new Promise((resolve, reject) => {
      // Prep request
      log.info("Making request with options: " + JSON.stringify(requestOption));
      let req = (requestOption.port === 443) ? https.request(requestOption) : http.request(requestOption);

      // POST body data
      if (body) { req.write(JSON.stringify(body)); }

      // Handle response
      req.on('response', (res) => {
        log.info(`Status Code: ${res.statusCode}`)

        // Assert the status code returned
        if (res.statusCode !== 200) {
          reject("Failed: " + requestOption.path + " with status code " + res.statusCode);
        }

        // Grab body chunks and piece returned body together
        let body = '';
        res.on('data', (chunk) => { body += chunk.toString(); });

        // Resolve providing the returned body
        res.on('end', () => resolve(JSON.parse(body)));
      });

      // Reject on error
      req.on('error', (error) => reject(error));
      req.end();
    });
  }

  // Build request options
  let requestOptions = {
    hostname: "api.resourcewatch.org",
    method: "GET",
    path: "/v1/dataset",
    port: 443,
    headers: {
      'User-Agent': synthetics.getCanaryUserAgentString(),
      'Content-Type': 'application/json',
    },
  };

  // Find and use secret for auth token
  const secretsManager = new AWS.SecretsManager();
  await secretsManager.getSecretValue({ SecretId: "gfw-api/token" }, function(err, data) {
    if (err) log.info(err, err.stack);
    log.info(data);
    requestOptions.headers['Authorization'] = "Bearer " + JSON.parse(data["SecretString"])["token"];
  }).promise();

  // Find and use secret for hostname
  await secretsManager.getSecretValue({ SecretId: "wri-api/smoke-tests-host" }, function(err, data) {
    if (err) log.info(err, err.stack);
    log.info(data);
    requestOptions.hostname = JSON.parse(data["SecretString"])["smoke-tests-host"];
  }).promise();

  const body = await verifyRequest(requestOptions);
  const id = body.data[0].id;

  // Change needed request options
  requestOptions.method = "GET";
  requestOptions.path = "/v1/dataset/"+id;

  // Make second request
  await verifyRequest(requestOptions);
};

exports.handler = async () => {
  return await apiCanaryBlueprint();
};
```

New tests should be based on the template displayed on the side, in order to take advantage of the configurations already in place.

Tests can execute multiple requests, but please minimize the number of interactions with databases to avoid creating junk data (for this reason, smoke testing POST, PATCH and DELETE endpoints is not recommended).

Another thing to notice is the usage of AWS secrets for storing a token to execute the request (`gfw-api/token`), as well as the hostname where the test will be executed (`wri-api/smoke-tests-host`).

The template on the side executes a GET request to `/v1/dataset`, grabs the first ID in the response data and executes a second GET request to the `/v1/dataset/:id` endpoint.

*The test will pass if there are no exceptions thrown or promise rejections during the execution of the test. For the example on the side, the test will fail if any of the requests performed returns a status code that is not 200.*

## Things to pay attention

### Use a user to run the tests

Please ensure that all tests are ran using a token for a user **which was specifically created for running the tests**. Also, it goes without saying, please don't share either the token or the credentials for the user running the tests with anyone.

### Always configure alarms for the smoke tests

Smoke tests by default are created without an associated alarm. When managing or creating smoke tests, **please ensure that each test has a unique alarm associated to it**.

Also, **please ensure that the created alarm has an action defined to notify someone in case of failure of a test**.
