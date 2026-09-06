---
title: "Wonders of HTTP Headers"
date: "2024-01-20"
description: "A tour of HTTP headers, common misconfigurations, and how they get exploited — a talk given at the NULL Hyderabad meetup."
tags:
  - appsec
  - bug-bounty
  - http
---

السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ

Hello everyone! I am excited to share the recent session I presented on the fascinating world of HTTP headers at NULL Hyderabad meetup on January 20, 2024.

This session covers the basics of HTTP headers such as `Host`, `User-Agent`, `Referer`, `Origin`, message body information (`Content-Type`, `Content-Encoding`), cache headers, and location-change headers (`X-Forwarded-*`, `X-Host`, `X-Remote-*`) — their importance, and how they can be made vulnerable. We looked at different situations like errors in responses, incorrect settings, and conflicts in settings, to see how they can be exploited. We also discussed remediations and measures to protect against these vulnerabilities.

During the session, I provided several resources to help attendees dive deeper into the topic, including slides and additional reading materials. You can find the slides [here](https://docs.google.com/presentation/d/1pR-_dNq9zAgMH1tJv6diPFqEYtNY3fopzJnaiiT-j6A/edit?usp=sharing).

Stay curious and keep learning! 🙌
