import assert from "node:assert/strict";
import { once } from "node:events";
import test from "node:test";
import express from "express";
import {
  createHtmlRequestLimiter,
  sanitizeLogField,
} from "./vite";

test("sanitizeLogField renders control characters inert", () => {
  assert.equal(
    sanitizeLogField("first\r\nforged\u0000entry"),
    "first\\u000d\\u000aforged\\u0000entry",
  );
});

test("HTML request limiter rejects requests above the configured limit", async (t) => {
  const app = express();
  app.get(
    "/page",
    createHtmlRequestLimiter({ windowMs: 60_000, limit: 2 }),
    (_req, res) => res.status(200).send("ok"),
  );

  const server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => server.close());

  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const url = `http://127.0.0.1:${address.port}/page`;

  assert.equal((await fetch(url)).status, 200);
  assert.equal((await fetch(url)).status, 200);

  const rejected = await fetch(url);
  assert.equal(rejected.status, 429);
  assert.match(rejected.headers.get("ratelimit") ?? "", /2-in-1min/i);
});
