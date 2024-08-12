import { model, Schema } from "mongoose";

interface ICountry {
  country: string;
  countryisocode: string;
}

const countrySchema = new Schema<ICountry>(
  {
    country: { type: String, required: true, index: true },
    countryisocode: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const countryModel = model("country", countrySchema);

export default countryModel;
