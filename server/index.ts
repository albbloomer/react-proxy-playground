import express from "express";
import compression from "compression";
import sirv from "sirv";
import fs from "node:fs";
import path from "node:path";
import { createServer as createViteServer } from "vite";

const isProd = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT) || 5173;
const root = process.cwd();

async function createServer() {
  const app = express();
  app.use(compression());

  let vite: any;
  if (!isProd) {
    vite = await createViteServer({
      root,
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  } else {
    app.use(sirv(path.resolve(root, "dist/client"), { extensions: [] }));
  }

  app.use(async (req, res) => {
    try {
      const url = req.originalUrl;

      let template: string;
      let render: (url: string) => Promise<{ appHtml: string; state: any }>;

      if (!isProd) {
        template = fs.readFileSync(path.resolve(root, "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule("/src/entry-server.tsx")).render;
      } else {
        template = fs.readFileSync(path.resolve(root, "dist/client/index.html"), "utf-8");
        render = (await import(path.resolve(root, "dist/server/entry-server.js"))).render;
      }

      const { appHtml, state } = await render(url);

      const html = template
        .replace("<!--app-html-->", appHtml)
        .replace(
          "window.__INITIAL_STATE__ = window.__INITIAL_STATE__ || {};",
          `window.__INITIAL_STATE__ = ${JSON.stringify(state).replace(/</g, "\\u003c")};`
        );

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: any) {
      if (!isProd) vite?.ssrFixStacktrace(e);
      res.status(500).end(e?.stack || String(e));
    }
  });

  app.listen(port, () => console.log(`http://localhost:${port}`));
}

createServer();