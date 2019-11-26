# Troubleshooting auth problems

If you are having trouble with authentication, please make sure that you have followed the steps [detailed here for obtaining your private token](#how-to-generate-your-private-token). If you are still having trouble, here's some advice on some of the problems you might find:

* If you receive a response code **401 Unauthorized**, this might mean that you are not providing your token correctly. Double check [here](#authentication) and make sure that you are sending the token in the *Authorization* header and correctly formatted.

* A **403 Forbidden** generically means that you are identified as a valid user, but you do not have the required permissions for the action you are trying to perform. This might mean (*not exclusively*) that you don't have the required apps associated to your user profile to access the application you are trying to access. Check the project where you want to perform requests (for instance, the Resource Watch API uses the `rw` application slug) and check if your user has the correct app. If you need to edit the apps of your user profile, check out the [PATCH auth/me](#update-your-user-account-details) endpoint. If you still were not able to find the problem, confirm the documentation of each endpoint for any endpoint-specific rules that you might be missing.
