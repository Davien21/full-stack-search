import request from "supertest";
import { appRouter } from "@/config/routing";
import { NotFoundError } from "@/config/errors";
import { env } from "@/config/env";

describe("Miscellanous", () => {
  let app = appRouter.listen(env.PORT);

  afterAll(async () => {
    app.close();
  });

  describe("GET /non-existent-route", () => {
    it("should return a 404 error for non-existent routes", async () => {
      const response = await request(appRouter).get("/non-existent-route");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "message",
        new NotFoundError().message
      );
    });
  });
});
