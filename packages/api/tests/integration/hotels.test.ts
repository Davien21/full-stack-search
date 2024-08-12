import request from "supertest";
import mongoose from "mongoose";
import { openDBConnection } from "@/config/db";

import hotelsModel from "@/models/hotels";
import { hotels } from "@/seeds/hotels";
import { appRouter } from "@/config/routing";
import { env } from "@/config/env";

describe("/hotels", () => {
  let app = appRouter.listen(env.PORT);

  beforeAll(async () => {
    await openDBConnection();
  });

  afterAll(async () => {
    app.close();
  });

  afterEach(async () => {
    await hotelsModel.deleteMany({});
  });

  describe("GET /:id", () => {
    it("should return 404 if hotel not found", async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toHexString();

      const response = await request(app).get(`/hotels/${nonExistentId}`);

      expect(response.status).toBe(404);
    });

    it("should return 400 if id is invalid", async () => {
      const invalidId = "123";

      const response = await request(app).get(`/hotels/${invalidId}`);

      expect(response.status).toBe(400);
    });

    it("should return 200 and hotel data if hotel is found", async () => {
      const hotel = new hotelsModel(hotels[0]);
      await hotel.save();

      const response = await request(app).get(`/hotels/${hotel._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("hotel_name", hotel.hotel_name);
    });
  });
});
