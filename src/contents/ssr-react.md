---
author: Andrei Marchenko
datetime: 2023-01-15T10:00:00Z
title: What the problem with Node.js React SSR and how to solve it
slug: react-ssr-problem-and-solution
featured: true
draft: true
tags:
  - react
  - node.js
  - performance
ogImage: ""
description: Optimizing CSS is a critical aspect of improving the performance of any website. In this post, I will share my experience and knowledge on how to optimize CSS for better performance.
---

- load data - parallel, cache data, dedup, keep-alive, background update, cache first
- event loop
- LRU cache for calculation
- render only critical parts
- deadlines
- problem between CPU bound and IO bound in the same time
- 1 ms is matter. Example with worker on shop. If we add more actions what they need to do, they can do less thing in a minute
