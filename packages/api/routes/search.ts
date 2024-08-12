import express, { Request, Response } from "express";
import hotelsModel from "@/models/hotels";
import { successResponse } from "@/utils/response";
import searchCache from "@/middlewares/searchCache";
import redisClient from "@/config/redis";
import { getSearchCacheKey } from "@/utils/helpers";
import logger from "@/config/logger";

const router = express.Router();

type ISearchResult = {
  hotels: {
    _id: string;
    hotel_name: string;
    country: string;
    collection: string;
  }[];
  cities: { _id: string; name: string; collection: string }[];
  countries: { _id: string; country: string; collection: string }[];
};

router.get(
  "/search/:term",
  searchCache,
  async (req: Request, res: Response) => {
    const term = req.params.term;

    const searchQuery = { $regex: term, $options: "i" };
    const limitPerCollection = 5; // Limit results for performance benefits

    const results = await hotelsModel.aggregate<ISearchResult>([
      {
        $match: {
          $or: [{ hotel_name: searchQuery }, { country: searchQuery }],
        },
      },
      { $limit: limitPerCollection },
      { $project: { _id: 1, hotel_name: 1, country: 1 } },
      { $addFields: { collection: "hotels" } },
      {
        $unionWith: {
          coll: "cities",
          pipeline: [
            { $match: { name: searchQuery } },
            { $project: { _id: 1, name: 1 } },
            { $addFields: { collection: "cities" } },
            { $limit: limitPerCollection },
          ],
        },
      },
      {
        $unionWith: {
          coll: "countries",
          pipeline: [
            { $match: { country: searchQuery } },
            { $project: { _id: 1, country: 1 } },
            { $addFields: { collection: "countries" } },
            { $limit: limitPerCollection },
          ],
        },
      },
      {
        $facet: {
          hotels: [{ $match: { collection: "hotels" } }],
          cities: [{ $match: { collection: "cities" } }],
          countries: [{ $match: { collection: "countries" } }],
        },
      },
    ]);

    const groupedResults = {
      hotels: results[0].hotels.map(({ collection, ...rest }) => rest),
      cities: results[0].cities.map(({ collection, ...rest }) => rest),
      countries: results[0].countries.map(({ collection, ...rest }) => rest),
    };

    const cacheKey = getSearchCacheKey(term);

    try {
      // cache the search results for 10 minutes
      await redisClient.set(
        cacheKey,
        JSON.stringify(groupedResults),
        "EX",
        600
      );
    } catch (error) {
      // if Redis fails, log the error and proceed
      logger.error(`Error saving ${cacheKey} to Redis:\n${error}`);
    }

    res.send(
      successResponse("Search results fetched successfully", groupedResults)
    );
  }
);

const searchRouter = router;

export default searchRouter;
