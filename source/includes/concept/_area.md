## Area of Interest

Areas of interest are custom polygons representative of geographical regions that API users may have a particular interest on. Users can define their own custom Areas of Interest or select from predefined areas supported by the API, and can subscribe to deforestation alerts [(GLAD alerts)](https://www.globalforestwatch.org/howto/webinars/webinar-glad-alerts.html) or fire alerts [(VIIRS alerts)](https://data.globalforestwatch.org/datasets/9ebf069428b140d59fc796fef2e1faa8) that happen inside those areas. Areas of interest can be managed using the endpoints provided by the [Areas service](reference.html#areas-v2), while the subscription logic of notifying API users is handled by the [Subscriptions service](reference.html#subscriptions). Your areas of interest can also be managed by accessing your [MyGFW](https://www.globalforestwatch.org/my-gfw/) account on the Global Forest Watch website.

### Email and webhook notifications

While creating an area, you have the option to subscribe to deforestation alerts (GLAD alerts), fire alerts (VIIRS fire alerts) and/or a monthly summary of both GLAD and VIIRS alerts in the area of interest defined. Each notification also has the option of being received by the API user as an email or a POST to a webhook URL.

* GLAD notifications are sent daily, starting after 10:00 AM (EST - Eastern Time).
* VIIRS notifications are sent daily, starting after 7:00 AM (EST - Eastern Time).
* Monthly summary notifications are sent monthly, starting after 11:00 AM (EST - Eastern Time) of the first day of every month.

### Different ways of defining areas of interest

Areas of interest can be defined in one of four ways. Keep in mind that all of these different methods of creating areas can also be used while logged in with your account on the [Global Forest Watch website](https://www.globalforestwatch.org/):

* by referencing a country, one of its regions, or a subregion within a region - countries are identified by their [ISO 3166-1 alpha-3 code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3), and regions and subregions are identified by their respective GADM id, which can be obtained from [the GADM dataset](https://gadm.org/data.html).
* by referencing a specific protected area by the id of that area in the [World Database on Protected Areas (WDPA)](https://www.protectedplanet.net/).
* by referencing the ID and type of a land use area provided by different datasets - currently, the following land use datasets are supported: 
    * **mining** for [mining areas](http://api.resourcewatch.org/v1/dataset/c2142922-84d9-4564-8216-a4867b9e48c5).
    * **logging** for [Congo Basin logging roads](https://wri-01.carto.com/tables/gfw_oil_palm/public/map). 
    * **oilpalm** for [palm oil plantations](https://wri-01.carto.com/tables/gfw_woodfiber/public/map).
    * **fiber** for [wood fiber plantations](https://wri-01.carto.com/tables/osm_logging_roads/public/map).
* by creating a specific [geostore](concepts.html#geostore) using the [geostore endpoint](reference.html#create-a-geostore-object), and using its ID.

Read more on how to create areas using the different methods in the [Areas v2 endpoints](reference.html#creating-an-area) section.
