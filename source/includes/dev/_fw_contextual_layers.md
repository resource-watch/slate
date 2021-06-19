# Forest Watcher Contextual layers

## Updating the Tree Cover Loss data

The [FW Contextual layers microservice](https://github.com/gfw-api/fw-contextual-layers) serves tree cover loss (TCL) data in tile format through one of its endpoints. The underlying dataset that is used to create these tiles is updated regularly - typically once a year - through a process that requires minor modifications to the configuration of the service. Below we'll outline the steps to carry out this update

### Update the Tree Cover Loss layer URL

The first step is updating the source code of the Contextual layers microservice - specifically [this line](https://github.com/gfw-api/fw-contextual-layers/blob/a8442da2c7a4e68625867479860c0185f35488a8/config/default.json#L17) - and setting the updated URL for the updated dataset containing the tree cover loss data. This updated dataset will be used as a replacement of the previous one. On the more common scenario of the yearly updates to the TCL data, this means that the new dataset should have the data for all previously existing years, plus the newly added year.

Once you've done this, be sure to follow the [Microservice development guide](#microservice-development-guide) to test and deploy your changes to all relevant live environments.

### Creating/updating a FW contextual layer

At this stage, the FW Contextual layers is already capable of serving the updated data through the [tile endpoint](/reference.html#getting-loss-layer-tiles). However, the Contextual layers microservice also has a built-in layer listing mechanism, which you may want to update, for the convenience of end users. You can learn more about it in the [FW Contextual layers endpoint documentation section](/reference.html#contextual-layers).

> Example request to add a new contextual layer

```shell
curl -X POST https://api.resourcewatch.org/v1/contextual-layer \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json" -d \
'{
    "isPublic": true,
    "name": "Tree Cover Loss (2019)",
    "url": "https://api.resourcewatch.org/contextual-layer/loss-layer/2018/2019/{z}/{x}/{y}.png",
    "enabled": true
}'
```

In the scenario where you are updating the TCL layer to add a new year of data, you typically want to add a new contextual layer to the list of existing ones, so it shows up in future listings of layers used by client applications (and thus becomes available to end users through client UIs). To do so, you should use the [Create contextual layer endpoint](/reference.html#creating-a-contextual-layer-for-a-team) with a payload similar to the example on the side. The example above illustrates how you would add new data for the 2019 year - be sure to adjust the layer name and URL to match your needs.
