import assert from "node:assert/strict";
import test from "node:test";

import { insertUserSchema } from "../shared/schema";

test("the upgraded Drizzle stack preserves user insert validation", () => {
  assert.deepEqual(
    insertUserSchema.parse({
      username: "mira-user",
      password: "correct horse battery staple",
    }),
    {
      username: "mira-user",
      password: "correct horse battery staple",
    },
  );
  assert.throws(() =>
    insertUserSchema.parse({
      username: "mira-user",
      password: 42,
    }),
  );
});
