import { cities } from "@/seeds/cities";
import { countries } from "@/seeds/countries";
import { hotels } from "@/seeds/hotels";
import { openDBConnection } from "@/config/db";

import hotelModel from "@/models/hotels";
import cityModel from "@/models/cities";
import countryModel from "@/models/countries";
import logger from "@/config/logger";

await openDBConnection();
seedDatabase();

async function seedDatabase() {
  try {
    // clear the database
    await hotelModel.deleteMany({});
    await cityModel.deleteMany({});
    await countryModel.deleteMany({});
    // seed the database
    await hotelModel.insertMany(hotels);
    await cityModel.insertMany(cities);
    await countryModel.insertMany(countries);
    logger.info("Database seeded successfully! 🌱");
  } catch (error) {
    logger.error(error);
  } finally {
    process.exit(0);
  }
}
