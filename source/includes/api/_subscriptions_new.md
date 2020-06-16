# Subscriptions NEW

## What is a subscription?

A subscription allows you to subscribe and get notified of updates on a datasets' data. We strongly recommend that you read the [dataset concept](#dataset) and [dataset endpoint](#dataset6) sections before proceeding.

In the following sections, you will understand how you can interact and manage subscriptions using the RW API, and use them to get notified via email or webhook of updates to the data of datasets. We will also dive into the process of confirming subscriptions, as well as how to unsubscribe a given subscription.

## Subscription reference

This section gives you a complete view at the properties that are maintained as part of a subscription. When interacting with a subscription (on get, on create, etc) you will find most of these properties available to you, although they may be organized in a slightly different structure (ie: on get, everything but the `id` is nested inside an `attributes` object).

You can find more details in the [source code](https://github.com/gfw-api/gfw-subscription-api/blob/develop/app/src/models/subscription.js).

Filter           | Type    | Required            | Default value       | Description
---------------- | ------- | ------------------- |-------------------- | ------------------------------------------------------------------
id               | String  | Yes                 | (auto-generated)    | Unique Id of the subscription. Auto generated on creation. Cannot be modified by users.
name             | String  | No                  |                     | The name of the subscription.
confirmed        | Boolean | No                  | false               | If the subscription is confirmed or not.
resource         | Object  | Yes                 |                     | An object containing the data for who (or what) should be notified on dataset data changes.
resource.type    | Enum    | Yes                 |                     | The type of resource to be notified. Can take the values of `"EMAIL"` (for an email notification) or `"URL"` for a webhook notification.
resource.content | String  | Yes                 |                     | The object to be notified: should be a valid email case `resource.type` is `"EMAIL"`, and a valid URL case `resource.type` is `"URL"`.
datasets         | Array   | No                  | `[]`                | An array of dataset ids that this subscription is tracking.
datasetsQuery    | Array   | No                  | `[]`                | An alternative way of stating the datasets that this subscription is tracking.
params           | Object  | No                  | `{}`                | Parameters for customizing the tracking of this subscription. Can contain information to narrow the updates being tracked (especially in the case of geo-referenced data).
userId           | String  | Yes                 | (auto-populated)    | Id of the user who owns the subscription. Set automatically on creation. Cannot be modified by users.
language         | String  | No                  | `'en'`              | The language for this subscription. Useful for customizing email notifications according to the language of the subscription.
application      | String  | Yes                 | `'gfw'`             | Applications associated with this subscription.
env              | String  | Yes                 | `'production'`      | Environment to which the subscription belongs.
createdAt        | Date    | No                  | (auto-populated)    | Automatically maintained date of when the subscription was created. Cannot be modified by users.
updatedAt        | Date    | No                  | (auto-populated)    | Automatically maintained date of when the subscription was last updated. Cannot be modified by users.
