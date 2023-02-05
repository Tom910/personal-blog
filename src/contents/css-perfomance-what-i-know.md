---
author: Andrei Marchenko
datetime: 2023-01-15T10:00:00Z
title: CSS Delivery perfomance. What I know. Checklist
slug: css-perfomance-what-i-know
featured: true
draft: false
tags:
  - performance
  - css
ogImage: ""
description: Optimizing CSS is a critical aspect of improving the performance of any website. In this post, I will share my experience and knowledge on how to optimize CSS for better performance.
---

![css perfomance title](/assets/css-performance-title.jpg)

CSS optimization is super important for WEB applications because it block displaying content and affect metrics such as [Largest Contentful Paint (LCP)](https://web.dev/lcp/) and [First Contentful Paint (FCP)](https://web.dev/fcp/). This ultimately affects how quickly users can view the content on the page. However, in my experience, optimizing and debugging CSS can be challenging. In this post, I will share my knowledge and experience on CSS performance optimization.

Every approach has parameters:

- Impact - The approximate effect on metrics
- implementation complexity - How hard to implement this approach in your project
- Types of applications - Which [types of applications](https://dev.to/pahanperera/visual-explanation-and-comparison-of-csr-ssr-ssg-and-isr-34ea) is this approach suitable for? Some optimization is useless for CSR applications that load on the client side and we don't need to optimize a lot of our HTML pages.

## Table of contents

## Minification

- Impact: -30% size of css files in brotli
- implementation complexity: easy
- Types of applications: All

I strongly recommend using CSS minification tools such as [cssnano](https://github.com/cssnano/cssnano) or [lightningcss](https://lightningcss.dev/). These tools help to remove unnecessary code

## Brotli compression

- Impact: -15 - -30% size of css files in gzip
- implementation complexity: medium
- Types of applications: All

Brotli is a new compression algorithm that is more efficient than gzip in compressing data. It is supported by all modern browsers and is easy to add a fallback for older browsers.

You can check if a file is in the brotli format by looking at the `"content-encoding"` header in the Chrome DevTools Network tab. If it says `"content-encoding=br"` then the file is in brotli format. If it says `"content-encoding=gzip"` then brotli compression is not enabled.

If you use a CDN, try to find the brotli option in the dashboard. If you use Nginx, you can use the ngx_brotli module. For Node.js (don't do it for static files, please), you can use a package from npm.

You can find more information about brotli on [web.dev](https://web.dev/codelab-text-compression-brotli/)

## CSS code splitting

- Impact: -50% size of css files on first load
- implementation complexity: easy/medium
- Types of applications: All

A lot of materials about Code splitting for JS, but not as much for CSS. However, the same approach can be used for CSS as well. By splitting CSS files into chunks, we can only load the files that are needed for the current page. Luckily, the [mini-css-extract-plugin](https://www.npmjs.com/package/mini-css-extract-plugin) for webpack can handle this automatically for us. However, I recommend checking to ensure that your CSS code splitting is working correctly.

To do this, you can:

- Open a page in the DevTools Network tab and check how many CSS files are loaded and their sizes.
- If you have multiple CSS files and they only contain classes used on that specific page, then code splitting is working properly.
- Or maybe your project import all CSS files in one index.js file like import './all-styles.scss'. In this case, you need to split 1 import into many imports into many JS files
- Or maybe your tool for CSS doesn't support code splitting, and you need to find in the documentation how to enable it"

## Control CSS and Font files loading processes

- Impact: -20% of LCP/FCP metrics
- implementation complexity: easy
- Types of applications: SSR/SSG

In general, CSS is a blocking resource and the browser will wait until the CSS file has been loaded and parsed before moving on (which can be escaped with JS but not with CSS). Our goal is prioritize CSS and fonts loading. We can do this by:

- In the HTML, placing the `<link href="" />` tag above the `<script src="" />` tag, as the browser will start loading CSS files before loading JS files.
- Using [link preload](https://web.dev/preload-critical-assets/) for CSS and fonts. In my experience, this is especially important for CSS files that are loaded asynchronously, such as when using CSS code splitting or async imports. In this cases very important as soon as posible provide `<link rel="preload" href="" as="style" />` for loading all necessary CSS files for current page. The same applies to font files, it's better to load all basic font files using link preload.
- Avoiding nested imports in CSS files. Otherwise we will have CSS loaded sequentially

## Critical CSS

- Impact: -40% of LCP/FCP metrics
- implementation complexity: hard
- Types of applications: SSR/SSG

Loading and displaying web pages is split into steps. First, the browser downloads the HTML, parse, found CSS files, and start downloading CSS files. Next, the browser parses the CSS files and renders the page. To download the CSS files, the browser needs to wait for the HTML to load, and then it makes new requests for the CSS files. This process can take hundreds of milliseconds, especially for users with slow internet connections. To improve the loading speed, it's ideal to display the content as soon as possible after loading the HTML and avoid loading separate CSS files. If we achieve this, our sites will be displayed as quickly as possible. It's possible to achieve this by inlining CSS files in HTML and removing loading separate CSS files

When we can use Critical CSS?

- If the current weight of CSS files on the page is less than 30kb. I don't recommend inlining hundreds of kilobytes of CSS files. Because we lost the ability to cache CSS files and better start to optimize the weight of CSS files
- JS files that are loading in async mode using the defer or async attributes. In another case it's better to move JS files in defer/async mode

How can we implement Critical CSS?

- CSS in JS solutions can generate critical CSS automatically. I recommend using CSS in js zero runtime libraries.
- Server can fetch CSS files and inline them in HTML. The server fetches CSS files, transforms links, and inlines them as text in HTML. [Example of solution](https://github.com/Tinkoff/tramvai/blob/a8d27e6bc4dd97d8208aacfb95b19d74d3f565c5/packages/modules/render/src/resourcesInliner/resourcesInliner.ts)
- On the build step, we can use libraries like critical which extract critical CSS from HTML, but it's suitable only for small and static sites.

In my experience, Critical CSS is very hard to implement if your tooling doesn't support it. For example, one of our projects used CSS modules and we had only the option with fetch CSS files

## Avoid Inlining Large Images in CSS Files

- Impact: -5% - -95%(yea) size of css files
- implementation complexity: easy
- Types of applications: All

I have found sites where CSS file weigh megabytes. This usually happens because Webpack has [url-loader](https://v4.webpack.js.org/loaders/url-loader/) or [asset modules](https://webpack.js.org/guides/asset-modules/), which can inline images/fonts in CSS files. But it's not always good idea because CSS files very important for performance and first render but images not. When you inline large images in CSS files, it increases the size of the CSS files and, as a result, increases the time for the first render.

To avoid this, you can:

- Check your CSS files for large files.
- Always use the `limit` option, I recommend setting it to 1kb for images.
- If you are inlining fonts, ensure that you are only inlining the necessary fonts and only inlining the woff2 format.

## Avoid Using Base64 for SVG in CSS

- Impact: -5% size of css files in brotli if you inline SVG in CSS
- implementation complexity: ?
- Types of applications: All

base64 bad for compression but SVG is text format and it's can be compressed. So check how you inline SVG in CSS and if you use base64 try to change to text format.

## Avoid Generating Large Numbers of CSS Classes in Loops

- Impact: -10% size of css files in brotli
- implementation complexity: easy
- Types of applications: All

SASS, Less, and PostCSS all have for loop constructs such as `@for $i from 1 through 100 { ul:nth-child(3n + #{$i}) { color: red; } }`. However, this code will generate 100 classes which can negatively impact the performance and size of CSS files. In some cases I found files which generated 40 Kb of CSS code for grid system. In many cases, we can avoid using for loop constructs by using [CSS variables](https://www.w3schools.com/css/css3_variables.asp), such as in [this aprouch](https://css-tricks.com/super-power-grid-components-with-css-custom-properties/) which avoids unnecessary generation of classes.

## CSS modules with non random hash

- Impact: -10% size of css files in brotli
- implementation complexity: easy
- Types of applications: ALL

CSS modules automatically generate unique class names for CSS properties to prevent sharing of class properties between different components. By default, CSS modules generate class names such as `.b8bW2Vg3fwHozO { color: red; } .ht3J5Tu6LeK4rG { color: green; }` for a file called `Button.css` using the `localIdentName='[hash:base64]'` option in Webpack. The problem is base64, CSS files consist of many classes and they will all contain unique values which bad for compressing.

We can achieve the same goal but generate fewer unique strings, which are badly compressed. One solution is to generate a hash prefix for a file and add a unique character for each class. For example, using `localIdentName='[minicss]'` will make the Button.css file look like this `.a8bW2Vg3 { color: red; } .b8bW2Vg3 { color: green; }`, where `8bW2Vg3` is reused between all classes in the file. This will reduce the size of CSS files after compression.

[Artical with details](https://dev.to/denisx/reduce-bundle-size-via-one-letter-css-classname-hash-strategy-10g6), [Example of library](https://github.com/Tinkoff/tramvai/tree/a8d27e6bc4dd97d8208aacfb95b19d74d3f565c5/packages/libs/minicss)

## Optimizing CSS Animations to Avoid Triggers Layout or Paint

- Impact: -10% size of runtime performance
- implementation complexity: middle
- Types of applications: ALL

I have rules when I'm creating CSS animation I always check Performance in Devtools. Because I have had past experiences where a project used a Loaded component to indicate when the site was loading new data or rendering a new page. The component was created to display a nice animated ring as a loading indicator. But, the Loaded component using SVG animation and had a very bad performance. This caused a half amount of time to be spent on the animation instead of useful loading. Users like fast interfaces and animations, it is important to either learn how to create animations with good performance or avoid using them overall.

## CSS in JS zero runtime instead of CSS in JS

- Impact: -20% size of runtime performance
- implementation complexity: middle
- Types of applications: ALL

CSS in JS is very important right now in React community, but CSS in JS has problems with performance because they use JavaScript to generate CSS. This requires additional JS code to be downloaded, parsed, and generated, and then injected into the browser. Overall it's many additional works that don't have classic static CSS solutions. However, CSS in JS improves developer experience (DX). To balance these trade-offs, it's possible to use CSS in JS zero runtime libraries like [linaria](https://linaria.dev/) . These libraries provide similar functionality as CSS in JS with some limitations, but generate static CSS files that improve performance. They have tooling that runs at build time, which transforms your code into plain CSS with added functionality around CSS variables

I recommend giving [linaria](https://linaria.dev/) a try for your next project

## Atomic CSS

- Impact: -20% size of runtime performance
- implementation complexity: middle
- Types of applications: ALL

CSS files usually contain a similar set of parameters. As a result, our CSS files contain a lot of duplicates. But, Atomic CSS improve this situation by create classeses with 1 properties and reuse them betwen classes. It works like this: classic aprouch `.our-class { color: red; font-size: 14px; }` atomic CSS aprouch `.a { color: red; } .b { font-size: 14px; }`. In this example in general nothing changed but if we have 1000 classes they reuse a lot of properties and on big size our CSS almost will stop to increase

## Find large CSS files after build

- Impact: -10% size of runtime performance
- implementation complexity: easy
- Types of applications: for CSS modules projects

If we are using webpack we have some tools like [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer) to help understand which JS files are large and used. But, these toolings in general don't work with CSS files, as they are removed from statistics due to the use of [mini-css-extract-plugin](https://www.npmjs.com/package/mini-css-extract-plugin) which separates them into external files. As result, we don't see CSS files and can skip very big CSS files. To solve this issue, we can modify our build tooling to disable the use of [mini-css-extract-plugin](https://www.npmjs.com/package/mini-css-extract-plugin) and instead use style-loader. This will allow us to see CSS files in the bundle analyzer tool and identify large CSS files that need to be optimized. I recommend doing this periodically

## Remove zombie (unused) CSS

- Impact: -10% size of runtime performance
- implementation complexity: easy
- Types of applications: for CSS modules projects

In my experience CSS always grow size because we usually add new functionality, and sometimes we refactor or delete functionality but in all these cases increases our CSS. One of the reasons why Zombie CSS is happening is that we don't have linters and we can just skip removing unnecessary CSS after changing our JS. I recommend finding big CSS files and checking if we have zombie CSS in them. Additionally, using tools like purgeCSS to analyze your JS, CSS, and HTML files can help identify and eliminate any unnecessary CSS."

If you know other ways to improve CSS perfomance, please share it in [twitter](https://twitter.com/Tom910ru)

## What is next?

- [CSS runtime performance | Nolan Lawson | performance.now() 2022](https://www.youtube.com/watch?v=nWcexTnvIKI)
