---
title: You don't need Postgres to track a writing backlog
tags: node, docker, api, documentation
canonical_url: https://brayden-code-4.github.io/TW4-Delivrable/blog/no-database-task-api
---

Paste this file into Dev.to, Hashnode or Medium. Keep the canonical URL so the Docusaurus post remains the main copy. The PDF asks for a draft prepared for syndication; a public post is better if you have an account.

This article explains why TW4 is a one-file HTTP API with a JSON store, how a request actually moves through the process, and how to run the same thing on Node or in Docker. If you are about to add Redis "just in case", read this first.

## The problem

I wanted a small backlog for documentation work: a title, a status (`todo` / `doing` / `done`), and an id I can paste into a terminal. The usual stack for that is Express + Postgres + an ORM + a `.env` with twelve variables you copy from a wiki.

That stack is fine when you have users and backups. It is not fine when you just need `curl` to create a row in under five minutes. The extra moving parts also make the docs worse. You start explaining migrations before the reader has a `200` on `/health`.

TW4 is the other extreme on purpose: Node's `http` module, no npm dependencies at runtime, one JSON file on disk. The process stays simple enough that the README, the install guide and the API pages can tell the same story.

Repo: [github.com/Brayden-Code-4/TW4-Delivrable](https://github.com/Brayden-Code-4/TW4-Delivrable).

## What "no database" actually means

On start, `src/server.js` reads `.env` (only keys that are not already in the environment), then ensures `data/tasks.json` exists. If the file is missing, it writes `[]`.

Every list or write loads the file, mutates an array in memory, and writes it back. There is no connection pool and no migration folder. There is also no lock. Two processes on the same file will race. For a local tracker that is an acceptable trade. For a team of twenty, it is not. Say that in the docs before someone deploys it on a shared VM and wonders why tasks vanish.

A task looks like this:

```json
{
  "id": "78cb84f4-f939-4729-8c7b-2e3fddedd05b",
  "title": "Write the user guide",
  "status": "todo",
  "createdAt": "2026-09-20T17:50:54.691Z",
  "updatedAt": "2026-09-20T17:50:54.691Z"
}
```

The `id` is `crypto.randomUUID()`. The timestamps are `toISOString()`. Status is one of three strings. If you send `wip`, you get `400`, not a silent coerce.

## How a write request walks the code

A write hits `requireApiKey`, then JSON parse, then load / push / save `tasks.json`. Missing key → `401`. Empty `API_KEY` in env → `500`. GET `/health` and GET `/api/v1/tasks` skip the key. That is a product choice: you can health-check and list without leaking the secret into every CI ping. Writes cannot.

Two details that ate time when I documented the API:

1. Task ids in the URL must match a UUID regex (`[0-9a-fA-F-]{36}`). `GET /api/v1/tasks/1` is not "task not found". It is "no route". The 404 message says `No route for GET /api/v1/tasks/1`. If you document only "unknown id", readers will think the row is missing.

2. Node lowercases headers. You send `X-API-Key`. The code reads `req.headers["x-api-key"]`. `Authorization: Bearer` does nothing.

## Run it natively

Node 20 or newer. Copy `.env.example` to `.env` and replace the example key with yours if you share the machine.

```bash
git clone https://github.com/Brayden-Code-4/TW4-Delivrable.git
cd TW4
cp .env.example .env
npm install
npm start
```

`npm install` does not pull a tree of packages. The `package.json` has no runtime dependencies. Then:

```bash
curl http://127.0.0.1:3000/health
```

You want `"status":"ok"`. Keep that terminal open. In a second one:

```bash
curl -s -X POST http://127.0.0.1:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "X-API-Key: change-me-now" \
  --data-binary '{"title":"Ship the blog post","status":"todo"}'
```

PowerShell users: do not paste the JSON inside `{ }` as a script block. Use `ConvertTo-Json` and `Invoke-RestMethod`, or the request body will not be JSON and you get `400 invalid_json`. That bug is the host, not TW4.

## Same API in Docker

If you do not want Node on the host:

```bash
cp .env.example .env
docker compose up --build
```

Compose publishes port 3000, mounts a named volume on `/app/data`, and hits `/health` as a healthcheck. `HOST` inside the container must remain `0.0.0.0` or the port mapping never reaches the process.

The client commands do not change. `http://127.0.0.1:3000/health` is still the check. That is the point of a small HTTP API: one contract, two ways to start the process.

## What I would document again (and what I would not)

Document the auth header, the three statuses, the UUID rule, and the empty-`API_KEY` → `500` case. Those are the four things that fail on a clean clone.

Do not document Express middleware, ORMs, or "how to scale to Kubernetes" for this repo. You would be writing fiction. If the store becomes SQLite later, add a page then. Until that commit exists, a JSON file is the architecture.

A tiny client is enough as an SDK. Node 20 `fetch` and Python `urllib` both work. Keep the key in `TW4_API_KEY` in the caller so it does not clash with the server's own `API_KEY` if you run both in the same shell.

If something still looks wrong after `/health` is ok, check the key first, then the JSON body, then whether the id is a real UUID. In that order. Most "the API is down" reports are one of those three.

## Why this is easier to explain than a "real" backend

When I wrote the install pages, the native path and the Docker path could share the same `curl` examples. That only works if the public contract is HTTP. The moment you document "run `psql` then `npm run migrate`", you split the audience in two and you maintain two truths.

The JSON file also forces you to be honest in the architecture page. You cannot hide behind "the database handles consistency". You have to say: one writer, one file, reload on every request. Readers who need more can fork. Readers who need less can finish in fifteen minutes.

I would still add a `GET /api/v1/tasks/:id` example with a fake short id (`1`) in the troubleshooting table. It is the fastest way to show the UUID regex. One failed command in the docs is worth a paragraph of theory.

The same idea applies to auth. Show the 401 body. Show the 500 body when `API_KEY` is missing. Do not only show the happy `201`. People copy the happy path, forget the header, and decide the project is broken.

## Links

- [Canonical post on the docs site](https://brayden-code-4.github.io/TW4-Delivrable/blog/no-database-task-api)
- [Quickstart](https://brayden-code-4.github.io/TW4-Delivrable/docs/quickstart)
- [Installation](https://brayden-code-4.github.io/TW4-Delivrable/docs/installation)
- [API overview](https://brayden-code-4.github.io/TW4-Delivrable/docs/api/overview)
- [Code reference](https://brayden-code-4.github.io/TW4-Delivrable/docs/developer/code-reference)
