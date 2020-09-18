# Areas v2 Notification Emails

Areas v2 services rely on email notifications to update users about the status of their areas. Specifically, when creating an area, updating an area, or when an ADMIN updates multiple areas by their geostore ids:

* If the area has status `pending`, an email is sent to let the user know the area of interest is being generated and will be available later.
* If the area has status `saved`, an email is sent to let the user know the area of interest is ready to be viewed.

## Interacting with Sparkpost for building email templates

Emails are sent using [the Sparkpost API](https://www.sparkpost.com/). For the emails to be sent, there must exist templates in Sparkpost ready to be sent, taking into account the different languages supported by the Areas service:

For the email sent to users when the Area of Interest is ready to be viewed, there should exist the following email templates on Sparkpost:

* `dashboard-complete-zh` (Mandarin)
* `dashboard-complete-pt-br` (Brazilian Portuguese)
* `dashboard-complete-id` (Indonesian)
* `dashboard-complete-fr` (French)
* `dashboard-complete-es-mx` (Spanish)
* `dashboard-complete-en` (English)

For the email sent to users when the Area of Interest is being generated, there should exist the following email templates on Sparkpost:

* `dashboard-pending-zh` (Mandarin)
* `dashboard-pending-pt-br` (Brazilian Portuguese)
* `dashboard-pending-id` (Indonesian)
* `dashboard-pending-fr` (French)
* `dashboard-pending-es-mx` (Spanish)
* `dashboard-pending-en` (English)

In order to build your templates on Sparkpost, you need to have access to WRI's Sparkpost account - for that, please reach out to a member of WRI in order to be granted access. 

When building the actual templates, you can use variable interpolation to customize the emails sent taking into account the area that is being processed/has been processed. While building the `dashboard-pending-*` or `dashboard-complete-*` emails, the following variables are provided and can be used in the construction of the email body:

* `id` : the ID of the area.
* `name` : the name of the area.
* `location` : an alias for the name of the area (contains the same as the `name` parameter).
* `subscriptions_url` : the URL for managing areas of interest in the flagship application (example: [https://globalforestwatch.org/my-gfw](https://globalforestwatch.org/my-gfw)).
* `dashboard_link` : the URL for the area dashboard (example: [https://globalforestwatch.org/dashboards/aoi/:areaId](https://globalforestwatch.org/dashboards/aoi/:areaId)).
* `map_link` : the "view on map" URL for this area (example: [https://globalforestwatch.org/map/aoi/:areaId](https://globalforestwatch.org/map/aoi/:areaId)).
* `image_url` : the URL for the image associated with the area.
* `tags` : a string containing the AOI tags, comma-separated.