import request from "supertest";
import mongoose from "mongoose";
import { openDBConnection } from "@/config/db";
import { countries } from "@/seeds/countries";
import countryModel from "@/models/countries";
import { appRouter } from "@/config/routing";
import { env } from "@/config/env";

describe("/countries", () => {
  let app = appRouter.listen(env.PORT);

  beforeAll(async () => {
    await openDBConnection();
  });

  afterAll(async () => {
    app.close();
  });

  afterEach(async () => {
    await countryModel.deleteMany({});
  });

  describe("GET /:id", () => {
    it("should return 404 if country not found", async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toHexString();

      const response = await request(app).get(`/countries/${nonExistentId}`);

      expect(response.status).toBe(404);
    });

    it("should return 400 if id is invalid", async () => {
      const invalidId = "123";

      const response = await request(app).get(`/countries/${invalidId}`);

      expect(response.status).toBe(400);
    });

    it("should return 200 and country data if country is found", async () => {
      const country = new countryModel(countries[0]);
      await country.save();

      const response = await request(app).get(`/countries/${country._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("country", country.country);
    });
  });
});
