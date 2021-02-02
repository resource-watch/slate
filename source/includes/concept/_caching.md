## Caching

HTTP caching is a technique that stores a copy of a given resource and serves it back when requested. When a cache has a requested resource in its store (also called a _cache hit_), it intercepts the request and returns its copy instead of re-computing it from the originating server. If the request is not yet stored in cache (also called _cache miss_), it is forwarded to the server responsible for handling it, the response is computed and stored in cache to serve future requests. This achieves several goals: it eases the load of the server that doesn’t need to serve all requests itself, and it improves performance by taking less time to transmit the resource back. You can read more about HTTP caching in the [Mozilla Developer Network docs on HTTP caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching).

The RW API has a server-side, system-wide HTTP cache that may be used to cache your requests. Keep in mind that, in the context of the RW API, not all endpoints have caching enabled for them. You'll find a list below with the services which rely on caching in the RW API. If, as a developer, you'd like your endpoints to benefit from caching, you need to explicitly implement it. Please refer to the [developer docs on HTTP caching](/developer.html#http-caching) for more details on how to implement caching for your API resources.

The default cache time to live (TTL) applied to the responses stored in the RW API's cache is 3 days, but specific endpoints may specify a different expiration time for their responses. For the purposes of caching, only responses of GET requests with successful response codes (such as 200, 203, 204, or 302) are considered for caching. Also, for security reasons, authentication, authorization, or user related information contained in the HTTP request headers is never stored in cache. This is also the case for authenticated GET responses.

### 3rd party HTTP caching

Keep in mind that, besides the RW API cache, there might be other HTTP caches between your application and the RW API servers. These caches might be public (ie. your ISP's cache, or your local network's) or private (your browser's cache), and one or many may exist between you and the RW API infrastructure (which includes the RW API cache described here). The information detailed below describes the behavior of the RW API cache only, and illustrates how you, as a RW API user, would perceive it, were there no other caches at play. However, that may not always be true, and you may experience different behavior caused by these other caches. If you suspect this may be the case, you should:

- Disable any local cache you may have (for example, if you are using a browser to issue requests, you may need to explicitly disable the browser's built-in cache).
- Use HTTPS to bypass public HTTP caches.

### HTTPS and caching

As you may or may not know, HTTPS - the secure variant of HTTP protocol - establishes a secure, encrypted connection between client (you) and server (the RW API). This architecture means that traditional public HTTP caches cannot be used, and are thus bypassed. However, the RW API HTTP cache operates within the RW API infrastructure, meaning it will still be used to cache and serve responses, even if you use an HTTPS connection.

### How to detect a cached response

> Example cURL command with detailed header information:

```shell
curl -svo /dev/null https://api.resourcewatch.org/v1/dataset
```

> Example response of the command above including a MISS `x-cache` header:

```shell
< HTTP/2 200 
< content-type: application/json; charset=utf-8
< server: nginx
< cache: dataset
< x-response-time: 37 ms
< accept-ranges: bytes
< date: Tue, 29 Dec 2020 15:44:18 GMT
< via: 1.1 varnish
< age: 0
< x-served-by: cache-mad22045-MAD
< x-cache: MISS
< x-cache-hits: 0
< x-timer: S1609256659.546595,VS0,VE426
< vary: Origin, Accept-Encoding
< content-length: 11555
```

> Example response of the command above including a HIT `x-cache` header:

```shell
< HTTP/2 200 
< content-type: application/json; charset=utf-8
< server: nginx
< cache: dataset
< x-response-time: 37 ms
< accept-ranges: bytes
< date: Tue, 29 Dec 2020 15:44:26 GMT
< via: 1.1 varnish
< age: 7
< x-served-by: cache-mad22039-MAD
< x-cache: HIT
< x-cache-hits: 1
< x-timer: S1609256666.390657,VS0,VE0
< vary: Origin, Accept-Encoding
< content-length: 11555
```

One of the most important things you should know about caching is how to detect if you are receiving a cached response or not. To do this, you should inspect the headers of RW API's responses, looking for a `x-cache` header. If it does not contain this header, it was not cached by the RW API system-wide cache. If it contains the `x-cache` header, it will have one of two values:

* `MISS`, which means the resource you're trying to GET was not found in cache, and so a fresh response was served;
* `HIT`, which means the resource you're trying to GET was found in cache and the cached response was served.

You can read more about this and other cache-related headers used by the RW API in [this link](https://docs.fastly.com/en/guides/understanding-cache-hit-and-miss-headers-with-shielded-services).

**Keep in mind that [3rd party caches](#3rd-party-http-caching) might be present between your application and the RW API servers which can modify these headers.**

### Cache invalidation

One of the common hassles of caching is cache invalidation - how to tell a caching tool that a certain response it has stored is no longer valid, and needs to be recomputed.

The RW API handles this internally and automatically for you. It has a built-in system that is able to invalidate specific cached responses, following a request that affects the output of said responses. This mechanism is rather complex, but you, as the RW API user don't really need to worry about it - you just need to be aware that the RW API cache will be invalidated automatically, so that you always get the correct, up to date information for your requests, even if they had been previously cached.

**Keep in mind that [3rd party caches](#3rd-party-http-caching) might be present between your application and the RW API servers, and their content may not be invalidated immediately.**

### Which services rely on caching

* [Dataset](/reference.html#dataset)
* [Layer](/reference.html#layer)
* [Metadata](/reference.html#metadata10)
* [Vocabulary](/reference.html#vocabularies-and-tags)
* [Widgets](/reference.html#widget)
* [Query](/reference.html#query) and [Fields](/reference.html#fields) also use cache, but with a TTL of 2 days