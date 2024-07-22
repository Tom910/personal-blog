---
date: "2024-07-22"
title: Edge Computing Demystified - From ISP Architecture to Global Content Delivery
tags:
  - edge
  - network
description: Edge computing is revolutionizing internet infrastructure by bringing computation and data storage closer to end-users. This article delves into the intricacies of Edge networks, from ISP architecture to global content delivery systems. We explore how Edge computing reduces latency, improves performance, and enables new technologies. Key topics include

---

Previous article about networks in my blog:
- [Demystifying Network Infrastructure - From Basics to Data Centers for Developers](https://amarchenko.dev/blog/2023-10-02-network/)

Edge computing is revolutionizing internet infrastructure by bringing computation and data storage closer to end-users. This article delves into the intricacies of Edge networks, from ISP architecture to global content delivery systems. We explore how Edge computing reduces latency, improves performance, and enables new technologies. Key topics include:

- The structure of ISP networks and their role in Edge computing
- How major tech companies implement Edge nodes and POPs (Points of Presence)
- The process of connecting users to the nearest Edge servers
- Advantages of Edge computing, including reduced latency and traffic


## How ISPs Work Inside

In 2013, I worked for an ISP (Internet Service Provider) in a small city. It was a local provider that offered unlimited LAN internet to users in that area. Here's how it worked inside:

![isp overview](/assets/article-edge/isp-overview.webp)

ISPs usually have 3 main parts in their networks:
- Last Mile: This is the hardware hosted very close to the client of the internet provider. Usually, it's structured like this: client router -> provider switch.

- Aggregation Layer: This hardware connects many last-mile connections into one group. It goes from provider switch -> aggregator switch. ISPs typically create area points of traffic that aggregate multiple last-mile connections because it's not optimal to create a separate cable for each last-mile connection.

- Core Network: This is the main network that has connections with all aggregation layers and other integrations. It might be circular, where every switch has two connections in opposite directions. With this design, if one line breaks, the internet would still work. This layer has connections to:
  - ISP Tier 2 providers: This is the window to the global internet. ISP Tier 3 providers pay for the channel and create infrastructure to connect with them.
  - Edge nodes: Various hardware that hosts global services.
  - Traffic exchange points: ISP Tier 3 can have connections with IXPs (Internet Exchange Points) which connected with other ISP Tier 3 providers for faster P2P traffic between clients.

ISPs care a lot about traffic because it's directly related to money. They pay for channels between them and higher-level providers. They don't pay for traffic by terabytes but pay for using a channel with a speed limit. To pay less, ISPs try to optimize channels for users by buying less bandwidth than they promise to users, expecting that not all people will use the internet at 100% capacity simultaneously. Also, more traffic requires more hardware, which costs money.

More than 10 years ago, the provider where I worked already had Edge servers from Google. It was a couple of server racks that Google provided for free to the ISP. The provider only needed to connect them to their local network and provide an internet connection. These were just servers with a bunch of HDD disks. Edge servers helped improve the quality of YouTube videos for end users, especially for popular videos. Google used these servers as Edge nodes for caching data for google.com and youtube.com.

It improved quality in the past, but now Edge nodes are much more important because over 50% of all traffic is media content like images and videos. Media content is very easy to cache, and many big companies like Google, Netflix, AWS, Meta, Cloudflare, and Akamai have edge nodes for caching content very close to clients. Without them, ISP providers would require much more bandwidth than they have now. So ISPs have a direct interest in having Edge nodes in their network because it reduces external traffic and can help save money.

Interesting fact: I lived in London in a new, large building. Every evening, I had problems with my internet connection, with latency up to 600ms to Google or packet loss. Tracing showed that I had the problem in the middle between the last mile and core network. One of the aggregating servers was overloaded and couldn't handle all the new traffic from new buildings. After many messages with the internet provider, who initially wanted to reload or replace my router, they increased capacity, and my internet started working as expected.

## Edge Servers Deep Dive

![request flow](/assets/article-edge/request-flow.webp)

Every request goes through many servers and companies. Usually, companies host their services in data centers connected to ISP Tier 1 levels, which might be far from the customer. So, a request goes through ISP Tier 3 -> ISP Tier 2 -> ISP Tier 1 (there might be multiple ISP Tier 1s) -> Data center. Each ISP level has bandwidth limits, and networks self-optimize by finding optimal ways to reach data centers. Sometimes this might mean that a client sends a package to a data center using one set of networks, but the data center returns the answer using different networks because the previous network is overloaded, or the data center now has a more optimal path. All of this costs money, especially for data centers that have bandwidth limits, and in general, the network is unpredictable, so customers might have issues with their connection.


To address these issues, big companies created Edge technology, which added additional servers to the network:

![edge overview](/assets/article-edge/edge-overview.webp)

####  Edge Node

- Several racks containing 5-20 servers
- Thousands of points across the world

ISP Tier 3 providers usually don't have a lot of space or power for hardware, so they have limits on the number of servers. But companies can create edge nodes across the world in very remote locations that don't have any data centers close to customers. Edge nodes manage connections, run custom computing (cache, compute functions, security), and can store data on disks. Inside, they're typical servers with disks for data.

Edge Nodes are connected to Edge POPs using shared internet connections. In addition, Edge nodes are hosted in less controlled environments, which creates limitations on the storage of protected data.

#### Edge POP

- Many racks containing 100-300 servers
- Hundreds of points across the world

Companies have a limited number of data centers because, in reality, they need to create not a single data center but a region with three data centers that are close to each other. This requires special sources of energy and internet connections. But they need to have big points of traffic to connect many Edge Nodes and be a point for popular content in the region. It isn't a data center, but it still has hundreds of servers inside.

Edge POPs are connected to other Edge POP nodes and nearby data centers/regions using private networks.

#### Private networks 
Globally, we have shared internet connections provided by ISP Tier 1 level companies. These connections are used by small companies, and all packages have the same priority. Because it's a shared network, it has bandwidth limits and sometimes has latency problems. To handle this issue, big companies create their own private networks which they can use only for their purposes. This helps them:
- Reduce latency
- Increase bandwidth
- Improve quality
- Build an optimal network between data centers/regions/Edge POPs

Here's how it looks using [Google as an example:](https://cloud.google.com/blog/products/networking/understanding-google-cloud-network-edge-points):

![google gcp regions](/assets/article-edge/google-gcp-regions.webp)

They use Edge nodes (grey dots), Edge POPs (red dots), and private networks (blue lines). Similar architecture is also used by other companies like [AWS](https://blog.awsfundamentals.com/aws-edge-locations), Meta, Cloudflare, Akamai, etc.


### How Can a Client Find an Edge Server?

![edge discovery](/assets/article-edge/edge-discovery.webp)

It's an additional challenge to find the closest Edge nodes or data centers. To handle this, companies create services that map ISP providers to the closest Edge servers and collect metrics from Edge nodes and clients to choose the most optimal points.

The core system is Geo DNS technology, which can send different IP addresses per client. When a client wants to connect to google.com, the client first sends a request to the DNS resolver set up in the system. By default, users use the DNS resolver from their ISP provider (for example, internet providers like Comcast or Verizon). The ISP's DNS resolver sends a request to the Global DNS resolver to get the IP address of the DNS resolver for google.com. This is where the ISP's part ends, and companies can control which IP addresses will be used by the ISP.

When resolving the DNS name, the ISP DNS resolver provides additional information like the IP address of the server and the client subnet (if ECS is enabled). This request comes to the closest google.com DNS resolver using anycast. Google hosts DNS resolvers in each region. The DNS resolver fetches information from the DNS mapper, providing all information about location and ISP provider. The DNS mapper fetches the closest active points from the database and returns a set of IP addresses. As a result, clients of this ISP provider would use their own set of IP addresses to connect to nearby Edge Nodes. If a user uses a custom DNS provider, like 8.8.8.8, the Google DNS provider provides the client IP subnet (for example, 244.178.44.0/24), which can be used for mapping to the ISP and sent to the closest Edge node.

For example, you can resolve IP addresses for [google.com from different locations:](https://dnschecker.org/#A/www.google.com):
![DNS resolves for google.com](/assets/article-edge/dns-resolves-google-com.webp)

Each location has a different set of IP addresses.

Another important part of the system is metrics from clients and Edge nodes. Edge nodes can be overloaded, and the system needs to move part of the traffic to other nodes/POPs. It also needs to track timings from clients and choose the most optimal servers to reduce latency. This is necessary because an ISP might not have a dedicated Edge node, and networks change over time.

It's a complex system. That's why many companies just use AWS or Cloudflare, which provide these features out of the box.

### Advantages of EDGE

#### Reducing Latency and Improving Quality

![ssl latency without edge](/assets/article-edge/ssl-latency-without-edge.webp)

One of the main advantages of Edge computing is reducing latency for distant clients. To make SSL connections, a client needs to make 2-5 hops to the server. If the latency between client and server is 200 ms, the client would have 4 * 200 = 800 ms in total just for creating an SSL connection.

![ssl latency with edge](/assets/article-edge/ssl-latency-with-edge.webp)

But with Edge nodes, we can reduce the latency to 40 ms. This is because Edge Nodes are located very close to the user, allowing connections with just 10 ms latency. Edge nodes work as proxies and send all requests to other Edge POPs/data centers while reusing a pool of connections, without creating an SSL connection for each request.

This helps not only with creating SSL connections but also with maintaining "hot" connections that use maximum bandwidth. It avoids small packages at the start with Congestion Control, TCP Window Scaling, and other techniques. As a result, clients can download files faster. Additionally, private networks and agreements with ISP providers can improve connection quality.

#### Reducing Traffic

Traffic reduction was the main reason for creating Edge nodes in the past. Edge nodes have disks where they can store popular content. Because Edge nodes/POPs handle traffic from users in the same location, people usually watch similar content, for example, videos from Mr. Beast. So, an Edge node can download popular content once and distribute it to other clients. Edge Nodes and Edge POPs can significantly reduce traffic to popular resources.

#### Preventing DDoS Attacks

Anti-DDoS services are fundamentally Edge nodes. They have many servers across the world to proxy traffic to the original server. This helps localize DDoS attacks per country and stop them from reaching the original server. As a result, companies have added Anti-DDoS capabilities to Edge nodes as an additional feature.

## Edge Computing

![Edge computing](/assets/article-edge/edge-computing.webp)

Edge computing is a newer idea that has gained popularity in recent years. Big companies already had Edge nodes/POPs very close to users, which helped reduce latency for static files. A significant part of many applications is backend logic, like generating HTML/API responses. The idea was to reuse existing Edge infrastructure to run fast, small programs that could handle requests. So instead of waiting for a response from a distant server, users could get data from local Edge nodes. While this works, it creates some limitations:

- We move compute to Edge nodes, but what about databases? Do we also need to move data to Edge nodes? There's too much data for that. So, Edge computing requires different architectures that reduce data consumption and connections with large databases.
- Edge nodes have computing limits. Companies can't create powerful servers at each point, so it's easy to overload them. Usually, Edge computing requires additional optimizations and limitations.

Edge computing is a cool idea that can help create blazing fast sites that can load in dozens of milliseconds. However, it's not easy to implement and requires special architectures that work within these limitations. For these reasons, Vercel stopped using Edge and moved to data centers, as it isn't suitable for common cases. But it could be a good idea to use for something like Google search, because the main page is simple and doesn't have a lot of functionality. An Edge Node could get information from a user JWT session, generate an HTML page per user, and send it, all done on the Edge Node (though it looks like they don't do this).

![Edge P2P communication](/assets/article-edge/edge-p2p-communication.webp)

Edge computing can also be used for P2P communication between two clients without using data centers. Because most users are behind NAT, they can't create P2P connections directly. So, services use an additional layer to create a connection between users and recent data. But Edge Nodes + POPs can solve this much more effectively for users who are close to each other. Requests would be proxied on Edge nodes/POPs without being sent to data centers.

## Real-World Examples of Edge

- YouTube: Google uses Edge nodes to cache popular video content closer to users. This significantly reduces buffering times and improves video quality, especially for trending videos.
- Netflix: Large number of Edge servers within ISP networks. This allows popular shows and movies to be stored locally, reducing bandwidth costs and improving streaming quality.
- Akamai: As one of the world's largest content delivery network (CDN) providers, Akamai uses thousands of edge servers worldwide to deliver web content, media, and software downloads.
- Fastly: Another CDN/Edge provider, The New York Times uses Fastly to deliver breaking news updates and personalized content recommendations faster
- Cloudflare Workers: This platform allows developers to run serverless code at the edge. For example, the messaging app Discord uses Cloudflare Workers to route API requests to the nearest data center.
- Amazon CloudFront Functions: Technology helps modify responses, verify authorization

## Conclusion

Edge is an interesting concept that we all use every day when visiting YouTube, Netflix, or social media platforms. It helps reduce global traffic between ISPs. However, it also requires complex infrastructure, specific architecture, and a lot of money to build. Despite these challenges, the benefits of Edge computing in terms of performance and user experience make it a valuable technology for many large-scale online services.
