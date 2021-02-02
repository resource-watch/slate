## Widget

You have fetched your data from your [dataset](/reference.html#dataset) using [queries](/reference.html#query). And you know how to build custom visualizations for geospatial data using [layers](/reference.html#layer). Yet, sometimes you want to build a plain graphical representation of your data - whether it is geo-referenced or not: this is when **widgets** come in handy.

A **widget** is a visual specification of how to style and render the data of a dataset (think pie, bar or line charts).

As with layers, each widget has a single dataset associated with it, and a dataset can be associated with many widgets. You can represent the same data in different ways by creating different widgets for the same dataset. The same widget can store independent configuration values for each RW API based application. It can also contain the required configuration for rendering the same visualization using different rendering tools.

However, this association between widgets and datasets is only for organizational purposes. As such, like in the case of layers, the widget itself does not interact with the dataset data. You can either use the widget's `queryUrl` field to store the query to get the widget's data or store it inside the free form `widgetConfig` object. In any of these cases, it is your responsibility as an API user to query the data that will be used for rendering the widget.

In the [widget endpoint documentation](/reference.html#widget), you can get into more detail on how you can manage widgets.

### Widget configuration using Vega grammar

As in the case of layers (where many fields are free-form), the RW API does not apply any restriction to the data saved in the widget configuration field (`widgetConfig`). This allows for a very high level of flexibility for users but has the downside of making it harder to document how to use widgets.

However, the existing widgets' standard approach for building widget configuration objects is using [Vega grammar](https://github.com/vega/vega). Vega is a visualization grammar, a declarative format for creating interactive visualization designs. You can then use a chart library that supports Vega grammar syntax (such as [d3.js](https://d3js.org/)) to render the widget and get your graphical representation.

Please note that, in any case, you can use whatever configuration format you wish since the `widgetConfig` field is free-form.
