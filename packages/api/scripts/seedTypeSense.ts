import TypesenseClient from "@/config/typesense";
import { CollectionSchema } from "typesense/lib/Typesense/Collection";
import { hotels } from "@/seeds/hotels";
import { countries } from "@/seeds/countries";
import { cities } from "@/seeds/cities";
import hotelModel from "@/models/hotels";
import cityModel from "@/models/cities";
import countryModel from "@/models/countries";
import logger from "@/config/logger";
import { openDBConnection } from "@/config/db";

const hotelSchema = {
  name: "hotels",
  fields: [
    { name: "chain_name", type: "string" },
    { name: "hotel_name", type: "string", index: true },
    { name: "addressline1", type: "string" },
    { name: "addressline2", type: "string" },
    { name: "zipcode", type: "string" },
    { name: "city", type: "string" },
    { name: "state", type: "string" },
    { name: "country", type: "string", index: true },
    { name: "countryisocode", type: "string" },
    { name: "star_rating", type: "float" },
  ],
} as CollectionSchema;

const countrySchema = {
  name: "countries",
  fields: [
    { name: "country", type: "string", index: true },
    { name: "countryisocode", type: "string" },
  ],
} as CollectionSchema;

const citySchema = {
  name: "cities",
  fields: [{ name: "name", type: "string", index: true }],
} as CollectionSchema;

async function createCollections() {
  const collections = await TypesenseClient.collections().retrieve();

  const schemas = [hotelSchema, countrySchema, citySchema];

  const createCollectionPromises = schemas.map(async (schema) => {
    if (!collections.some((collection) => collection.name === schema.name)) {
      return TypesenseClient.collections().create(schema);
    }
  });

  // Run collection creation in parallel
  await Promise.all(createCollectionPromises);
}

async function seedTypesense() {
  const seedPromises = [
    TypesenseClient.collections("hotels").documents().import(hotels),
    TypesenseClient.collections("countries").documents().import(countries),
    TypesenseClient.collections("cities").documents().import(cities),
  ];

  // Run seeding in parallel
  await Promise.all(seedPromises);

  logger.info("All data seeded in Typesense 🏨🌍🌆");
}

async function clearDataInCollections() {
  const collectionNames = ["hotels", "countries", "cities"];

  const clearCollectionPromises = collectionNames.map(async (name) => {
    try {
      const collection = await TypesenseClient.collections(name).retrieve();
      if (collection) {
        return TypesenseClient.collections(name)
          .documents()
          .delete({ filter_by: "id:*" });
      }
    } catch (error) {
      console.error(`Error clearing ${name} collection:`, error);
    }
  });

  // Run clearing in parallel
  await Promise.all(clearCollectionPromises);

  console.log("All collections cleared in Typesense");
}

export async function seedDatabase() {
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
    throw error;
  } finally {
  }
}

async function deleteCollections() {
  const collections = await TypesenseClient.collections().retrieve();

  const deleteCollectionPromises = collections.map(async (collection) => {
    return TypesenseClient.collections(collection.name).delete();
  });

  // Run collection deletion in parallel
  await Promise.all(deleteCollectionPromises);
}

async function run() {
  try {
    await openDBConnection();
    await seedDatabase();

    await deleteCollections();
    await createCollections();

    await seedTypesense();
  } catch (error) {
    console.error(`Error during seeding process: ${error}`);
  } finally {
    process.exit(0);
  }
}

await run();
