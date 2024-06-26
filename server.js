const express = require("express");
const next = require("next");
const { createProxyMiddleware } = require("http-proxy-middleware");
const port = process.env.PORT || 3030;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const apiPaths = {
  "/api": {
    target: "http://localhost:3060",
    pathRewrite: {
      "^/api": "/api",
    },
    changeOrigin: true,
  },
};

app
  .prepare()
  .then(() => {
    const server = express();

    server.use("/api", createProxyMiddleware(apiPaths["/api"]));

    server.all("*", (req, res) => {
      return handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log("Error:::::", err);
  });
