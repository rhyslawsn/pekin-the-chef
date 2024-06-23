import * as trpcExpress from "@trpc/server/adapters/express";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import ws from "ws";

import { prisma } from "./config/prisma.config";
import { createContext } from "./context";
import { Router, router } from "./procedures/web";
import { app } from "./server";

const port = process.env.PORT ?? 3000;

const server = app.listen(Number(port), () =>
  console.log(`🦆 Pekin the Chef (API) is now running on PORT ${port}`)
);

app.use(
  "/v1/trpc",
  trpcExpress.createExpressMiddleware({
    router,
    createContext,
  })
);

const wssWeb = new ws.Server({
  noServer: true,
});

const handlerWeb = applyWSSHandler<Router>({
  wss: wssWeb,
  router,
  createContext,
});

server.on("upgrade", (req, sock, head) => {
  const pathname = req.url.split("?")[0];
  switch (pathname) {
    case "/web":
      wssWeb.handleUpgrade(req, sock, head, (ws) => {
        wssWeb.emit("connection", ws, req);
      });
      break;
  }
});

wssWeb.on("connection", (ws) => {
  console.log(`➕ Web connection (${wssWeb.clients.size})`);
  ws.once("close", () => {
    console.log(`➖ Web connection (${wssWeb.clients.size})`);
  });
});

const gracefulShutdown = async () => {
  try {
    console.log("shutting down... and cleaning up");

    handlerWeb.broadcastReconnectNotification();
    wssWeb.close();
    await prisma.$disconnect();

    console.log("✅ done");
    process.exit(0);
  } catch (error) {
    console.error("❌ error", error);
    process.exit(1);
  }
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

export type { Router };
