---
date: "2023-10-19"
title: How to combine Microservices and Modular Monoliths together
tags:
  - architecture
  - microservices
  - modular monolith
  - k8s
description: Microservices have been a popular topic for the past 10 years. In the first 5-7 years, almost all companies migrated from monolith applications to microservices. However, in the last 3-5 years, there have been a lot of complaints about microservices. However, we usually only have the choice between monoliths and microservices. Are there any other options?
---

Microservices have been a popular topic for the past 10 years. In the first 5-7 years, almost all companies migrated from monolith applications to microservices. However, in the last 3-5 years, I read a lot of complaints about microservices. This is because microservices create a lot of new problems that can be difficult to solve. For example, microservices require:

- Advanced SRE practices
- Complex infrastructure
- Solutions for cross-service changes
- Cost-effective cross-service communication

However, we usually only have the choice between monoliths and microservices. Are there any other options?

In this article, I will analyze a new framework called [Service Weaver](https://serviceweaver.dev/) which combines the ideas of modular monolith and microservices.

## Challenges with Microservices
![microservices overview](/assets/article-service-weaver/microservices-overview.webp)

Microservices are a complex topic, and there are many articles and talks about the problems with microservices. However, in general, there are a few main problems:

### Cross-service communication
Every request has an additional cost, including network latency, serialization/deserialization, and the stability of services and networks. The first two points can be solved by adding additional resources, but the last point is not easy to solve. This is because every additional service increases the probability of failure. Solving this problem requires a lot of SRE practices, such as circuit breakers, retries, fallbacks, etc.

### Observability
In a microservice architecture, it is difficult to understand what is happening in the project. This is because there are many services, each with its own logging and tracing format. If you have a problem with a request, you need to check the logs in different services to try to understand what is going on. This can be fixed by standardizing the logging and tracing format, but this is not easy to do.

### Local running
How do you run 10 different microservices on a local machine? Especially if they use different languages and approaches. Companies usually spend a lot of resources to improve the local development experience, but this is not easy to do.

### Cross-service changes
If you need to change something in 5 microservices, it is not easy to do. This is because you need to create 5 different pull requests, wait for reviews, and so on.

There are also many other problems with monolith applications.

## Modular monolith
![modular monolith overview](/assets/article-service-weaver/modular-monolith-overview.webp)

Modular monolith is a step back to monolith where we have one monolithic application but all code is split into many modules inside. Ideally, we can split it into microservices in the future. This approach does not have some of the problems of microservices, but still we can have only one application and it might be a problem in scaling. What if we can combine modular monolith and microservices together?

## How Service Weaver combine modular monolith and microservices together?

![Service Weaver overview](/assets/article-service-weaver/improved-modular-monolith-overview.webp)

Service Weaver is a new framework for Go from Google Cloud that has some good ideas on how to combine modular monolith and microservices together to solve some problems. The main concepts of Service Weaver are:

- **Monorepo with components:** A component is like a microservice that contains the logic of one part of the project. According to the model of Service Weaver, we need to create a monorepo for one project and specify all the separate components. Monorepo helps to solve the problem with cross-service changes.
- **A lot of tooling for running/deploying/monitoring components:** This helps to solve the problem with local running and observability.
- **Different modes for running components:** Components can be run as a single process or as many separate deployments, which helps to minimize the problem with cross-service communication.
- **Wrapper for HTTP requests between components:** This helps to solve the problem with cross-service communication.

### Overview of Service Weaver
![Overview of Service Weaver](/assets/article-service-weaver/service-weaver-overview.webp)

- **Monorepo per project:** The monorepo has many components that share typings between components. Every change in contracts will be validated.
- **Build process:** All components are compiled into one binary file and K8S manifests with specifications of all components as separate deployments. Also, we can run the whole system locally as a single binary.
- Every pod runs the same binary with different configuration.
- We can configure how our application can be spliced into different K8S deployments.

### Running components

The most interesting part of Service Weaver is how it can run components. Service Weaver provides an API to choose how your components will be deployed on servers. We can choose whether we want to have one monolithic application, or microservices, or group some services together. We can do it by changing [ a config file](https://github.com/ServiceWeaver/weaver/blob/cc531645188f3a28afa29b0edab284031cff8e66/examples/collatz/colocated.toml#L5)
```
colocate = [
  [
    "component-a",
    "component-b"    
  ],
  [
    "component-c",
    "component-d"
  ]
]
```
- In this example, we have two groups of components.
- Every group will be deployed as a separate k8s deployment (two deployments).
- For example, component-a and component-b will be the same Golang process with shared memory.

This can help us create groups of similar components that communicate a lot with each other and run in one process without HTTP requests. It will save some additional resources and improve stability.

Teams create separate components, but choosing how they will be run can be done later. Also, it helps us when we start, we can start with running as a single monolith, but later split into many servers.

### Communication between components
![communication between components of Service Weaver](/assets/article-service-weaver/service-weaver-communicating.webp)

```golang
// component-a
products, err := fe.componentBService.Get().ListProducts()
```

- Every component has a wrapper for HTTP requests between components. For example, `componentBService` is a wrapper for all methods of component-b component.
- If `Component A` is deployed with `Component B``
  - The wrapper will execute Go code without HTTP request.
  - Otherwise, the wrapper will execute HTTP request by network to `Component B`.
- The wrapper implements an effective way to communicate between components with low cost on processing data.

By default, Service Weaver does not provide solutions for circuit breakers, retries, timeouts, etc. But we can implement them by ourselves.

### Logging/Tracing/Metrics
Service Weaver provides tooling and integrations with metrics/logging/tracing by default. This is one of the topics that usually is not covered by open source frameworks. Because, usually, each company has their own set of tools and it is hard to implement a universal solution. But anyway, it is a good idea to provide basic metrics/tracing/profiling which engineers can customize if the company uses different tools.

### Some thoughts about Service Weaver

It seems that Service Weaver was created by a big company to promote their Google Cloud service. Because Service Weaver does not use Google internally and this is not just an open source tool for internal use. So they spent money on creating an open source tool for different companies. Maybe they expect to create something popular like Next.js from Vercel which helps to promote their services to customers. It will be interesting to see if this project will be successful and we can see similar solutions from other companies like AWS, Azure, etc. It can create a lot of competition between open source solutions.

Service Weaver is a new solution without many users. And the core functionality of splitting components into many deployments does not look polished. It has only [one configuration](https://github.com/ServiceWeaver/weaver/blob/cc531645188f3a28afa29b0edab284031cff8e66/examples/collatz/colocated.toml#L5). Also, in general, this solution tries to be a deployment solution, but does not provide many options. For example, in one of my previous companies, I could not deploy it in the company's K8S.

What happens if the project has 100+ components and millions of lines of code? It seems that one binary will be a problem. We need to have additional tooling for monorepo which can solve this.

But anyway, it is a good idea with the option to split projects into many parts and run them in different modes.

## How can it be implemented in Node.js?
![node.js implementation](/assets/article-service-weaver/nodejs-implementation.webp)

In general, the same, but I would like to add some additional features:

- Tooling for monorepo. By default, provide tooling like NX which helps to cache the build of components and run only the changed components.
- Generate not only one binary with all components, but combine components into groups and create many Docker containers such as one group = one Docker container.
- Node.js will load a config file with information about components/network/groups and will load components as local files. Also, we can add dynamic loading of components by network if needed.
- CLI will generate K8S manifests as before, but also generate LB with correct routing between components.
- Tooling that helps to find the best way to split components into groups based on metrics/imports.

That's all

## Conclusion

I really like this new approach, because it solves many problems with microservices and adds flexibility with choosing how I want to run them. This approach is suitable only for small/mid-sized projects, not for big companies or very large projects. But I would try to use this approach in my next project. Also, Service Weaver provides an interesting idea related to the deployment model which I may mention in one of my next articles.
