---
title: The OPNsense API is the same door the GUI already uses
tags: opnsense, api, firewall, documentation
canonical_url: https://brayden-code-4.github.io/TW4-Delivrable/blog/opnsense-api-same-as-gui
---

Paste this file into Dev.to, Hashnode or Medium. Keep the canonical URL so the Docusaurus post remains the main copy.

This article explains why we document OPNsense as a firewall appliance with a REST API, not as a Node process you start with npm. If you expected `docker compose up` and a JSON file, read this first.

## The problem

OPNsense is a FreeBSD firewall. The interesting contract for a writer is not “clone this repo and run a server”. It is: boot an ISO, reach `https://192.168.1.1/`, then call the same `/api/` routes the browser already calls when you click Save.

Four facts fail on a clean ISO: installer user vs `root`, LAN address, no official Docker image, HTTP Basic with a key and a secret.

Platform repo: [github.com/opnsense/core](https://github.com/opnsense/core). Official how-to: [Use the API](https://docs.opnsense.org/development/how-tos/api.html).

## What “no Docker” actually means

The project ships dvd/vga/serial/nano images. Virtual install is any hypervisor that runs FreeBSD, with a 3 GB RAM floor. There is no official `docker compose` for the appliance.

A script with `-u key:secret` hits the same MVC API controller as the GUI. It does not scrape HTML.

```bash
curl -k -u "KEY:SECRET" https://192.168.1.1/api/core/firmware/status
```

`-k` is the factory certificate. Lab only. The secret is a one-time download from **System → Access → Users**.

Generated tables and the how-to sometimes disagree on GET vs POST. Trust the how-to curl and the browser Network tab.

## Links

- [Canonical post](https://brayden-code-4.github.io/TW4-Delivrable/blog/opnsense-api-same-as-gui)
- [Quickstart](https://brayden-code-4.github.io/TW4-Delivrable/docs/quickstart)
- [API overview](https://brayden-code-4.github.io/TW4-Delivrable/docs/api/overview)
