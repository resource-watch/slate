## Environments

Certain RW API resources, like datasets, layers, or widgets, use the concept of `environment` (also called `env`) as a way to help you manage your data's lifecycle. The main goal of `environments` is to give you an easy way to separate data that is ready to be used in production-grade interactions from data that is still being improved on.

When you create a new resource, like a dataset, it's given the `production` env value by default. Similarly, if you list datasets, there's an implicit default filter that only returns datasets whose `env` value is `production`. This illustrates two key concepts of `environments`:

- By default, when you create data on the RW API, it assumes it's in a production-ready state.
- By default, when you list resources from the RW API, it assumes you want only to see production-ready data.

However, you may want to modify this behavior. For example, let's say you want to create a new widget on the RW API and experiment with different configuration options without displaying it publicly. To achieve this, you can set a different `environment` on your widget - for example, `test`. Or you may want to deploy a staging version of your application that also relies on the same RW API but displays a different set of resources. You can set those resources to use the `staging` environment and have your application load only that environment, or load both `production` and `staging` resources simultaneously. Keep in mind that `production` is the only "special" value for the `environment` field. Apart from it, the `environment` can take any value you want, without having any undesired side-effects.

Resources that use `environment` can also be updated with a new `environment` value, so you can use it to control how your data is displayed. Refer to the documentation of each resource to learn how you can achieve this.

It's worth pointing out that endpoints that retrieve a resource by id typically don't filter by `environment` - mostly only listing endpoints have different behavior depending on the requested `environment` value. Also worth noting is that this behavior may differ from resource to resource, and you should always refer to each endpoint's documentation for more details.

### Which services comply with these guidelines

* [Dataset](reference.html#dataset)
* [Graph](reference.html#graph)
* [Layer](reference.html#layer)
* [Subscriptions](reference.html#subscriptions)
* [Widgets](reference.html#widget)