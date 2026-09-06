---
title: "Burp Suite Custom Scan Profiles"
date: "2023-11-27"
description: "How to build tailored crawl and audit configurations in Burp Suite so scans focus on the vulnerabilities that matter most."
tags:
  - appsec
  - bug-bounty
  - burp-suite
---

# Introduction

السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ

Hello, everyone. My name is Mohammad Saqlain (mrrootsec).

Have you ever wondered if your web application security testing could be more than just routine checks? Well, imagine a tool that not only does the job but does it your way. That's exactly what we're diving into today with Burp Suite's custom scan profiles. It's about transforming routine checks into a tailored, strategic approach — think of it as adding your unique masala (mix) to the recipe of security testing. It's not just about following steps, it's about adding your personal flair to uncover hidden vulnerabilities. Are you ready to unlock a new level of testing prowess? Let's dive in and explore together!

# Why Custom Scan Profiles?

Have you ever used a one-size-fits-all solution and found it lacking? That's often the case with standard security testing methods. Enter the world of custom scan profiles in Burp Suite. But first, let's talk about what scan profiles are. In general, they are predefined sets of rules and parameters that guide how Burp Suite conducts its scans. These profiles determine what to test and how effectively to do it.

Now, why go custom? Imagine having the ability to tailor these rules to fit the unique shape of your web application testing. Custom scan profiles allow you to focus exactly where it matters most — increasing careful examination on known weak spots while reducing noise from less relevant areas. These profiles let us focus on specific vulnerabilities and application behaviors, making our testing not just faster, but smarter.

# Let's Create Custom Scan Profiles

Navigating through the customization of scan profiles in Burp Suite can seem complex, but it's a straightforward process once you know the steps. In this guide, I'll walk you through each phase, ensuring that you can confidently create your own scan profiles. Whether you're an experienced security professional or new to the field, these guidelines will help you optimize your testing strategy effectively.

Before customizing scan profiles, let's first take a moment to explore the default ones available in Burp Suite. Navigate to **Burp > Configuration Library > Built-in**.

Here, you can review the pre-default profiles. It's a great way to understand how specific options define each profile and what they're designed to target. This initial review will give you a solid foundation for creating your own custom profiles.

![Burp Suite's built-in default scan configuration profiles](/assets/images/burpsuite-custom-scan-profiles/Untitled_1.png)

## 1. Customizing the Crawler

Crawling is essentially like creating a detailed map of a web application. It's an important step where you explore every part of the app to understand its structure and pinpoint potential security weak spots. And here's the cool part — in Burp Suite, you get to customize how this exploration is conducted with custom crawl profiles.

When you dive into customizing your crawl profile, you'll see a variety of settings that you can tweak to make the crawl perfectly suited for your application. Think about how detailed you want your exploration to be. With crawl optimization strategies like "Faster", "Fastest", "Normal", "Complete", and others, you're in control of the balance between speed and depth.

Navigate to **Burp > Configuration Library > New > Crawling** to create the custom crawler.

![Creating a new custom crawler configuration in Burp Suite](/assets/images/burpsuite-custom-scan-profiles/Untitled_2.png)

Setting limits on the crawl duration is another handy feature — it keeps your exploration focused and efficient. And if your app requires logging in, you can configure the crawler to handle login pages by either registering itself or managing login failures. This ensures that no part of your app is left unexplored.

![Crawl duration limits and login-handling settings](/assets/images/burpsuite-custom-scan-profiles/Untitled_3.png)

Now, let's talk about handling errors. You can decide how the crawler should react if it encounters issues like request timeouts. This is crucial for keeping your crawl stable and productive.

![Crawler error-handling settings for request timeouts](/assets/images/burpsuite-custom-scan-profiles/Untitled_4.png)

There's more! You can also customize how the crawler interacts with forms, set a specific user agent, and decide whether to follow or ignore the guidelines set by `robots.txt` and `sitemap.xml` files. And for those hidden gems in your app, like hidden links in JavaScript or API endpoints, the crawler can be set up to discover and follow these as well. For applications using GraphQL, the ability to check for GraphQL introspection is just the cherry on top.

![Crawler form handling, user agent, robots.txt, and GraphQL introspection settings](/assets/images/burpsuite-custom-scan-profiles/Untitled_5.png)

## 2. Creating Vulnerability-Specific Scan Profiles

When it comes to finding vulnerabilities, it's often best to look for specific ones rather than doing a broad check. This is where creating special profiles for certain types of vulnerabilities can be really helpful — think of it like having a special tool for each type of problem.

You can set up custom scan profiles that are fine-tuned to detect specific vulnerabilities. This way, instead of doing a big, general scan that might miss some important details, you can direct the tool's powerful scanning capabilities precisely where they are needed most — whether it's cross-site scripting, SQL injection, XXE, open redirection, server-side request forgery, or any other specific vulnerability class.

Let's break down some of the important configuration aspects that apply across various vulnerabilities.

Navigate to **Burp > Configuration Library > New > Auditing**, and define your configuration name as you like.

**Audit Optimization** — This setting lets you control how fast and accurately audits your application. You can choose between `Fast`, `Normal`, and `Thorough` for speed, and adjust accuracy to minimize false negatives or minimize false positives. It's about finding the right balance for your specific testing needs.

![Audit optimization settings: Fast, Normal, and Thorough](/assets/images/burpsuite-custom-scan-profiles/Untitled_6.png)

**Issues Reported** — Here, you decide which security issues you should look for. You can pick specific categories like XSS, SQL injection, open redirection, XXE, path traversal, GraphQL, JWT checks, SSRF, web cache poisoning, client-side desync, and more — and even specify the detection method, like looking for reflected, stored, or DOM-based XSS.

![Selecting which issue categories the audit should report](/assets/images/burpsuite-custom-scan-profiles/Untitled_7.png)

**Handling Application Errors During Audit** — This helps you manage how the scanner reacts if it encounters errors, like if it fails several times in a row or at certain points, so it keeps working smoothly even when it hits a few bumps.

**Insertion Point Types** — This is where you tell the scanner where to try putting payloads: URL parameters, body parameters, cookies, headers, and more.

![Configuring insertion point types for payload placement](/assets/images/burpsuite-custom-scan-profiles/Untitled_8.png)

**Modifying Location Parameters** — With this, you can move parameters around during the scan, like from the URL to the body of a request, or from cookies to the URL. It's a way to test how your application handles data in different places — sometimes helpful for bypassing firewalls.

![Modifying location parameters settings](/assets/images/burpsuite-custom-scan-profiles/Untitled_9.png)

**Ignored Insertion Points** — Here, you can tell the scanner to skip certain parts of your application that you know are safe or not relevant, so it doesn't waste time on areas you're already confident about.

**Frequently Occurring Insertion Points** — This option lets you focus the scanner on areas where issues are most likely to happen, like specific URL or body parameters.

![Frequently occurring insertion points settings](/assets/images/burpsuite-custom-scan-profiles/Untitled_10.png)

**JavaScript Analysis** — These settings control how the scanner looks at JavaScript in your application, using either dynamic or static analysis.

### Let's Take a Look at Created Vulnerability-Specific Profiles

#### Cross-Site Scripting

![Cross-site scripting scan profile overview](/assets/images/burpsuite-custom-scan-profiles/Untitled_11.png)

Select the issues that are cross-site scripting related only.

![Selecting only cross-site-scripting-related issues](/assets/images/burpsuite-custom-scan-profiles/Untitled_12.png)

You can also define detection methods like the image below — this will vary for other vulnerabilities.

![XSS detection method configuration](/assets/images/burpsuite-custom-scan-profiles/Untitled_13.png)

Determine where XSS is most likely to occur. By specifying these insertion points, you guide the scanner to focus on areas where XSS is most likely to be found.

![XSS-focused insertion point configuration](/assets/images/burpsuite-custom-scan-profiles/Untitled_14.png)

Not all parts of an application are equally vulnerable to XSS. You can configure the scan to ignore certain insertion points that are less likely to be affected, such as session cookies, and instead focus on places where user input is reflected or stored — search fields, comment sections, user profiles, and so on.

![Ignoring low-value insertion points such as cookies for XSS scanning](/assets/images/burpsuite-custom-scan-profiles/Untitled_15.png)

![Ignored insertion points configuration, continued](/assets/images/burpsuite-custom-scan-profiles/Untitled_16.png)

You might need to adjust advanced settings like custom error messages, redirection behaviors, JavaScript analysis, or specific script contexts. This level of customization ensures the scanner can effectively identify XSS in different scenarios.

#### SQL Injection

Based on the vulnerability, there will be slight differences in configuration.

![SQL injection scan profile configuration](/assets/images/burpsuite-custom-scan-profiles/Untitled_17.png)

![SQL injection scan profile configuration, continued](/assets/images/burpsuite-custom-scan-profiles/Untitled_18.png)

![SQL injection scan profile configuration, continued](/assets/images/burpsuite-custom-scan-profiles/Untitled_19.png)

![SQL injection scan profile configuration, continued](/assets/images/burpsuite-custom-scan-profiles/Untitled_20.png)

![SQL injection scan profile configuration, continued](/assets/images/burpsuite-custom-scan-profiles/Untitled_21.png)

#### JWT Misconfiguration

![JWT misconfiguration scan profile configuration](/assets/images/burpsuite-custom-scan-profiles/Untitled_22.png)

![JWT misconfiguration scan profile configuration, continued](/assets/images/burpsuite-custom-scan-profiles/Untitled_23.png)

![JWT misconfiguration scan profile configuration, continued](/assets/images/burpsuite-custom-scan-profiles/Untitled_24.png)

#### GraphQL

![GraphQL scan profile configuration](/assets/images/burpsuite-custom-scan-profiles/Untitled_25.png)

#### Path Traversal

![Path traversal scan profile configuration](/assets/images/burpsuite-custom-scan-profiles/Untitled_26.png)

![Path traversal scan profile configuration, continued](/assets/images/burpsuite-custom-scan-profiles/Untitled_27.png)

![Path traversal scan profile configuration, continued](/assets/images/burpsuite-custom-scan-profiles/Untitled_28.png)

#### Injections

![Injection-focused scan profile configuration](/assets/images/burpsuite-custom-scan-profiles/Untitled_29.png)

![Injection-focused scan profile configuration, continued](/assets/images/burpsuite-custom-scan-profiles/Untitled_30.png)

![Injection-focused scan profile configuration, continued](/assets/images/burpsuite-custom-scan-profiles/Untitled_31.png)

![Injection-focused scan profile configuration, continued](/assets/images/burpsuite-custom-scan-profiles/Untitled_32.png)

#### XML External Entity

![XML external entity (XXE) scan profile configuration](/assets/images/burpsuite-custom-scan-profiles/Untitled_33.png)

![XML external entity (XXE) scan profile configuration, continued](/assets/images/burpsuite-custom-scan-profiles/Untitled_34.png)

#### Web Cache Poisoning & Client-Side Desync

![Web cache poisoning and client-side desync scan profile configuration](/assets/images/burpsuite-custom-scan-profiles/Untitled_35.png)

#### Server-Side Request Forgery

![Server-side request forgery (SSRF) scan profile configuration](/assets/images/burpsuite-custom-scan-profiles/Untitled_36.png)

You can create more as well.

# Wrapping It Up

Creating and customizing your scan profiles in Burp Suite is a powerful approach to web application security testing. These tailored scans are incredibly useful for zeroing in on the most vulnerable parts of your application, helping to generate precise test cases that uncover hidden vulnerabilities. Remember, each application is unique, and so are its security needs — customizing your scans isn't just following best practices, it's setting a new standard in proactive security testing.

I'd love to hear about your experience hunting down bugs with custom scans — how have they helped you catch the trickier ones? Let's share our experiences and learn from each other.

And hey, don't forget to keep an eye out for my next blog post — there's always more to explore in this ever-changing world of web security. If you spot any mistakes or have suggestions, please reach out to me. I'm always eager to learn and improve.
