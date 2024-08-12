import request from "supertest";
import mongoose from "mongoose";
import { openDBConnection } from "@/config/db";
import cityModel from "@/models/cities";
import { cities } from "@/seeds/cities";
import { appRouter } from "@/config/routing";
import { env } from "@/config/env";

describe("/cities", () => {
  let app = appRouter.listen(env.PORT);

  beforeAll(async () => {
    await openDBConnection();
  });

  afterAll(async () => {
    app.close();
  });

  afterEach(async () => {
    await cityModel.deleteMany({});
  });

  describe("GET /:id", () => {
    it("should return 404 if city not found", async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toHexString();

      const response = await request(app).get(`/cities/${nonExistentId}`);

      expect(response.status).toBe(404);
    });

    it("should return 400 if id is invalid", async () => {
      const invalidId = "123";

      const response = await request(app).get(`/cities/${invalidId}`);

      expect(response.status).toBe(400);
    });

    it("should return 200 and city data if city is found", async () => {
      const city = new cityModel(cities[0]);
      await city.save();

      const response = await request(app).get(`/cities/${city._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("name", city.name);
    });
  });

  describe("POST /", () => {
    it("should create a new city", async () => {
      const city = cities[0];

      const response = await request(app).post("/cities").send(city);

      expect(response.status).toBe(200);

      const cityInDb = await cityModel.findOne({ name: city.name });

      expect(cityInDb).not.toBeNull();
    });
  });

  describe("DELETE /:id", () => {
    it("should return 404 if city not found", async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toHexString();

      const response = await request(app).delete(`/cities/${nonExistentId}`);

      expect(response.status).toBe(404);
    });

    it("should return 400 if id is invalid", async () => {
      const invalidId = "123";

      const response = await request(app).delete(`/cities/${invalidId}`);

      expect(response.status).toBe(400);
    });

    it("should delete city if city is found", async () => {
      const city = new cityModel(cities[0]);
      await city.save();

      const response = await request(app).delete(`/cities/${city._id}`);

      expect(response.status).toBe(200);

      const cityInDb = await cityModel.findById(city._id);

      expect(cityInDb).toBeNull();
    });
  });
});
