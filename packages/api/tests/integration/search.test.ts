import request from "supertest";
import { openDBConnection } from "@/config/db";

import hotelsModel from "@/models/hotels";
import { appRouter } from "@/config/routing";
import { env } from "@/config/env";
import cityModel from "@/models/cities";
import countryModel from "@/models/countries";
import redisClient from "@/config/redis";
import logger from "@/config/logger";
import { getSearchCacheKey } from "@/utils/helpers";

const dummyHotels = [
  {
    chain_name: "No chain",
    hotel_name: "Suites South Burlington",
    addressline1: "1712 Shelburne Rd.",
    addressline2: "",
    zipcode: "5403",
    city: "So Burlington (VT)",
    state: "Vermont",
    country: "United States",
    countryisocode: "US",
    star_rating: 2.5,
  },
];

const dummyCities = [{ name: "London" }];

const dummyCountries = [{ country: "United States", countryisocode: "US" }];

const seed = async () => {
  await cityModel.insertMany(dummyCities);
  await hotelsModel.insertMany(dummyHotels);
  await countryModel.insertMany(dummyCountries);
};

const flush = async () => {
  await cityModel.deleteMany();
  await hotelsModel.deleteMany();
  await countryModel.deleteMany();
};

describe("/search", () => {
  let app = appRouter.listen(env.PORT);

  beforeAll(async () => {
    await openDBConnection();
    await flush();
    await redisClient.flushdb();
  });

  beforeEach(async () => {
    await seed();
  });
  afterEach(async () => {
    await flush();
    await redisClient.flushdb();
  });

  afterAll(async () => {
    app.close();
  });

  describe("GET /:term", () => {
    it("should return 200 and empty results if no matches are found", async () => {
      const term = "nonexistentterm";

      const response = await request(app).get(`/search/${term}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("hotels", []);
      expect(response.body.data).toHaveProperty("cities", []);
      expect(response.body.data).toHaveProperty("countries", []);
    });

    it("should return 200 and results if any match is found", async () => {
      const term = "Suites South Burlington";

      const response = await request(app).get(`/search/${term}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty("data");

      expect(response.body.data.hotels).toHaveLength(1);
      expect(response.body.data.countries).toHaveLength(0);
      expect(response.body.data.cities).toHaveLength(0);

      expect(response.body.data.hotels[0]).toHaveProperty(
        "hotel_name",
        dummyHotels[0].hotel_name
      );
    });

    it("should return 200 and support case insensitive partial searches", async () => {
      const term = "LoNd"; // case sensitive partial search term for London

      const response = await request(app).get(`/search/${term}`);

      expect(response.status).toBe(200);

      expect(response.body).toHaveProperty("data");

      expect(response.body.data.hotels).toHaveLength(0);
      expect(response.body.data.countries).toHaveLength(0);
      expect(response.body.data.cities).toHaveLength(1);

      expect(response.body.data.cities[0]).toHaveProperty(
        "name",
        dummyCities[0].name
      );
    });

    it("should return DB data on first hit and then Redis cache data on second hit", async () => {
      const term = "United States";
      const cacheKey = getSearchCacheKey(term);

      // First hit: should fetch from DB
      const initialRedisData = await redisClient.get(cacheKey);
      expect(initialRedisData).toBeNull();

      let firstResponse = await request(app).get(`/search/${term}`);

      const firstResult = firstResponse.body.data;

      const redisDataOnSecondHit = await redisClient.get(cacheKey);

      // Redis data should be equal to the stringified first result
      expect(redisDataOnSecondHit).toBe(JSON.stringify(firstResult));

      expect(firstResponse.body.message).toBe(
        "Search results fetched successfully"
      );

      // Second hit: should fetch from Redis
      const secondResponse = await request(app).get(`/search/${term}`);

      expect(secondResponse.body.message).toBe(
        "Search results retrieved from cache"
      );

      expect(secondResponse.body.data).toEqual(firstResult);
    });

    it("should log error if Redis fails to set the data and then return the data", async () => {
      const term = "Suites South Burlington";
      const cacheKey = getSearchCacheKey(term);
      const redisError = new Error("Something bad happened");

      const redisClientSpy = jest.spyOn(redisClient, "set");
      // Mock Redis to throw an error
      redisClientSpy.mockRejectedValueOnce(redisError);

      const errorloggerSpy = jest.spyOn(logger, "error");

      const response = await request(app).get(`/search/${term}`);

      expect(errorloggerSpy).toHaveBeenCalledWith(
        `Error saving ${cacheKey} to Redis:\n${redisError}`
      );

      expect(response.status).toBe(200);
      expect(response.body.data.hotels).toHaveLength(1);
      expect(response.body.data.countries).toHaveLength(0);
      expect(response.body.data.cities).toHaveLength(0);

      expect(response.body.data.hotels[0]).toHaveProperty(
        "hotel_name",
        dummyHotels[0].hotel_name
      );
    });
  });
});
