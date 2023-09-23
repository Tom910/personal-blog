---
date: "2023-09-23"
title: Protecting Your Backend Application with Rate Limiting
tags:
  - node.js
  - fastify
  - SRE
description: A large volume of traffic hitting your application is not a rare event, as there are DDOS attacks, server breakdowns, promotions, and other events that create conditions where significantly more traffic comes to your application than it can handle.
---

A large volume of traffic hitting your application is not a rare event. There are DDOS attacks, server breakdowns, promotions, and other events that create conditions where significantly more traffic comes to your application than it can handle. However, most applications simply stop responding when they receive a lot of traffic. Nevertheless, it's possible to ensure that the application operates normally and recovers quickly from high traffic. Although there are many rate limiter solutions designed to address this problem, they mainly solve business problems and limit users rather than protect applications. You also need a technical rate limiter that will protect your application, speed up service recovery, and reduce your headaches. I will discuss this approach in this article. This article will be useful for Node.js developers (all code examples are written in JS), as well as all Backend developers and SREs.

## The Problem Explained
Imagine a standard REST backend application using frameworks like Fastify or Express. It might have several API methods that fetch data from external sources, process it, and then serve it to the user.

### Simulating the Issue
For demonstrations, I'll use a [fastify application](https://github.com/Tom910/rate-limit-guard/blob/ded356c3df3e6f623de7119a35ad20597ec920bb/examples/fastify/index.ts) Here, each request undergoes at least 30 ms of synchronous processing and 150ms of waiting, totaling 180ms of ideal response time.

For load tests, I will use k6 [with the following configuration](https://github.com/Tom910/rate-limit-guard/blob/ded356c3df3e6f623de7119a35ad20597ec920bb/benchmark/k6.js).

To understand the underlying mechanism, I recommend this [article on the Event loop](https://www.builder.io/blog/visual-guide-to-nodejs-event-loop).

### Standard Traffic
We receive regular, normal traffic, for example, 10 RPS that the application can handle.

The application’s Event loop looks like this:
![app in a normal situation](/assets/article-rate-limiting/rate-limit-normal-situation.excalidraw.png)

The number of incoming tasks doesn't exceed the number of requests that the application can handle. As a result, we get a quick response time, and all responses have a 200 status. But what happens if more traffic comes in?

### Overloaded Traffic
A different situation occurs when the application receives significantly more traffic than it can handle.

![app in a overload situation](/assets/article-rate-limiting/rate-limit-overload.excalidraw.png)

In this case, the Event Loop is clogged with tasks. Each stage in the Event loop gets blocked for a long time by a large number of tasks, leading to a halt in the Event loop's operation. The Event loop is critically important for Node.js applications. Consequently, thousands of parallel requests may be executed simultaneously, and instead of responding to a portion of the requests, some requests are processed for minutes. To an external observer, the application appears to hang because any requests get stuck in the Event Loop and are processed for minutes. Then, two events occur:


- The application crashes due to memory issues
- The application takes a very long time to process requests that have entered the application, sometimes taking tens of minutes.

An example of a load test of an application without using rate limiting, which illustrates the problem:

![what's happens without rate limit](/assets/article-rate-limiting/without-rate-limit.png)

After reaching a certain RPS, the application simply stopped responding with a 200 code ((2) the green line at the bottom breaks off). As a result, 372 successful requests were made, and 6364 were unsuccessful.

As a result, for users, the application is completely broken because requests hang in minute-long timeouts. Users begin refreshing/restarting applications, retries are triggered, leading to even more traffic, and the situation only improves when the number of incoming requests is less than the application can handle.


- Downtime = the amount of time when the traffic volume > the number of requests the application can handle
- Recovery time = 10+ minutes

This scenario is painful and challenging to rectify. You either need to turn off traffic sources or scale the application. I’ve witnessed this many times in the past, and it was distressing. However, there's another solution.


## The Solution: Using Rate Limit

In this section, I will introduce my open-source solution for rate limiting https://github.com/Tom910/rate-limit-guard/

As a solution to this problem, we can add a Rate limit that will limit the amount of incoming traffic and we have several options on how we can do this:


- *Infrastructure Level*: we can use new Service mesh solutions that allow smart traffic limiting. It is important that the solution can adapt to changes in the application. For example, it tracked response time and other application indicators.
- *Application Level:*: We can integrate a library into each application that will monitor the volume of incoming traffic and application indicators, making decisions based on this data. It is this approach that I will consider as a solution.

### Application-Level Rate Limiting

![integration app with rate limit](/assets/article-rate-limiting/rate-limit-app-integration.excalidraw.png)


```javascript
const fastify = require('fastify');
const { rateLimitFastify } = require('rate-limit-guard/adapters/fastify');

const app = fastify();
fastify.register(rateLimitFastify); // register rate limit

fastify.get('/', (request, reply) => { reply.send({ hello: 'world' }); })

await fastify.listen({ port: 3000 })
```

Each application has its internal rate limiter that first processes incoming traffic and controls the number of requests the application processes. The logic applied is:

- The application accepts a new request.
- The request proceeds to the rate limiter.
  - The rate-limit checks if it is possible to execute the request, otherwise it queues it
  - After executing the request, rate-limit takes out the next request from the queue
  - If the queue is full, the rate limiter discards the oldest request and responds with a 429 status code.
  - Periodically, the system status is checked, for instance, the event loop's load.
- The logic of the application is executed

An example of a load test of an application with a rate limit:

![how works application over load with rate limit](/assets/article-rate-limiting/with-rate-limit.png)

Throughout, the application consistently returned 200 responses, ensuring users received some response. Moreover, the application rapidly recovered after the traffic subsided. Out of the attempts, 4602 requests were processed successfully (12 times more), and 17782 were unsuccessful (these requests were promptly rejected with a 429 error).

The rate limiter supervises the number of requests concurrently executing in the system, thereby mitigating adverse effects when an application tries to handle thousands of requests simultaneously.

### Adapting to Traffic & Changes

Applications change over time, new features appear that slow down or speed up the application. Therefore, it is important to review application limits every N-time. Or have functionality that allows you to dynamically adapt to traffic and resource consumption.

In Node.js for this you can use Event loop lag, which shows execution time for all tasks in an application. This is a great metric as it shows how many tasks are in your system and how much it is really overloaded. This data can be used to decide whether you can increase the limit of simultaneously executing requests.


### Prioritizing Requests

Not all requests carry the same weight and should be executed when our application cannot handle a sufficient number of requests.

**High-priority technical requests include:**

- Probes for K8S: It's crucial for probes to return the correct status. If they don't, K8S might mistakenly believe the application has crashed and needs to be restarted. These requests should neither be discarded nor canceled.
- Service requests: These could be technical private requests employed for application maintenance tasks like clearing caches, toggling features on or off, etc.

**High-priority business requests include:**

- Requests related to payment/ordering/purchasing. If a client has already chosen products and is ready to order, then usually such requests should be executed first.
- Requests related to obtaining critical/minimum information.

The rate limit can contain logic for separating such requests and primarily executing critical requests, and the rest when the application is operating normally.

The `rate-limit-guard` library has logic for request prioritization:
```javascript
server.register(rateLimitFastify, { isImportantRequest: (payload) => payload.req.url === '/healthz' || payload.req.url === '/private/reload-feature-toggles' })
```

## Conclusions

Backend application overload is a common problem and by default, if nothing is done, the application will simply stop working and even after the cessation of increased traffic, the application will still be processing old, possibly unnecessary requests for a long time.

An alternative to this outcome is Rate limit which will limit the number of requests and thus eliminate application overload. This will help not lose control over the application during a problem, as well as significantly faster recovery after a fall.

As an example of implementation for Node.js, you can use the library https://github.com/Tom910/rate-limit-guard
