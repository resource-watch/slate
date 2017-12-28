# Widget

## What is a Widget?

A widget is a graphic representation of a Dataset's data. Most of them are defined with [Vega grammar](#what-is-vega) but we can also find other custom definitions. Here are the [RW widgets definitions](https://github.com/resource-watch/notebooks/blob/develop/ResourceWatch/Api_definition/widget_definition.ipynb).

Widgets contain the following fields:

Field        |                         Description                          |    Type
------------ | :----------------------------------------------------------: | ------:
userId       |                       Id of the owner                        |    Text
application  |           Application to which the dataset belongs           |   Array
slug         |               Unique identifier of the widget                |    Text
name         |                      Name of the widget                      |     Url
description  |                  Description of the widget                   |   Array
source       |                Publisher of the original code                |    Text
sourceUrl    |                    Link to publisher page                    |     Url
layerId      |             UuId of the relationship with layer              |  String
dataset      |         UuId of the dataset that the widget belongs          |    Text
authors      |                     Name of the authors                      |    Text
queryUrl     |             Url with the data of the chart shows             |    Text
widgetConfig |                     Custom configuration                     |  Object
template     |   If it's a template (base schema to create other widgets)   | Boolean
default      |   If it's a default widget for the dataset that it belongs   | Boolean
protected    |  If it's a protected widget (not is possible to delete if it's true)   | Boolean
status       |                     Status of the Widget                     |    Text
published    |                   If it's available to use                   |    Text
freeze       |                   If the data is freezed                     |    Boolean
verified     |                If it's verified by other user                |    Text
env          |  Environment can be one of `production` or `preproduction`   |    Text

### What is Vega?

Vega is a visualization grammar; a declarative format for creating, saving and sharing interactive visualization designs. This wiki contains documentation and learning materials for getting up and running with Vega. [More info](https://github.com/vega/vega/wiki)

## How obtain all widgets

To obtain all widgets:

```shell
curl -X GET https://api.resourcewatch.org/v1/widget
```

<aside class="success">
Remember — the response is jsonapi format
</aside>

> Example response:

```json
{
   "data":[
      {
         "id":"8f67fadd-d8df-4a28-82dd-a22a337d71b9",
         "type":"widget",
         "attributes":{
            "userId":"5858f37140621f11066fb2f7",
            "application":[
               "aqueduct"
            ],
            "slug":"percentage-of-country-s-population-is-at-high-risk-of-hunger",
            "name":"Percentage of country's population at high risk of hunger.",
            "description":"",
            "source":"",
            "sourceUrl":"",
            "layerId":null,
            "dataset":"f1d24950-c764-4f90-950a-4541f798eb95",
            "authors":"",
            "queryUrl":"query/f1d24950-c764-4f90-950a-4541f798eb95?sql=select * from crops",
            "widgetConfig":{
                ...
            },
            "template":false,
            "default":true,
            "status":"saved",
            "published":true,
            "freeze": false,
            "verified":false
         }
      }
   ],
   "links":{
      "first":"https://api.resourcewatch.org/v1/widget?page%5Bnumber%5D=1",
      "prev":"https://api.resourcewatch.org/v1/widget?page%5Bnumber%5D=1",
      "next":"https://api.resourcewatch.org/v1/widget?page%5Bnumber%5D=2&page%5Bsize%5D=10",
      "last":"https://api.resourcewatch.org/v1/widget?page%5Bnumber%5D=64&page%5Bsize%5D=10",
      "self":"https://api.resourcewatch.org/v1/widget?page%5Bnumber%5D=1&page%5Bsize%5D=10"
   },
   "meta": {
      "total-pages": 38,
      "total-items": 372,
      "size": 10
   }
}
```

### Filter params

Available filters:

Field     |                         Description                          |    Type
--------- | :----------------------------------------------------------: | ------:
name      |    Filter the widgets whose name contains the filter text    |    Text
dataset   |              Filter the widgets by dataset uuid              |    Text
sort      |          Sort json response by specific attributes           |    Text
status    |    Filter widgets on status (pending, saved, failed, all)    |    Text
published |       Filter widgets on published status (true, false)       | Boolean
published |       Filter widgets on freeze status (true, false)          | Boolean
verified  |           Filter by verified status (true, false)            | Boolean
template  |           Filter by template status (true, false)            | Boolean
default   |            Filter by default status (true, false)            | Boolean
app       |       Filter widgets on application (prep, gfw, etc..)       |    Text
env       |   Environment can be one of `production` or `preproduction`  |    Text

> Return the widgets filtered whose name contains glad

```shell
curl -X GET https://api.resourcewatch.org/v1/widget?name=glad
```

> Return the widgets filtered by dataset

```shell
curl -X GET https://api.resourcewatch.org/v1/widget?dataset=d02df2f6-d80c-4274-bb6f-f062061655c4
curl -X GET https://api.resourcewatch.org/v1/dataset/d02df2f6-d80c-4274-bb6f-f062061655c4/widget
```

> Sort by name

```shell
curl -X GET https://api.resourcewatch.org/v1/widget?sort=name
```

> Filter widgets by status

```shell
curl -X GET https://api.resourcewatch.org/v1/widget?status=failed
```

> Filter widgets by published status

```shell
curl -X GET https://api.resourcewatch.org/v1/widget?published=false
```

> Filter widgets by verified status

```shell
curl -X GET https://api.resourcewatch.org/v1/widget?verified=false
```

> Return the widgets filtered by template

```shell
curl -X GET https://api.resourcewatch.org/v1/widget?template=true
```

> Filter widgets by default option

```shell
curl -X GET https://api.resourcewatch.org/v1/widget?default=true
```

> Return widgets whose applications contain rw

```shell
curl -X GET https://api.resourcewatch.org/v1/widget?app=rw
```

### Pagination params

Field        |       Description        |   Type
------------ | :----------------------: | -----:
page[size]   | Number elements per page | Number
page[number] |      Number of page      | Number

> Return the widgets from page 2, with 5 elements per page

```shell
curl -X GET https://api.resourcewatch.org/v1/widget?page[size]=5&page[number]=2
```

## How obtain a widget for a specific dataset

To obtain the widget:

```shell
curl -X GET https://api.resourcewatch.org/v1/dataset/d02df2f6-d80c-4274-bb6f-f062061655c4/widget/20ec7861-5251-40a7-9503-5ee3686a66a3
curl -X GET https://api.resourcewatch.org/v1/widget/20ec7861-5251-40a7-9503-5ee3686a66a3
```

<aside class="success">
Remember — the response is jsonapi format
</aside>

> Example response:

```json
{
  "data": {
    "id": "20ec7861-5251-40a7-9503-5ee3686a66a3",
    "type": "widget",
    "attributes": {
      "userId": "57a0693b49c36b265ba3bec8",
      "application": [
        "rw"
      ],
      "slug": "estimated-c02-emission",
      "name": "Estimated C02 emission",
      "description": null,
      "source": "",
      "sourceUrl": null,
      "layerId": null,
      "dataset": "d02df2f6-d80c-4274-bb6f-f062061655c4",
      "authors": null,
      "queryUrl": "query/d02df2f6-d80c-4274-bb6f-f062061655c4?sql=select country, rank, iso3, total from estimated_co2_emission_filtered",
      "widgetConfig": {
        "data": [
          {
            "name": "table",
            "values": [],
            "transform": [
              {
                "by": "rank",
                "type": "sort"
              }
            ]
          },
          {
            "name": "current",
            "source": "table",
            "transform": [
              {
                "test": "datum.iso3 === 'CHN'",
                "type": "filter"
              },
              {
                "expr": "datum.rank",
                "type": "formula",
                "field": "current_rank"
              }
            ]
          },
          {
            "name": "max",
            "source": "table",
            "transform": [
              {
                "type": "aggregate",
                "summarize": {
                  "rank": [
                    "max"
                  ]
                }
              }
            ]
          },
          {
            "name": "head",
            "source": "table",
            "transform": [
              {
                "type": "cross",
                "with": "current"
              },
              {
                "test": "datum.b.current_rank <= 5 ? datum.a.rank <= 5 : datum.a.rank === 1",
                "type": "filter"
              },
              {
                "expr": "datum.a.rank === datum.b.current_rank ? '#5BB1D2' : '#9aa2a9'",
                "type": "formula",
                "field": "color"
              },
              {
                "expr": "datum.a.rank === datum.b.current_rank ? '500' : '300'",
                "type": "formula",
                "field": "weight"
              }
            ]
          },
          {
            "name": "head_count",
            "source": "head",
            "transform": [
              {
                "type": "aggregate",
                "summarize": {
                  "*": "count"
                }
              }
            ]
          },
          {
            "name": "center",
            "source": "table",
            "transform": [
              {
                "type": "cross",
                "with": "current"
              },
              {
                "type": "cross",
                "with": "max"
              },
              {
                "test": "datum.a.b.current_rank > 5 && datum.a.b.current_rank < datum.b.max_rank - 5 ? datum.a.a.rank >= datum.a.b.current_rank - 2 && datum.a.a.rank <= datum.a.b.current_rank + 2  : false",
                "type": "filter"
              },
              {
                "expr": "datum.a.a.rank === datum.a.b.current_rank ? '#5BB1D2' : '#9aa2a9'",
                "type": "formula",
                "field": "color"
              },
              {
                "expr": "datum.a.a.rank === datum.a.b.current_rank ? '500' : '300'",
                "type": "formula",
                "field": "weight"
              }
            ]
          },
          {
            "name": "center_count",
            "source": "center",
            "transform": [
              {
                "type": "aggregate",
                "summarize": {
                  "*": "count"
                }
              }
            ]
          },
          {
            "name": "tail",
            "source": "table",
            "transform": [
              {
                "type": "cross",
                "with": "current"
              },
              {
                "type": "cross",
                "with": "max"
              },
              {
                "test": "datum.a.b.current_rank >= datum.b.max_rank - 4 ? datum.a.a.rank >= datum.b.max_rank - 4 : datum.a.a.rank === datum.b.max_rank",
                "type": "filter"
              },
              {
                "expr": "datum.a.a.rank === datum.a.b.current_rank ? '#5BB1D2' : '#9aa2a9'",
                "type": "formula",
                "field": "color"
              },
              {
                "expr": "datum.a.b.current_rank <= 5 || datum.a.b.current_rank >= datum.b.max_rank - 4 ? datum.color : 'transparent'",
                "type": "formula",
                "field": "trick_color"
              },
              {
                "expr": "datum.a.b.current_rank <= 5 || datum.a.b.current_rank >= datum.b.max_rank - 4 ? '#9aa2a9' : 'transparent'",
                "type": "formula",
                "field": "rule_trick_color"
              },
              {
                "expr": "datum.a.a.rank === datum.a.b.current_rank ? '500' : '300'",
                "type": "formula",
                "field": "weight"
              }
            ]
          }
        ],
        "marks": [
          {
            "from": {
              "data": "head"
            },
            "type": "text",
            "properties": {
              "enter": {
                "x": {
                  "value": 20
                },
                "y": {
                  "field": "a.rank",
                  "scale": "vertical_head"
                },
                "fill": {
                  "field": "color"
                },
                "text": {
                  "template": "{{datum.a.rank}}"
                },
                "align": {
                  "value": "right"
                },
                "baseline": {
                  "value": "middle"
                },
                "fontSize": {
                  "value": 13
                },
                "fontWeight": {
                  "field": "weight"
                }
              }
            }
          },
          {
            "from": {
              "data": "head"
            },
            "type": "text",
            "properties": {
              "enter": {
                "x": {
                  "value": 30
                },
                "y": {
                  "field": "a.rank",
                  "scale": "vertical_head"
                },
                "fill": {
                  "field": "color"
                },
                "text": {
                  "template": "{{datum.a.country | truncate:10}}"
                },
                "align": {
                  "value": "left"
                },
                "baseline": {
                  "value": "middle"
                },
                "fontSize": {
                  "value": 13
                },
                "fontWeight": {
                  "field": "weight"
                }
              }
            }
          },
          {
            "from": {
              "data": "head"
            },
            "type": "rect",
            "properties": {
              "enter": {
                "x": {
                  "mult": 0.5,
                  "field": {
                    "group": "width"
                  }
                },
                "y": {
                  "field": "a.rank",
                  "scale": "vertical_head",
                  "offset": -6
                },
                "fill": {
                  "field": "color"
                },
                "width": {
                  "mult": 0.5,
                  "field": "a.total",
                  "scale": "bar"
                },
                "height": {
                  "value": 12
                }
              }
            }
          },
          {
            "from": {
              "data": "head_count"
            },
            "type": "group",
            "marks": [
              {
                "type": "rule",
                "properties": {
                  "enter": {
                    "x": {
                      "value": 0
                    },
                    "y": {
                      "value": 0,
                      "offset": -15
                    },
                    "x2": {
                      "field": {
                        "group": "width"
                      }
                    },
                    "stroke": {
                      "value": "#9aa2a9"
                    },
                    "strokeWidth": {
                      "value": 0.5
                    }
                  }
                }
              },
              {
                "from": {
                  "data": "center"
                },
                "type": "text",
                "properties": {
                  "enter": {
                    "x": {
                      "value": 20
                    },
                    "y": {
                      "scale": "vertical_center",
                      "fimeld": "a.a.rank"
                    },
                    "fill": {
                      "field": "color"
                    },
                    "text": {
                      "template": "{{datum.a.a.rank}}"
                    },
                    "align": {
                      "value": "right"
                    },
                    "baseline": {
                      "value": "middle"
                    },
                    "fontSize": {
                      "value": 13
                    },
                    "fontWeight": {
                      "field": "weight"
                    }
                  }
                }
              },
              {
                "from": {
                  "data": "center"
                },
                "type": "text",
                "properties": {
                  "enter": {
                    "x": {
                      "value": 30
                    },
                    "y": {
                      "field": "a.a.rank",
                      "scale": "vertical_center"
                    },
                    "fill": {
                      "field": "color"
                    },
                    "text": {
                      "template": "{{datum.a.a.country | truncate:20}}"
                    },
                    "align": {
                      "value": "left"
                    },
                    "baseline": {
                      "value": "middle"
                    },
                    "fontSize": {
                      "value": 13
                    },
                    "fontWeight": {
                      "field": "weight"
                    }
                  }
                }
              },
              {
                "from": {
                  "data": "center"
                },
                "type": "rect",
                "properties": {
                  "enter": {
                    "x": {
                      "mult": 0.5,
                      "field": {
                        "group": "width"
                      }
                    },
                    "y": {
                      "field": "a.a.rank",
                      "scale": "vertical_center",
                      "offset": -6
                    },
                    "fill": {
                      "field": "color"
                    },
                    "width": {
                      "mult": 0.5,
                      "field": "a.a.total",
                      "scale": "bar"
                    },
                    "height": {
                      "value": 12
                    }
                  }
                }
              },
              {
                "from": {
                  "data": "center_count"
                },
                "type": "group",
                "marks": [
                  {
                    "type": "rule",
                    "properties": {
                      "enter": {
                        "x": {
                          "value": 0
                        },
                        "y": {
                          "value": 0,
                          "offset": -15
                        },
                        "x2": {
                          "field": {
                            "group": "width"
                          }
                        },
                        "stroke": {
                          "value": "#9aa2a9"
                        },
                        "strokeWidth": {
                          "value": 0.5
                        }
                      }
                    }
                  },
                  {
                    "from": {
                      "data": "tail"
                    },
                    "type": "text",
                    "properties": {
                      "enter": {
                        "x": {
                          "value": 20
                        },
                        "y": {
                          "field": "a.a.rank",
                          "scale": "vertical_tail"
                        },
                        "fill": {
                          "field": "color"
                        },
                        "text": {
                          "template": "{{datum.a.a.rank}}"
                        },
                        "align": {
                          "value": "right"
                        },
                        "baseline": {
                          "value": "middle"
                        },
                        "fontSize": {
                          "value": 13
                        },
                        "fontWeight": {
                          "field": "weight"
                        }
                      }
                    }
                  },
                  {
                    "from": {
                      "data": "tail"
                    },
                    "type": "text",
                    "properties": {
                      "enter": {
                        "x": {
                          "value": 30
                        },
                        "y": {
                          "field": "a.a.rank",
                          "scale": "vertical_tail"
                        },
                        "fill": {
                          "field": "color"
                        },
                        "text": {
                          "template": "{{datum.a.a.country | truncate:20}}"
                        },
                        "align": {
                          "value": "left"
                        },
                        "baseline": {
                          "value": "middle"
                        },
                        "fontSize": {
                          "value": 13
                        },
                        "fontWeight": {
                          "field": "weight"
                        }
                      }
                    }
                  },
                  {
                    "from": {
                      "data": "tail"
                    },
                    "type": "rect",
                    "properties": {
                      "enter": {
                        "x": {
                          "mult": 0.5,
                          "field": {
                            "group": "width"
                          }
                        },
                        "y": {
                          "field": "a.a.rank",
                          "scale": "vertical_tail",
                          "offset": -6
                        },
                        "fill": {
                          "field": "color"
                        },
                        "width": {
                          "mult": 0.5,
                          "field": "a.a.total",
                          "scale": "bar"
                        },
                        "height": {
                          "value": 12
                        }
                      }
                    }
                  }
                ],
                "properties": {
                  "enter": {
                    "y": {
                      "mult": 20,
                      "field": "count",
                      "offset": 10
                    },
                    "width": {
                      "field": {
                        "group": "width"
                      }
                    }
                  }
                }
              }
            ],
            "properties": {
              "enter": {
                "x": {
                  "value": 0
                },
                "y": {
                  "mult": 20,
                  "field": "count",
                  "offset": 10
                },
                "width": {
                  "field": {
                    "group": "width"
                  }
                }
              }
            }
          },
          {
            "from": {
              "data": "head_count"
            },
            "type": "group",
            "marks": [
              {
                "from": {
                  "data": "tail"
                },
                "type": "rule",
                "properties": {
                  "enter": {
                    "x": {
                      "value": 0
                    },
                    "y": {
                      "value": 0,
                      "offset": -15
                    },
                    "x2": {
                      "field": {
                        "group": "width"
                      }
                    },
                    "stroke": {
                      "field": "rule_trick_color"
                    },
                    "strokeWidth": {
                      "value": 0.5
                    }
                  }
                }
              },
              {
                "from": {
                  "data": "tail"
                },
                "type": "text",
                "properties": {
                  "enter": {
                    "x": {
                      "value": 20
                    },
                    "y": {
                      "field": "a.a.rank",
                      "scale": "vertical_tail"
                    },
                    "fill": {
                      "field": "trick_color"
                    },
                    "text": {
                      "template": "{{datum.a.a.rank}}"
                    },
                    "align": {
                      "value": "right"
                    },
                    "baseline": {
                      "value": "middle"
                    },
                    "fontSize": {
                      "value": 13
                    },
                    "fontWeight": {
                      "field": "weight"
                    }
                  }
                }
              },
              {
                "from": {
                  "data": "tail"
                },
                "type": "text",
                "properties": {
                  "enter": {
                    "x": {
                      "value": 30
                    },
                    "y": {
                      "field": "a.a.rank",
                      "scale": "vertical_tail"
                    },
                    "fill": {
                      "field": "trick_color"
                    },
                    "text": {
                      "template": "{{datum.a.a.country | truncate:20}}"
                    },
                    "align": {
                      "value": "left"
                    },
                    "baseline": {
                      "value": "middle"
                    },
                    "fontSize": {
                      "value": 13
                    },
                    "fontWeight": {
                      "field": "weight"
                    }
                  }
                }
              },
              {
                "from": {
                  "data": "tail"
                },
                "type": "rect",
                "properties": {
                  "enter": {
                    "x": {
                      "mult": 0.5,
                      "field": {
                        "group": "width"
                      }
                    },
                    "y": {
                      "field": "a.a.rank",
                      "scale": "vertical_tail",
                      "offset": -6
                    },
                    "fill": {
                      "field": "trick_color"
                    },
                    "width": {
                      "mult": 0.5,
                      "field": "a.a.total",
                      "scale": "bar"
                    },
                    "height": {
                      "value": 12
                    }
                  }
                }
              }
            ],
            "properties": {
              "enter": {
                "y": {
                  "mult": 20,
                  "field": "count",
                  "offset": 10
                },
                "width": {
                  "field": {
                    "group": "width"
                  }
                }
              }
            }
          }
        ],
        "scales": [
          {
            "name": "vertical_head",
            "type": "ordinal",
            "range": [
              0,
              20,
              40,
              60,
              80
            ],
            "domain": {
              "data": "head",
              "sort": {
                "op": "min",
                "field": "a.rank"
              },
              "field": "a.rank"
            }
          },
          {
            "name": "vertical_center",
            "type": "ordinal",
            "range": [
              0,
              20,
              40,
              60,
              80
            ],
            "domain": {
              "data": "center",
              "sort": {
                "op": "min",
                "field": "a.a.rank"
              },
              "field": "a.a.rank"
            }
          },
          {
            "name": "vertical_tail",
            "type": "ordinal",
            "range": [
              0,
              20,
              40,
              60,
              80
            ],
            "domain": {
              "data": "tail",
              "sort": {
                "op": "min",
                "field": "a.a.rank"
              },
              "field": "a.a.rank"
            }
          },
          {
            "name": "bar",
            "type": "linear",
            "range": "width",
            "domain": {
              "data": "table",
              "field": "total"
            }
          }
        ],
        "padding": {
          "top": 40,
          "left": 20,
          "right": 20,
          "bottom": 0
        }
      },
      "template": false,
      "default": false,
      "status": "saved",
      "published": true,
      "verified": false
    }
  },
  "meta": {
    "status": "saved",
    "published": true,
    "verified": false,
    "updated_at": "2017-01-17T17:50:45.655Z",
    "created_at": "2016-06-06T15:12:38.749Z"
  }
}
```

### Modify the Query Url of a widget

The `queryUrl` query parameter can be set if the user needs to modify the final url that will be requested. All parameters indicated in the queryUrl, will be pass to the microservice.

```shell
curl -X GET https://api.resourcewatch.org/v1/widget/049f074a-3528-427d-922b-3c2320e9caf6?queryUrl=/v1/query?sql=Select%20*%20from%20data&geostore=ungeostore
```

## Create a Widget

To create a widget, you need to define all of the required fields in the request body. The fields that compose a widget are:

Field        |               Description               |    Type |                                          Values | Required
------------ | :-------------------------------------: | ------: | ----------------------------------------------: | -------:
name         |           Name of the widget            |    Text |                                        Any Text |      Yes
description  |       Description of the dataset        |    Text |                                        Any text |       No
source       |     Publisher of the original code      |    Text |                                        Any text |       No
sourceUrl    |         Link to publisher page          |    Text |                                         Any url |       No
application  | Application to which the widget belongs |   Array | gfw, forest-atlas, rw, prep, aqueduct, data4sdg |      Yes
authors      |           Name of the authors           |    Text |                                        Any text |       No
queryUrl     |  Url with the data of the chart shows   |    Text |                                 Any valid query |       No
widgetConfig |           Vega configuration            |  Object |                                    Valid object |       No
status       |          Status of the Widget           |  Number |                                               1 |       No
published    |        If it's available to use         | Boolean |                                    true - false |       No
freeze    |        If the data is freezed         | Boolean |                                    true - false |       No
protected    |        If it's a protected widget (not is possible to delete if it's true)         | Boolean |                                    true - false |       No
verified     |     If it's verified by other user      | Boolean |                                    true - false |       No
template     |           If it's a template            | Boolean |                                    true - false |       No
default      |       If it's default for dataset       | Boolean |                                    true - false |       No
layerId      |   UuId of the relationship with layer   |    Text |                                   Uuid of layer |       No
dataset      |           UuId of the dataset           |    Text |                                 Uuid of Dataset |       No

> To create a widget, you have to do a POST request with the following body:

```shell
curl -X POST https://api.resourcewatch.org/v1/dataset/<dataset_id>/widget \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "widget": {
      "application":[
         "your", "apps"
      ],
      "name":"Example Carto Dataset"
      "status": 1,
      "published": true
   }
}'
```

## Update a Widget

To update a widget, you need to define all of the required fields in the request body. The fields that compose a widget are:

Field        |               Description               |    Type |                                          Values | Required
------------ | :-------------------------------------: | ------: | ----------------------------------------------: | -------:
name         |           Name of the widget            |    Text |                                        Any Text |      Yes
description  |       Description of the dataset        |    Text |                                        Any text |       No
source       |     Publisher of the original code      |    Text |                                        Any text |       No
sourceUrl    |         Link to publisher page          |    Text |                                         Any url |       No
application  | Application to which the widget belongs |   Array | gfw, forest-atlas, rw, prep, aqueduct, data4sdg |      Yes
authors      |           Name of the authors           |    Text |                                        Any text |       No
queryUrl     |  Url with the data of the chart shows   |    Text |                                 Any valid query |       No
widgetConfig |           Vega configuration            |  Object |                                    Valid object |       No
status       |          Status of the Widget           |  Number |                                               1 |       No
published    |        If it's available to use         | Boolean |                                    true - false |       No
freeze    |        If the data is freezed         | Boolean |                                    true - false |       No
verified     |     If it's verified by other user      | Boolean |                                    true - false |       No
template     |           If it's a template            | Boolean |                                    true - false |       No
default      |       If it's default for dataset       | Boolean |                                    true - false |       No
layerId      |   UuId of the relationship with layer   |    Text |                                   Uuid of layer |       No
dataset      |           UuId of the dataset           |    Text |                                 Uuid of Dataset |       No
env          |               Environment               |    Text |                 `production` or `preproduction` |      Yes

> To create a widget, you have to do a POST request with the following body:

```shell
curl -X PATCH https://api.resourcewatch.org/v1/dataset/<dataset_id>/widget/<widget_id> \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"  -d \
 '{
   "widget": {
      "application":[
         "your", "apps"
      ],
      "name":"New Example Carto Dataset Name",
      "widgetConfig": {}
   }
}'
```

## Delete a Widget

```shell
curl -X DELETE https://api.resourcewatch.org/v1/dataset/<dataset_id>/widget/<widget_id> \
-H "Authorization: Bearer <your-token>" \
-H "Content-Type: application/json"
```
