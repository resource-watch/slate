# Contact

The following contact endpoints are available


## Contact us

Sends a contact form including a topic, email address, and a message. 

```shell
curl -X POST https://api.resourcewatch.org/v1/area?application=<application>
-H "Authorization: Bearer <your-token>"
```

### Example

Contact form sent using the type `General question or feedback`, the email address `example@example.com` and the message `This is a text`:

```shell
curl -X POST https://api.resourcewatch.org/v1/contact-us
-d '{
        "topic": "General question or feedback",
        "email": "example.example@vizzuality.com",
        "text": "This is a test"
    }'
```