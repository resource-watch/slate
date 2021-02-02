## User roles

RW API users have a role associated with it, defined in the `role` field of each user. You can check your own role by consulting your user information using the [`GET /users/me` endpoint](/index-rw.html#get-the-current-user) or getting a JSON Web Token and decoding its information. The `role` of the user is defined as a string, and it can take one of the following values:

* `USER`
* `MANAGER`
* `ADMIN`

### Role-based access control

> Typical hierarchy for roles:

```
USER (least privileges) < MANAGER < ADMIN (most privileges)
```

The role field is usually used across the RW API for controlling access to API resources. While not required nor enforced, typically user roles are used hierarchically, being `USER` the role with the least privileges, and `ADMIN` the one with most privileges. A common pattern you’ll find on some services is: 

* `USER` accounts can read (usually all data or just data owned by the user, depending on any privacy or security concerns in the service in question), but only create new resources; 
* `MANAGER` accounts can perform all of the `USER` actions, complemented with editing or deleting resources owned by them;
* `ADMIN` accounts can do all of the above even for resources created by other users.

Role-based access control is usually conjugated with the list of applications associated with the user: typically, in order to manipulate a given resource, that resource and the user account must have at least one overlapping application value. Read more about the application field and which services use it in the [Applications concept documentation](/index-rw.html#applications).

Keep in mind that it’s up to each individual RW API service (dataset, widget, layer, etc) to define how they restrict or allow actions based on these or other factors, so the examples above may not be true for all cases. Refer to the documentation of each resource and endpoint for more details on restrictions they may have regarding user accounts and their properties.

### How to change the role of an user

Changing role of users is restricted to `ADMIN` users, so if you intend to upgrade your user role to a `MANAGER` or `ADMIN` role, please get in touch with one of the `ADMIN` users and request the change. If you are already an `ADMIN` user and you intend to change the role of another user, you can do so using the [`PATCH /users/:id` endpoint](/index-rw.html#update-another-user-39-s-account-details).

### Which services comply with these guidelines

The following endpoints adhere to the user role conventions defined above:

* [Dashboards](/index-rw.html#dashboard)
* [Datasets](/index-rw.html#dataset6)
* [Layers](/index-rw.html#layer8)
* [Metadata](/index-rw.html#metadata14)
* [Widgets](/index-rw.html#widget9)