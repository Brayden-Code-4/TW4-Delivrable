# OPNsense docs (this site)

Docusaurus source for [brayden-code-4.github.io/TW4-Delivrable](https://brayden-code-4.github.io/TW4-Delivrable/). The platform is OPNsense, not a local Node API.

```bash
cd website
npm install
npm start
```

Build: `npm run build`.

GitHub Actions publishes `website/build` to `gh-pages`. If the live URL is 404, enable Pages: **Settings → Pages → Deploy from a branch → `gh-pages` / `/`**.
