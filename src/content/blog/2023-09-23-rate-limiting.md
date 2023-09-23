---
date: "2023-09-23"
title: Rate Limiting What You Need
tags:
  - node.js
  - fastify
  - SRE
description: A large volume of traffic hitting your application is not a rare event, as there are DDOS attacks, server breakdowns, promotions, and other events that create conditions where significantly more traffic comes to your application than it can handle.
---

A large volume of traffic hitting your application is not a rare event, as there are DDOS attacks, server breakdowns, promotions, and other events that create conditions where significantly more traffic comes to your application than it can handle. However, most applications simply stop responding when a lot of traffic comes in. Nevertheless, it is possible to ensure that the application operates normally and recovers quickly from high traffic. Although there are a large number of rate limiters solutions that should solve this problem, they are mainly designed to solve business problems and limit users rather than protect applications. You also need a technical rate limiter that will protect your application, speed up service recovery, reduce your headache, and I will talk about this approach in this article. The article will be useful for Node.js developers (all code examples are written in JS), as well as all Backend developers and SRE.

## Why do we have a problem?
Let’s say I have a regular REST backend application built on top of the usual fastify or Express framework. The application contains several API methods that request data from third-party sources, then transform them and respond to the user.

## How to reproduce
All examples will be based on the example of a [fastify application](https://github.com/Tom910/rate-limit-guard/blob/ded356c3df3e6f623de7119a35ad20597ec920bb/examples/fastify/index.ts) in which each request spends at least 30 ms of synchronous work and 150ms in waiting mode. The ideal response time = 180ms.

For load tests, I will use k6 [with the following configuration](https://github.com/Tom910/rate-limit-guard/blob/ded356c3df3e6f623de7119a35ad20597ec920bb/benchmark/k6.js).

You can read more about the Event loop in [a good article](https://www.builder.io/blog/visual-guide-to-nodejs-event-loop).

### Normal situation
We receive regular, normal traffic, for example, 10 RPS that the application can handle.

The application’s Event loop looks like this:
![app in a normal situation](/assets/article-rate-limiting/rate-limit-normal-situation.excalidraw.png)

The number of incoming tasks does not exceed the number of requests that the application can handle. As a result, we get a quick response time and all responses have a 200 status. But what happens if more traffic comes in?

### Significantly more traffic comes to the application
A different situation occurs when significantly more traffic hits the application than it can handle.

![app in a overload situation](/assets/article-rate-limiting/rate-limit-overload.excalidraw.png)

In this case, the Event Loop is clogged with tasks. That is, each stage in the Event loop begins to be blocked for a long time by a large number of tasks, which leads to a stoppage of the Event loop. The Event loop is critically important for Node.js applications. As a result, 1000s of parallel requests may be executed simultaneously, and instead of responding to part of the requests, requests are executed for minutes. For an external observer visually, the application seems to hang because any requests get stuck in the Event Loop and are executed for minutes. And then two events occur:

- The application crashes due to memory
- The application takes a very long time to process requests that have come into the application, sometimes this can take tens of minutes

An example of a load test of an application without using rate-limiting, which shows the problem

![what's happens without rate limit](/assets/article-rate-limiting/without-rate-limit.png)

After reaching a certain RPC, the application simply stopped responding with 200 code ((2) green line at the bottom breaks off). As a result, 372 successful requests were made and 6364 were unsuccessful.

As a result, for users, the application is completely broken because requests are hanging in minute-long timeouts, users start refreshing/restarting applications, retries start to trigger, leading to even more traffic and the situation will only improve when the number of incoming requests will be less than the application can handle.

- Downtime = amount of time when traffic volume > number of requests the application can handle
- Recovery time = 10+ minutes

This is painful and difficult to fix. You need to disable traffic sources/scale the application, I’ve seen this many times in the past and it was painful. But there is another way.

## Using Rate Limit

In this section, I will consider my open-source solution for rate limit https://github.com/Tom910/rate-limit-guard/

As a solution to this problem, we can add a Rate limit that will limit the amount of incoming traffic and we have several options on how we can do this:

- At the infrastructure level. We can use new Service mesh solutions that allow smart traffic limiting. It is important that the solution can adapt to changes in the application. For example, it tracked response time and other application indicators.
- At the level of each application. We can add a library to each application that will track the amount of incoming traffic and application indicators and make decisions based on this. It is this approach that I will consider as a solution.

### Rate limit in the application

![integration app with rate limit](/assets/article-rate-limiting/rate-limit-app-integration.excalidraw.png)


```javascript
const fastify = require('fastify');
const { rateLimitFastify } = require('rate-limit-guard/adapters/fastify');

const app = fastify();
fastify.register(rateLimitFastify);

fastify.get('/', (request, reply) => { hello: 'world' })

await fastify.listen({ port: 3000 })
```

Each application has its own internal rate-limit that first processes incoming traffic and controls the number of requests that the application processes. What logic is used:

- The application accepts a new request
- The request goes to rate-limit
  - rate-limit checks if it is possible to execute the request, otherwise it queues it
  - after executing the request, rate-limit takes out the next request from the queue
  - If the queue is full, rate-limit throws out the oldest request and responds with a 429 code
  - periodically checks system status, for example, event loop load
- The logic of the application is executed

An example of a load test of an application with a rate limit:

![how works application over load with rate limit](/assets/article-rate-limiting/with-rate-limit.png)

The application responded with 200 responses all the time and users had a chance to get some response, and also the application quickly recovered after traffic dropped. 4602 requests were processed successfully (12 times more), unsuccessful 17782 (all requests bounced off with a 429 error)

The rate limit controls the number of simultaneously executing requests in the system and thus we remove negative effects when an application tries to process thousands of requests at once.

### Adaptation to traffic and changes in the application

Applications change over time, new features appear that slow down or speed up the application. Therefore, it is important to review application limits every N-time. Or have functionality that allows you to dynamically adapt to traffic and resource consumption.

In Node.js for this you can use Event loop lag, which shows execution time for all tasks in an application. This is a great metric as it shows how many tasks are in your system and how much it is really overloaded. This data can be used to decide whether you can increase the limit of simultaneously executing requests.


### Prioritization of requests

Not all requests carry the same weight and should be executed when our application cannot handle a sufficient number of requests.

**High priority technical requests:**

- For K8S, it’s important that probes return the correct status. Otherwise, K8S will think that the application has crashed and needs to be recreated. Such requests should not be discarded or cancelled.
- Service requests. For example, applications may have technical private requests that can be used for application maintenance - clearing caches, disabling/enabling features, and so on.

**High priority business requests:**

- Requests related to payment/ordering/purchasing. If a client has already chosen products and is ready to order, then usually such requests should be executed first.
- Requests related to obtaining critical/minimum information.

The rate limit can contain logic for separating such requests and primarily executing critical requests, and the rest when the application is operating normally.

## Conclusions

Backend application overload is a common problem and by default, if nothing is done, the application will simply stop working and even after the cessation of increased traffic, the application will still be processing old, possibly unnecessary requests for a long time.

An alternative to this outcome is Rate limit which will limit the number of requests and thus eliminate application overload. This will help not lose control over the application during a problem, as well as significantly faster recovery after a fall.

As an example of implementation for Node.js, you can use the library https://github.com/Tom910/rate-limit-guard
