# TW4 docs

Docusaurus source for the live site: [brayden-code-4.github.io/TW4-Delivrable](https://brayden-code-4.github.io/TW4-Delivrable/).

```bash
cd website
npm install
npm start
```

Build:

```bash
npm run build
```

GitHub Actions (`.github/workflows/deploy-docs.yml`) publishes `website/build` to the `gh-pages` branch. If the live URL is 404, enable Pages: repo **Settings → Pages → Deploy from a branch → `gh-pages` / `/`**.

Syndication draft for Dev.to / Hashnode / Medium: `syndication-devto.md` (paste it; keep the canonical URL).
