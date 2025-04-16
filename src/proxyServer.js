const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(
  "/figuro",
  createProxyMiddleware({
    target: "https://www.figuro.io",
    changeOrigin: true,
    pathRewrite: { "^/figuro": "" },
    secure: false,
  })
);

const PORT = 5001; // Прокси-сервер работает на порту 5001
app.listen(PORT, () => console.log(`🚀 Прокси запущен на http://localhost:${PORT}`));
