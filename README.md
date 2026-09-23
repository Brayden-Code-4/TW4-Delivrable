# OPNsense docs (TW4)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docs](https://github.com/Brayden-Code-4/TW4-Delivrable/actions/workflows/deploy-docs.yml/badge.svg)](https://github.com/Brayden-Code-4/TW4-Delivrable/actions/workflows/deploy-docs.yml)

**OPNsense is the platform we document.** This repository is our group's documentation site, not a fork of the firewall sources.

OPNsense is an open-source firewall and routing appliance (FreeBSD). Network and security teams use it to filter traffic, assign LAN/WAN, and run VPN or DHCP. This README explain how to get a lab instance running and how to open the GUI.

Docs site: [brayden-code-4.github.io/TW4-Delivrable](https://brayden-code-4.github.io/TW4-Delivrable/)

Platform sources: [github.com/opnsense/core](https://github.com/opnsense/core)

Official handbook: [docs.opnsense.org](https://docs.opnsense.org/)

If the docs URL is 404, open [Settings → Pages](https://github.com/Brayden-Code-4/TW4-Delivrable/settings/pages) and set **Deploy from a branch** → `gh-pages` / `/`.

## Overview

You do not `npm start` OPNsense. You download an ISO (or USB image), boot it, and install to disk. The live GUI listens on **https://192.168.1.1/** by default.

| | |
| --- | --- |
| Platform | OPNsense (amd64) |
| Typical lab | VirtualBox / VMware / Hyper-V / KVM |
| Default LAN | `192.168.1.1/24` |
| Default GUI user | `root` / `opnsense` |
| Installer (live ISO) | `installer` / `opnsense` |
| API | HTTPS, HTTP Basic (`key` + `secret`) |

There is **no official Docker image**. A `docker compose up` of OPNsense is not something the project ships. For a repeatable lab, use a VM. That is the supported path.

## Prerequisites

| Tool | Version | Hardware ISO | VM lab |
| --- | --- | --- | --- |
| [Git](https://git-scm.com/downloads) | 2.40+ | Yes (this repo) | Yes |
| x86-64 machine or hypervisor | — | Yes | Yes |
| RAM for the firewall | 2 GB min, **3 GB** on a VM | Yes | Yes |
| Disk | 8 GB+ recommended | Yes | Yes |
| Two network ports (WAN + LAN) | — | Yes | Two virtual NICs |
| [VirtualBox](https://www.virtualbox.org/) 7+ or another FreeBSD-capable hypervisor | — | No | Yes |

```bash
git --version
```

On Windows, also install VirtualBox if you follow the lab path.

## Installation (native / hardware)

### 1. Download the image

Open [opnsense.org/download](https://opnsense.org/download/). Pick **amd64**, image type **dvd** (ISO) for a VM or optical boot, or **vga** for a USB stick.

Verify the SHA-256 as described in the [official install chapter](https://docs.opnsense.org/manual/install.html). Unpack `.bz2` (`bzip2 -d` or 7-Zip) before you write the media.

### 2. Boot the live system

Write the USB image with `dd`, Etcher or Rufus, or attach the ISO to a machine. Boot from that media.

### 3. Install to disk

At the live login, use:

```text
user: installer
password: opnsense
```

Walk the installer (keymap, UFS or ZFS, disk, root password). Reboot and remove the ISO/USB.

### 4. Open the GUI

From a client on the LAN:

```text
https://192.168.1.1/
user: root
password: opnsense   (or the password you set)
```

The self-signed certificate warning is expected on a fresh box. Change the root password if you kept the default.

The GUI stay up as long as the appliance is running.

## Installation (virtual lab)

Same ISO. Official note: OPNsense runs on hypervisors that support FreeBSD (VirtualBox, VMware, Hyper-V, KVM). See [Virtual & Cloud-Based Installation](https://docs.opnsense.org/manual/virtuals.html).

Suggested VirtualBox values:

| Setting | Value |
| --- | --- |
| Type | BSD / FreeBSD (64-bit) |
| RAM | 3072 MB (3 GB minimum) |
| Disk | 16 GB |
| Adapter 1 | LAN (Host-only or Internal) |
| Adapter 2 | WAN (NAT or Bridged, DHCP) |

Attach the DVD ISO, start the VM, then the same `installer` / `opnsense` flow as native.

Guest additions (optional): plugin `os-virtualbox` under **System → Firmware → Plugins**.

## Quickstart

ISO already downloaded. VM created as above.

1. Start the VM. Login `installer` / `opnsense`. Finish the installer. Reboot.
2. On the host, open `https://192.168.1.1/` and accept the certificate warning.
3. Login `root` / your password.
4. **System → Access → Users** → edit `root` → API **+**. Download the `.txt` once (`key=` / `secret=`).
5. From a machine that can reach the LAN IP:

```bash
curl -k -u "YOUR_KEY:YOUR_SECRET" https://192.168.1.1/api/core/firmware/status
```

`-k` skips TLS verify. Lab only. Don't use that on a production firewall.

A JSON body means the API accepted the key. `401` / empty HTML login page means the user cannot call that endpoint, or the pair is wrong.

## Configuration

Nothing in this repo starts the firewall. Values below are on the appliance.

| Name | Description | Required | Default | Example |
| --- | --- | --- | --- | --- |
| LAN IPv4 | GUI and API address | Yes | `192.168.1.1/24` | `192.168.1.1` |
| WAN | Upstream | Yes | DHCP client | DHCP |
| `root` password | Console + GUI | Yes | `opnsense` on a fresh live ISO | your secret |
| API key | Basic-auth username | For API | none until you create one | from the download |
| API secret | Basic-auth password | For API | shown **once** | from the download |

Empty or lost secret → create a new key. OPNsense does not store the secret again.

## Limits (say this in a demo)

- Default `root` / `opnsense` is for a **lab**. Change it.
- API secret is a one-time download.
- `-k` on curl is for the factory certificate, not for the internet.
- This repo documents OPNsense. It is not `opnsense/core`.

## Layout

```text
TW4-Delivrable/
├── README.md
├── CONTRIBUTORS.md
├── LICENSE
├── website/                 # Docusaurus (guides, API, blog)
│   ├── docs/
│   ├── blog/
│   ├── static/openapi.yaml
│   └── syndication-devto.md
└── .github/workflows/       # docs build + Pages
```

## Contributing

Fork this docs repo. Edit `website/docs`. Run `cd website && npm install && npm start`. Open a pull request that says which official page you checked.

If something don't work on a clean ISO, open an issue with the OPNsense version, the hypervisor, and the URL you called.

## License

This documentation is [MIT](LICENSE). OPNsense itself is BSD-2-Clause; see [github.com/opnsense/core](https://github.com/opnsense/core).
