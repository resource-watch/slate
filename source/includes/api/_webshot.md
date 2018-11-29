# Webshot

The webshot set of endpoints allows you to capture a given page as a document file, that can then be used, for example, as a preview thumbnail.

<aside class="notice">
This process is computational demanding and may be slow at times, depeding on server load and complexity of the page being rendered. Avoid making consecutive or batch requests to these endpoint, and allow enough time for them to process. 
</aside>

This service has two endpoints:

### PDF

This endpoint expects a URL as a query parameter and generates a pdf containing a rendered version of that page: 

```
curl -X GET \
  'http://api.resourcewatch.org/v1/webshot/pdf?url=http://google.com&filename=my-google-screenshoz.pdf' \
  -H 'Authorization: Bearer <your-token>' \
  -H 'Content-Type: application/json' \
```

### Widget

This endpoint generates a thumbnail image for the provided widget and stores it on AWS S3.

<aside class="notice">
This endpoint does not validate the existence of the widget - you will not get a 404 HTTP error if you provided a non-existent widget id. 
</aside>

```
curl -X POST \
  http://localhost:9000/v1/webshot/widget/7b540186-9a9f-4e13-a6e8-f38e64fab2e1/thumbnail \
  -H 'Authorization: Bearer <your-token>' \
  -H 'Content-Type: application/json' \
```

```json
{
    "data": {
        "widgetThumbnail": "http://s3.amazonaws.com/resourcewatch/thumbnails/<filename>.png"
    }
}
```

This endpoint accepts two optional query parameters, `height` and `width`, that configure the size of the generated screenshot. Keep in mind that this endpoint works by rendering the `https://resourcewatch.org/embed/widget/<widget id>` URL with those dimensions applied to the viewport, and then captures the content of the `.widget-content` DOM element into an image file. As such, the resulting screenshot will have the proportional size of the corresponding DOM element within that viewport, and not the exact `height` and `width` specified.
